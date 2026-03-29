'use server'

import { db } from '@/lib/db'
import { teams, teamMembers, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireTeamMember, getSessionUser } from '@/lib/auth/session'

export async function updateTeamNameAction(teamId: string, name: string) {
  const member = await requireTeamMember(teamId)
  if (member.error) return { error: member.error }

  if (member.role !== 'owner' && member.role !== 'facilitator') {
    return { error: 'Only owners and facilitators can rename the team.' }
  }

  const trimmed = name.trim()
  if (!trimmed || trimmed.length < 2) return { error: 'Name must be at least 2 characters.' }

  await db
    .update(teams)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(teams.id, teamId))

  return { success: true }
}

export async function inviteMemberAction(teamId: string, email: string) {
  const member = await requireTeamMember(teamId)
  if (member.error) return { error: member.error }

  if (member.role !== 'owner' && member.role !== 'facilitator') {
    return { error: 'Only owners and facilitators can invite members.' }
  }

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

export async function generateInviteTokenAction(teamId: string) {
  const member = await requireTeamMember(teamId)
  if (member.error) return { error: member.error }
  if (member.role !== 'owner') return { error: 'Only owners can generate invite links.' }

  const { randomUUID } = await import('crypto')
  const token = randomUUID()

  await db.update(teams).set({ inviteToken: token, updatedAt: new Date() }).where(eq(teams.id, teamId))

  return { success: true, token }
}

export async function joinTeamByInviteAction(token: string) {
  const user = await getSessionUser()
  if (!user) return { error: 'Not authenticated' }

  const [team] = await db
    .select({ id: teams.id, slug: teams.slug })
    .from(teams)
    .where(eq(teams.inviteToken, token))
    .limit(1)

  if (!team) return { error: 'Invalid invite link.' }

  const [existing] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, user.id)))
    .limit(1)

  if (!existing) {
    await db.insert(teamMembers).values({ teamId: team.id, userId: user.id, role: 'member' })
  }

  return { success: true, slug: team.slug }
}
