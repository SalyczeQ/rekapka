import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { retros, cards, categories, users, appSettings } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import OpenAI from "openai";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { retroIds } = await request.json();

  if (!retroIds || !Array.isArray(retroIds) || retroIds.length === 0) {
    return NextResponse.json({ error: "No retro IDs provided" }, { status: 400 });
  }

  // Fetch cards with category and author info
  const retroCards = await db
    .select({
      text: cards.text,
      categoryName: categories.name,
      authorName: users.name,
      isDiscussed: cards.isDiscussed,
      retroId: cards.retroId,
    })
    .from(cards)
    .innerJoin(categories, eq(cards.categoryId, categories.id))
    .innerJoin(users, eq(cards.authorId, users.id))
    .where(sql`${cards.retroId} IN ${retroIds}`);

  // Fetch retro titles for context
  const retroList = await db
    .select({ id: retros.id, title: retros.title, date: retros.date })
    .from(retros)
    .where(sql`${retros.id} IN ${retroIds}`)
    .orderBy(desc(retros.date));

  // Build prompt
  const retroSummaries = retroList.map((r) => {
    const rCards = retroCards.filter((c) => c.retroId === r.id);
    const cardTexts = rCards.map((c) => `  [${c.categoryName}] ${c.text}`).join("\n");
    return `## ${r.title} (${r.date})\n${cardTexts}`;
  }).join("\n\n");

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `You are a retrospective facilitator analyzing ${retroIds.length} retrospectives for a team. Provide:
1) "recurringThemes" — 3-5 themes that appear across multiple retros (short phrases)
2) "sentimentTrend" — brief description of how team sentiment is changing over time (1-2 sentences)
3) "unresolvedPatterns" — 2-3 issues that keep coming up in Mad/Sad categories across retros
4) "recommendations" — 3-4 actionable recommendations for the team
5) "summary" — 2-3 sentence executive summary

Respond in JSON: {"recurringThemes": [...], "sentimentTrend": "...", "unresolvedPatterns": [...], "recommendations": [...], "summary": "..."}`,
        },
        {
          role: "user",
          content: `Analyze these ${retroIds.length} retrospectives:\n\n${retroSummaries}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content) {
      const jsonStr = content.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      await logAudit({
        actor: session.user,
        action: AUDIT_ACTIONS.AI_TEAM_STATS,
        metadata: { retroCount: retroIds.length },
      });
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  } catch (error) {
    console.error("AI team stats generation failed:", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
