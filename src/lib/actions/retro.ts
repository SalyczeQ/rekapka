'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { teams, teamMembers, retros, categories } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

const TEMPLATES: Record<string, { name: string; icon: string; color: string }[]> = {
  went_well_improve: [
    { name: 'Went Well', icon: '✅', color: '#22C55E' },
    { name: 'Needs Improvement', icon: '❌', color: '#EF4444' },
  ],
  mad_sad_glad: [
    { name: 'Mad', icon: '😡', color: '#EF4444' },
    { name: 'Sad', icon: '😢', color: '#3B82F6' },
    { name: 'Glad', icon: '😊', color: '#22C55E' },
  ],
  start_stop_continue: [
    { name: 'Start', icon: '🟢', color: '#22C55E' },
    { name: 'Stop', icon: '🔴', color: '#EF4444' },
    { name: 'Continue', icon: '🔵', color: '#3B82F6' },
  ],
  four_ls: [
    { name: 'Liked', icon: '💚', color: '#22C55E' },
    { name: 'Learned', icon: '📚', color: '#3B82F6' },
    { name: 'Lacked', icon: '🔧', color: '#F97316' },
    { name: 'Longed For', icon: '🙏', color: '#8B5CF6' },
  ],
}

export async function createRetroAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  const title = (formData.get('title') as string)?.trim()
  const template = (formData.get('template') as string) || 'went_well_improve'
  const teamSlug = formData.get('teamSlug') as string

  if (!title) {
    return { error: 'Title is required.' }
  }

  const [team] = await db
    .select({ id: teams.id })
    .from(teams)
    .where(eq(teams.slug, teamSlug))
    .limit(1)

  if (!team) {
    return { error: 'Team not found' }
  }

  const [membership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, session.user.id)))
    .limit(1)

  if (!membership) {
    return { error: 'Forbidden' }
  }

  const [retro] = await db
    .insert(retros)
    .values({
      teamId: team.id,
      title,
      template,
      createdBy: session.user.id,
    })
    .returning({ id: retros.id })

  const tmplCategories = TEMPLATES[template]
  if (tmplCategories) {
    await db.insert(categories).values(
      tmplCategories.map((cat, i) => ({
        retroId: retro.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        sortOrder: i,
      }))
    )
  }

  redirect(`/app/${teamSlug}/retros/${retro.id}`)
}

export async function deleteRetroAction(retroId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const [retro] = await db
    .select({ teamId: retros.teamId, status: retros.status, createdBy: retros.createdBy })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1)

  if (!retro) return { error: 'Not found' }
  if (retro.status !== 'draft') return { error: 'Only draft retros can be deleted' }

  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, retro.teamId), eq(teamMembers.userId, session.user.id)))
    .limit(1)

  if (!membership) return { error: 'Forbidden' }

  const isCreator = retro.createdBy === session.user.id
  const isOwnerOrAdmin = membership.role === 'owner' || membership.role === 'admin'
  if (!isCreator && !isOwnerOrAdmin) return { error: 'Forbidden' }

  await db.delete(retros).where(eq(retros.id, retroId))
  return { success: true }
}
