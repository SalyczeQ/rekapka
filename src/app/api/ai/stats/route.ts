import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, categories, users, retros, actionItems } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { generateRetroStats } from "@/lib/ai/generate-stats";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { retroId } = await request.json();

  const [retro] = await db
    .select()
    .from(retros)
    .where(eq(retros.id, retroId));

  if (!retro) {
    return NextResponse.json({ error: "Retro not found" }, { status: 404 });
  }

  // Return cached stats if available
  if (retro.statsCache) {
    await logAudit({
      actor: session.user,
      action: AUDIT_ACTIONS.AI_STATS,
      entityType: "retro",
      entityId: retroId,
      retroId,
      metadata: { retroId, retroTitle: retro.title, cached: true },
    });
    return NextResponse.json(JSON.parse(retro.statsCache));
  }

  const [retroCards, actionItemCountResult] = await Promise.all([
    db
      .select({
        id: cards.id,
        text: cards.text,
        categoryName: categories.name,
        authorName: users.name,
        isDiscussed: cards.isDiscussed,
        isSkipped: cards.isSkipped,
        discussionDurationSec: cards.discussionDurationSec,
      })
      .from(cards)
      .innerJoin(categories, eq(cards.categoryId, categories.id))
      .innerJoin(users, eq(cards.authorId, users.id))
      .where(eq(cards.retroId, retroId)),
    db
      .select({ count: count() })
      .from(actionItems)
      .where(eq(actionItems.retroId, retroId)),
  ]);

  const stats = await generateRetroStats(
    retroCards,
    retro.totalDurationSec ?? 0,
    actionItemCountResult[0]?.count ?? 0
  );

  // Cache the results
  await db
    .update(retros)
    .set({ statsCache: JSON.stringify(stats) })
    .where(eq(retros.id, retroId));

  await logAudit({
    actor: session.user,
    action: AUDIT_ACTIONS.AI_STATS,
    entityType: "retro",
    entityId: retroId,
    retroId,
    metadata: { retroId, retroTitle: retro.title, cached: false, cardCount: retroCards.length },
  });

  return NextResponse.json(stats);
}
