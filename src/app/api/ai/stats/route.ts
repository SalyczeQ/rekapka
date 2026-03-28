import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers, categories, cards, votes } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { aiStatsSchema } from '@/lib/validators'
import { generateRetroStats } from '@/lib/ai/generate-stats'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = aiStatsSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { retro_id } = parsed.data

    const [retro] = await db
      .select({ id: retros.id, teamId: retros.teamId })
      .from(retros)
      .where(eq(retros.id, retro_id))
      .limit(1)

    if (!retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    const [membership] = await db
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, retro.teamId), eq(teamMembers.userId, session.user.id)))
      .limit(1)

    if (!membership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const retroCategories = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(eq(categories.retroId, retro_id))

    const categoryMap = new Map(retroCategories.map((c) => [c.id, c.name]))

    const retroCards = await db
      .select({ id: cards.id, text: cards.text, categoryId: cards.categoryId })
      .from(cards)
      .where(eq(cards.retroId, retro_id))

    if (retroCards.length === 0) {
      return Response.json({
        stats: {
          themes: [],
          sentiment: { positive: 0, negative: 0, neutral: 0 },
          wordCloud: [],
          summary: 'No cards to analyze.',
        },
      })
    }

    const cardIds = retroCards.map((c) => c.id)
    const retroVotes = await db
      .select({ cardId: votes.cardId })
      .from(votes)
      .where(inArray(votes.cardId, cardIds))

    const voteCountMap = new Map<string, number>()
    for (const v of retroVotes) {
      voteCountMap.set(v.cardId, (voteCountMap.get(v.cardId) ?? 0) + 1)
    }

    const stats = await generateRetroStats({
      cards: retroCards.map((c) => ({
        text: c.text,
        category_name: categoryMap.get(c.categoryId) ?? 'Unknown',
        vote_count: voteCountMap.get(c.id) ?? 0,
      })),
    })

    return Response.json({ stats })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
