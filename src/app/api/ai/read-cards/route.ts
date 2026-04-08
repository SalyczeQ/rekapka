import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, categories, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { retroId } = await request.json();

  const retroCards = await db
    .select({
      text: cards.text,
      categoryName: categories.name,
      authorName: users.name,
    })
    .from(cards)
    .innerJoin(categories, eq(cards.categoryId, categories.id))
    .innerJoin(users, eq(cards.authorId, users.id))
    .where(eq(cards.retroId, retroId));

  if (retroCards.length === 0) {
    return NextResponse.json({ error: "No cards to analyze" }, { status: 400 });
  }

  const cardTexts = retroCards
    .map((c) => `[${c.categoryName}] (${c.authorName}) ${c.text}`)
    .join("\n");

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `You are a retrospective facilitator reading ${retroCards.length} cards from a team retro. The cards are categorized as Mad (frustrations), Sad (things that could be better), and Glad (positives).

Provide a concise analysis in JSON:
{
  "summary": "2-3 sentence overview of what the team wrote",
  "themes": ["3-5 key themes as short phrases"],
  "mood": "one word: positive, mixed, or concerned",
  "focusPoints": ["3-4 specific topics worth discussing, phrased as questions or discussion prompts"]
}

Be specific and reference actual card content. Keep it brief and actionable.`,
        },
        {
          role: "user",
          content: `Read and analyze these retro cards:\n\n${cardTexts}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content) {
      const jsonStr = content.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  } catch (error) {
    console.error("AI read-cards failed:", error);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
