import { db } from '@/lib/db'
import { teams, teamMembers, retros } from '@/lib/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'

const DEFAULT_TEAM_SLUG = 'default'
const DEFAULT_TEAM_NAME = 'Default'

export async function getOrCreateDefaultTeam(userId: string) {
  // Find all teams the user belongs to; prefer the one with the most recent retro activity
  const memberships = await db
    .select({ id: teams.id, slug: teams.slug, latestRetro: sql<string>`MAX(${retros.createdAt})` })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .leftJoin(retros, eq(retros.teamId, teams.id))
    .where(eq(teamMembers.userId, userId))
    .groupBy(teams.id, teams.slug)
    .orderBy(desc(sql`MAX(${retros.createdAt})`))
    .limit(5)

  if (memberships.length > 0) return memberships[0]

  // No team at all — find or create the default team and add user
  let [team] = await db
    .select()
    .from(teams)
    .where(eq(teams.slug, DEFAULT_TEAM_SLUG))
    .limit(1)

  if (!team) {
    const [created] = await db
      .insert(teams)
      .values({ name: DEFAULT_TEAM_NAME, slug: DEFAULT_TEAM_SLUG, createdBy: userId })
      .returning()
    team = created
  }

  const [membership] = await db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, userId)))
    .limit(1)

  if (!membership) {
    const role = team.createdBy === userId ? 'owner' : 'member'
    await db.insert(teamMembers).values({ teamId: team.id, userId, role })
  }

  return team
}
