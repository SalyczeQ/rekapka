import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiStatsSchema } from '@/lib/validators'
import { generateRetroStats } from '@/lib/ai/generate-stats'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
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

    // Fetch retro and verify membership
    const { data: retro, error: retroError } = await supabase
      .from('retros')
      .select('id, team_id')
      .eq('id', retro_id)
      .single()

    if (retroError || !retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    const { data: membership } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', retro.team_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('retro_id', retro_id)

    const categoryMap = new Map(
      (categories ?? []).map((c) => [c.id, c.name])
    )

    // Fetch cards
    const { data: cards } = await supabase
      .from('cards')
      .select('id, text, category_id')
      .eq('retro_id', retro_id)

    if (!cards || cards.length === 0) {
      return Response.json({
        stats: {
          themes: [],
          sentiment: { positive: 0, negative: 0, neutral: 0 },
          wordCloud: [],
          summary: 'No cards to analyze.',
        },
      })
    }

    // Fetch votes
    const cardIds = cards.map((c) => c.id)
    const { data: votes } = await supabase
      .from('votes')
      .select('card_id')
      .in('card_id', cardIds)

    const voteCountMap = new Map<string, number>()
    for (const v of votes ?? []) {
      voteCountMap.set(v.card_id, (voteCountMap.get(v.card_id) ?? 0) + 1)
    }

    const stats = await generateRetroStats({
      cards: cards.map((c) => ({
        text: c.text,
        category_name: categoryMap.get(c.category_id) ?? 'Unknown',
        vote_count: voteCountMap.get(c.id) ?? 0,
      })),
    })

    return Response.json({ stats })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
