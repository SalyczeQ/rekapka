'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { teams, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function createTeamAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  const name = (formData.get('name') as string)?.trim()
  const slug = (formData.get('slug') as string)?.trim().toLowerCase()

  if (!name || !slug) {
    return { error: 'Team name and slug are required.' }
  }

  // Check slug uniqueness
  const [existing] = await db
    .select({ id: teams.id })
    .from(teams)
    .where(eq(teams.slug, slug))
    .limit(1)

  if (existing) {
    return { error: 'This slug is already taken.' }
  }

  const [team] = await db
    .insert(teams)
    .values({
      name,
      slug,
      createdBy: session.user.id,
    })
    .returning({ id: teams.id, slug: teams.slug })

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: session.user.id,
    role: 'owner',
  })

  redirect(`/app/${team.slug}`)
}
