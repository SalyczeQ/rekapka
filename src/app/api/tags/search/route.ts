import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tags, teamMembers } from '@/lib/db/schema'
import { eq, and, ilike, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const teamId = request.nextUrl.searchParams.get('teamId')
  const q = request.nextUrl.searchParams.get('q')

  if (!teamId || !q) {
    return Response.json({ tags: [] })
  }

  const [membership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, session.user.id)))
    .limit(1)

  if (!membership) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const results = await db
    .select({ id: tags.id, name: tags.name, usageCount: tags.usageCount })
    .from(tags)
    .where(and(eq(tags.teamId, teamId), ilike(tags.name, `%${q}%`)))
    .orderBy(desc(tags.usageCount))
    .limit(5)

  return Response.json({
    tags: results.map((t) => ({
      id: t.id,
      name: t.name,
      usage_count: t.usageCount,
    })),
  })
}
