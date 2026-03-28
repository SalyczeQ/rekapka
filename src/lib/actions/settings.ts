'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { teams, teamMembers, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function updateTeamNameAction(teamId: string, name: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const trimmed = name.trim()
  if (!trimmed || trimmed.length < 2) return { error: 'Name must be at least 2 characters.' }

  await db
    .update(teams)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(teams.id, teamId))

  return { success: true }
}

export async function inviteMemberAction(teamId: string, email: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const trimmedEmail = email.trim().toLowerCase()
  if (!trimmedEmail) return { error: 'Email is required.' }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, trimmedEmail))
    .limit(1)

  if (!user) return { error: 'No user found with that email.' }

  const [existing] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, user.id)))
    .limit(1)

  if (existing) return { error: 'User is already a team member.' }

  await db.insert(teamMembers).values({
    teamId,
    userId: user.id,
    role: 'member',
  })

  return { success: true }
}
