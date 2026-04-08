import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { groupCardsByTheme } from "@/lib/ai/group-cards";
import { emit } from "@/lib/realtime/event-bus";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { retroId } = await request.json();

  const retroCards = await db
    .select({ id: cards.id, text: cards.text })
    .from(cards)
    .where(eq(cards.retroId, retroId));

  const results = await groupCardsByTheme(retroCards);

  // Update cards with group labels
  for (const result of results) {
    if (result.groupLabel) {
      await db
        .update(cards)
        .set({ groupLabel: result.groupLabel })
        .where(eq(cards.id, result.cardId));
    }
  }

  emit(retroId, {
    type: "group_updated",
    cards: results
      .filter((r) => r.groupLabel)
      .map((r) => ({ cardId: r.cardId, groupLabel: r.groupLabel! })),
  });

  return NextResponse.json({ results });
}
