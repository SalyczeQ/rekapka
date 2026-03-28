import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, retros, teamMembers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export type SessionUser = typeof users.$inferSelect

/**
 * Get the currently authenticated user from the database.
 * Returns null if not signed in or user not found.
 * Use in server components and route handlers.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  return user ?? null
}

/**
 * Verify the caller is authenticated and is a member of the team that owns the given retro.
 * Returns { userId, teamId, role } on success, or { error } on failure.
 */
export async function requireRetroTeamMember(retroId: string): Promise<
  | { userId: string; teamId: string; role: string; error?: never }
  | { error: string; userId?: never; teamId?: never; role?: never }
> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const [retro] = await db
    .select({ teamId: retros.teamId })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1)

  if (!retro) return { error: 'Retro not found' }

  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, retro.teamId), eq(teamMembers.userId, session.user.id)))
    .limit(1)

  if (!membership) return { error: 'Forbidden' }

  return { userId: session.user.id, teamId: retro.teamId, role: membership.role }
}

/**
 * Verify the caller is authenticated and is a member of the given team.
 * Returns { userId, role } on success, or { error } on failure.
 */
export async function requireTeamMember(teamId: string): Promise<
  | { userId: string; role: string; error?: never }
  | { error: string; userId?: never; role?: never }
> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, session.user.id)))
    .limit(1)

  if (!membership) return { error: 'Forbidden' }

  return { userId: session.user.id, role: membership.role }
}
