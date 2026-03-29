import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { retros, cards, votes, actionItems, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { StatsClient } from "./stats-client";

export default async function RetroStatsPage({
  params,
}: {
  params: Promise<{ "team-slug": string; id: string }>;
}) {
  const { id: retroId } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [retro] = await db
    .select({
      id: retros.id,
      title: retros.title,
      date: retros.date,
      location: retros.location,
      photoUrl: retros.photoUrl,
      template: retros.template,
      statsCache: retros.statsCache,
    })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1);

  if (!retro) notFound();

  // Card stats
  const cardRows = await db
    .select({
      id: cards.id,
      isDiscussed: cards.isDiscussed,
      categoryId: cards.categoryId,
    })
    .from(cards)
    .where(eq(cards.retroId, retroId));

  const totalCards = cardRows.length;
  const discussedCards = cardRows.filter((c) => c.isDiscussed).length;

  // Vote count
  const [voteCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(votes)
    .where(
      sql`${votes.cardId} IN (SELECT id FROM cards WHERE retro_id = ${retroId})`
    );

  // Action items with assignee names
  const actionRows = await db
    .select({
      id: actionItems.id,
      text: actionItems.text,
      status: actionItems.status,
      dueDate: actionItems.dueDate,
      assigneeName: users.name,
    })
    .from(actionItems)
    .leftJoin(users, eq(actionItems.assigneeId, users.id))
    .where(eq(actionItems.retroId, retroId))
    .orderBy(actionItems.createdAt);

  const initialStats = retro.statsCache ? JSON.parse(retro.statsCache) : null;

  return (
    <StatsClient
      retroId={retro.id}
      retroTitle={retro.title}
      retroDate={retro.date}
      retroLocation={retro.location}
      retroPhotoUrl={retro.photoUrl}
      totalCards={totalCards}
      discussedCards={discussedCards}
      totalVotes={Number(voteCount?.count ?? 0)}
      actionItems={actionRows}
      initialStats={initialStats}
    />
  );
}
