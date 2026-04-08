import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, users } from "@/lib/db/schema";
import { eq, ne, sql } from "drizzle-orm";
import OpenAI from "openai";

const ANONYMOUS_ID = "00000000-0000-4000-8000-000000000000";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Build author profiles from known (non-anonymous) cards
  const knownCards = await db
    .select({ text: cards.text, authorName: users.name })
    .from(cards)
    .innerJoin(users, eq(cards.authorId, users.id))
    .where(ne(cards.authorId, ANONYMOUS_ID));

  const profiles: Record<string, string[]> = {};
  for (const card of knownCards) {
    if (!profiles[card.authorName]) profiles[card.authorName] = [];
    if (profiles[card.authorName].length < 20) {
      profiles[card.authorName].push(card.text.substring(0, 120));
    }
  }

  const profileText = Object.entries(profiles)
    .map(([name, samples]) => `## ${name} (${samples.length} known cards)\n${samples.map((s) => `- ${s}`).join("\n")}`)
    .join("\n\n");

  // 2. Fetch anonymous cards
  const anonCards = await db
    .select({ id: cards.id, text: cards.text, guessedAuthor: cards.guessedAuthor })
    .from(cards)
    .where(eq(cards.authorId, ANONYMOUS_ID));

  if (anonCards.length === 0) {
    return NextResponse.json({ total: 0, guessed: 0, unchanged: 0 });
  }

  const authorNames = Object.keys(profiles);
  let guessed = 0;
  let unchanged = 0;

  // 3. Process in batches of 30
  const openai = getOpenAI();
  for (let i = 0; i < anonCards.length; i += 30) {
    const batch = anonCards.slice(i, i + 30);
    const cardTexts = batch.map((c, j) => `[${j}] ${c.text.substring(0, 150)}`).join("\n");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `You are matching anonymous retro cards to known authors based on writing style. Be conservative — only guess when fairly confident. Available authors: ${authorNames.join(", ")}.\n\nKnown writing samples:\n${profileText}`,
          },
          {
            role: "user",
            content: `Guess the author for each card. Return a JSON array of author names (one per card, in order). Use null if uncertain.\n\nCards:\n${cardTexts}`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (content) {
        const jsonStr = content.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
        const guesses: (string | null)[] = JSON.parse(jsonStr);

        for (let j = 0; j < batch.length && j < guesses.length; j++) {
          const newGuess = guesses[j];
          const card = batch[j];

          if (newGuess && newGuess !== card.guessedAuthor) {
            await db.update(cards).set({ guessedAuthor: newGuess }).where(eq(cards.id, card.id));
            guessed++;
          } else {
            unchanged++;
          }
        }
      }
    } catch (error) {
      console.error("Batch guess failed:", error);
    }
  }

  return NextResponse.json({
    total: anonCards.length,
    guessed,
    unchanged,
  });
}
