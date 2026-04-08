import { db } from "@/lib/db";
import { retros, cards, categories, users, actionItems, tags, cardTags } from "@/lib/db/schema";
import { eq, desc, sql, count, sum, and, gte } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { TeamStatsDashboard } from "@/components/stats/team-stats-dashboard";

function serialize<T>(obj: unknown): T {
  return JSON.parse(JSON.stringify(obj));
}

export default async function TeamStatsPage() {
  await requireAuth();

  // Fetch all completed retros
  const completedRetros = await db
    .select({
      id: retros.id,
      title: retros.title,
      date: retros.date,
      startedAt: retros.startedAt,
      completedAt: retros.completedAt,
      totalDurationSec: retros.totalDurationSec,
    })
    .from(retros)
    .where(eq(retros.status, "completed"))
    .orderBy(desc(retros.date));

  if (completedRetros.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Team Stats</h1>
        <p className="text-muted-foreground">No completed retros yet.</p>
      </div>
    );
  }

  const retroIds = completedRetros.map((r) => r.id);

  // Fetch all cards for completed retros
  const allCards = await db
    .select({
      id: cards.id,
      retroId: cards.retroId,
      categoryId: cards.categoryId,
      authorId: cards.authorId,
      text: cards.text,
      isDiscussed: cards.isDiscussed,
      isSkipped: cards.isSkipped,
      discussionDurationSec: cards.discussionDurationSec,
      categoryName: categories.name,
      authorName: users.name,
    })
    .from(cards)
    .innerJoin(categories, eq(cards.categoryId, categories.id))
    .innerJoin(users, eq(cards.authorId, users.id))
    .where(sql`${cards.retroId} IN ${retroIds}`);

  // Fetch action items
  const allActionItems = await db
    .select({
      id: actionItems.id,
      retroId: actionItems.retroId,
      status: actionItems.status,
      assigneeId: actionItems.assigneeId,
    })
    .from(actionItems)
    .where(sql`${actionItems.retroId} IN ${retroIds}`);

  // Fetch all users
  const allUsers = await db
    .select({ id: users.id, name: users.name, color: users.color })
    .from(users);

  // Fetch top tags
  const topTags = await db
    .select({ name: tags.name, usageCount: tags.usageCount })
    .from(tags)
    .orderBy(desc(tags.usageCount))
    .limit(10);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <TeamStatsDashboard
        retros={serialize(completedRetros)}
        cards={serialize(allCards)}
        actionItems={serialize(allActionItems)}
        users={serialize(allUsers)}
        topTags={serialize(topTags)}
      />
    </div>
  );
}
