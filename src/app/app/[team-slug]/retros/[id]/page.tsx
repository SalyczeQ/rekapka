import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  teams as teamsTable,
  retros,
  categories,
  cards,
  votes,
  teamMembers,
} from "@/lib/db/schema";
import { eq, and, inArray, asc } from "drizzle-orm";
import { RetroSession } from "@/components/retro/retro-session";

export default async function RetroPage({
  params,
}: {
  params: Promise<{ "team-slug": string; id: string }>;
}) {
  const { "team-slug": teamSlug, id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [team] = await db
    .select({ id: teamsTable.id })
    .from(teamsTable)
    .where(eq(teamsTable.slug, teamSlug))
    .limit(1);
  if (!team) notFound();

  const [retro] = await db
    .select()
    .from(retros)
    .where(and(eq(retros.id, id), eq(retros.teamId, team.id)))
    .limit(1);
  if (!retro) notFound();

  const retroCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.retroId, retro.id))
    .orderBy(asc(categories.sortOrder));

  const retroCards = await db
    .select()
    .from(cards)
    .where(eq(cards.retroId, retro.id))
    .orderBy(asc(cards.createdAt));

  const cardIds = retroCards.map((c) => c.id);
  const retroVotes =
    cardIds.length > 0
      ? await db
          .select()
          .from(votes)
          .where(inArray(votes.cardId, cardIds))
      : [];

  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, team.id),
        eq(teamMembers.userId, session.user.id)
      )
    )
    .limit(1);

  // Map Drizzle camelCase output to snake_case props expected by RetroSession
  // (RetroSession still uses Supabase client internally for realtime — will be migrated later)
  return (
    <RetroSession
      retro={{
        id: retro.id,
        title: retro.title,
        status: retro.status,
        template: retro.template,
        location: retro.location,
        photo_url: retro.photoUrl,
        date: retro.date,
        max_votes: retro.maxVotes,
        phase_timer_seconds: retro.phaseTimerSeconds,
      }}
      categories={retroCategories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        sort_order: c.sortOrder,
        color: c.color,
      }))}
      initialCards={retroCards.map((c) => ({
        id: c.id,
        category_id: c.categoryId,
        author_id: c.authorId,
        text: c.text,
        sort_order: c.sortOrder,
        group_label: c.groupLabel,
        is_discussed: c.isDiscussed,
        created_at: c.createdAt.toISOString(),
      }))}
      initialVotes={retroVotes.map((v) => ({
        id: v.id,
        card_id: v.cardId,
        user_id: v.userId,
      }))}
      currentUserId={session.user.id}
      userRole={membership?.role ?? "member"}
      teamSlug={teamSlug}
    />
  );
}
