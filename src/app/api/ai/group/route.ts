import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
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

    // Rate limit check
    if (!checkRateLimit(retro_id)) {
      return Response.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      )
    }

    // Fetch retro and verify membership
    const { data: retro, error: retroError } = await supabase
      .from('retros')
      .select('id, team_id, status')
      .eq('id', retro_id)
      .single()

    if (retroError || !retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', retro.team_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only allow grouping after the writing phase
    if (retro.status === 'draft' || retro.status === 'writing') {
      return Response.json(
        { error: 'AI grouping is only available after the writing phase' },
        { status: 409 }
      )
    }

    // Fetch all cards for this retro
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select('id, text')
      .eq('retro_id', retro_id)
      .order('sort_order', { ascending: true })

    if (cardsError || !cards) {
      return Response.json({ error: 'Failed to fetch cards' }, { status: 500 })
    }

    if (cards.length === 0) {
      return Response.json({ labels: [], count: 0 })
    }

    // Call AI grouping
    const labels = await groupCardsByTheme(cards.map((c) => c.text))

    // Update cards with group labels
    let updatedCount = 0
    for (let i = 0; i < cards.length; i++) {
      if (labels[i]) {
        const { error } = await supabase
          .from('cards')
          .update({ group_label: labels[i] })
          .eq('id', cards[i].id)

        if (!error) updatedCount++
      }
    }

    return Response.json({
      labels,
      count: cards.length,
      grouped: updatedCount,
    })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
