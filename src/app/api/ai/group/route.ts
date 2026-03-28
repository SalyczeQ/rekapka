import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers, cards } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { aiGroupSchema } from '@/lib/validators'
import { groupCardsByTheme } from '@/lib/ai/group-cards'

// Simple in-memory rate limiter: max 5 requests per retro per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

function checkRateLimit(retroId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(retroId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(retroId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = aiGroupSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { retro_id } = parsed.data

    if (!checkRateLimit(retro_id)) {
      return Response.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      )
    }

    const [retro] = await db
      .select({ id: retros.id, teamId: retros.teamId, status: retros.status })
      .from(retros)
      .where(eq(retros.id, retro_id))
      .limit(1)

    if (!retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    const [membership] = await db
      .select({ role: teamMembers.role })
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, retro.teamId), eq(teamMembers.userId, session.user.id)))
      .limit(1)

    if (!membership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (retro.status === 'draft' || retro.status === 'writing') {
      return Response.json(
        { error: 'AI grouping is only available after the writing phase' },
        { status: 409 }
      )
    }

    const retroCards = await db
      .select({ id: cards.id, text: cards.text })
      .from(cards)
      .where(eq(cards.retroId, retro_id))
      .orderBy(asc(cards.sortOrder))

    if (retroCards.length === 0) {
      return Response.json({ labels: [], count: 0 })
    }

    const labels = await groupCardsByTheme(retroCards.map((c) => c.text))

    let updatedCount = 0
    for (let i = 0; i < retroCards.length; i++) {
      if (labels[i]) {
        await db
          .update(cards)
          .set({ groupLabel: labels[i] })
          .where(eq(cards.id, retroCards[i].id))
        updatedCount++
      }
    }

    return Response.json({
      labels,
      count: retroCards.length,
      grouped: updatedCount,
    })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
