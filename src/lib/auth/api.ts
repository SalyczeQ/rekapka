'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { teamMembers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Get the authenticated user's ID from the session, or null.
 * Use in route handlers.
 */
export async function getApiUser(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

/**
 * Check if a user is a member of a team. Returns the role if found, null otherwise.
 */
export async function getTeamMembership(teamId: string, userId: string) {
  const [membership] = await db
    .select({ id: teamMembers.id, role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)))
    .limit(1)
  return membership ?? null
}
