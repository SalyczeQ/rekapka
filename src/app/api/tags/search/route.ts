import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tags } from '@/lib/db/schema'
import { eq, ilike, desc } from 'drizzle-orm'

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

  const results = await db
    .select({ id: tags.id, name: tags.name, usageCount: tags.usageCount })
    .from(tags)
    .where(eq(tags.teamId, teamId))
    .orderBy(desc(tags.usageCount))
    .limit(5)

  // Filter in JS since Drizzle's ilike needs the pattern applied
  const filtered = results.filter((t) =>
    t.name.toLowerCase().includes(q.toLowerCase())
  )

  return Response.json({
    tags: filtered.map((t) => ({
      id: t.id,
      name: t.name,
      usage_count: t.usageCount,
    })),
  })
}
