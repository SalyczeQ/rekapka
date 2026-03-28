import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { teams as teamsTable, retros } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { generateIcs } from '@/lib/ics/generate-ics'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token || token.length < 10) {
      return Response.json({ error: 'Invalid token' }, { status: 400 })
    }

    const [team] = await db
      .select({ id: teamsTable.id, name: teamsTable.name })
      .from(teamsTable)
      .where(eq(teamsTable.icsToken, token))
      .limit(1)

    if (!team) {
      return new Response('Calendar not found', { status: 404 })
    }

    const teamRetros = await db
      .select({
        id: retros.id,
        title: retros.title,
        date: retros.date,
        location: retros.location,
        status: retros.status,
        completedAt: retros.completedAt,
      })
      .from(retros)
      .where(eq(retros.teamId, team.id))
      .orderBy(desc(retros.date))

    const icsContent = generateIcs(
      team.name,
      teamRetros.map((r) => ({
        ...r,
        completed_at: r.completedAt?.toISOString() ?? null,
      }))
    )

    return new Response(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${team.name}-retros.ics"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch {
    return new Response('Internal server error', { status: 500 })
  }
}
