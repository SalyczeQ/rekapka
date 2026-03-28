import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createVoteSchema, deleteVoteSchema } from '@/lib/validators'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: retroId } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createVoteSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Fetch retro
    const { data: retro, error: retroError } = await supabase
      .from('retros')
      .select('id, team_id, status, max_votes')
      .eq('id', retroId)
      .single()

    if (retroError || !retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    // Check retro is in voting phase
    if (retro.status !== 'voting') {
      return Response.json(
        { error: 'Votes can only be cast during the voting phase' },
        { status: 409 }
      )
    }

    // Check team membership
    const { data: membership } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', retro.team_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check the card belongs to this retro
    const { data: card } = await supabase
      .from('cards')
      .select('id')
      .eq('id', parsed.data.card_id)
      .eq('retro_id', retroId)
      .single()

    if (!card) {
      return Response.json(
        { error: 'Card not found in this retro' },
        { status: 400 }
      )
    }

    // Check if user already voted on this card (one vote per card per user)
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('card_id', parsed.data.card_id)
      .eq('user_id', user.id)
      .single()

    if (existingVote) {
      return Response.json(
        { error: 'You have already voted on this card' },
        { status: 409 }
      )
    }

    // Check max votes for this retro
    // Count user's total votes across all cards in this retro
    const { data: retroCards } = await supabase
      .from('cards')
      .select('id')
      .eq('retro_id', retroId)

    const cardIds = (retroCards ?? []).map((c) => c.id)

    if (cardIds.length > 0) {
      const { count } = await supabase
        .from('votes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('card_id', cardIds)

      if ((count ?? 0) >= retro.max_votes) {
        return Response.json(
          { error: `Maximum of ${retro.max_votes} votes reached` },
          { status: 409 }
        )
      }
    }

    const { data: vote, error: insertError } = await supabase
      .from('votes')
      .insert({
        card_id: parsed.data.card_id,
        user_id: user.id,
      })
      .select()
      .single()

    if (insertError) {
      return Response.json({ error: 'Failed to cast vote' }, { status: 500 })
    }

    return Response.json({ vote }, { status: 201 })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: retroId } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = deleteVoteSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Verify the vote belongs to the user and to a card in this retro
    const { data: vote } = await supabase
      .from('votes')
      .select('id, user_id, card_id, cards!inner(retro_id)')
      .eq('id', parsed.data.vote_id)
      .single()

    if (!vote) {
      return Response.json({ error: 'Vote not found' }, { status: 404 })
    }

    if (vote.user_id !== user.id) {
      return Response.json(
        { error: 'You can only remove your own votes' },
        { status: 403 }
      )
    }

    // Verify card belongs to this retro
    const voteCards = vote.cards as unknown as { retro_id: string }
    if (voteCards.retro_id !== retroId) {
      return Response.json(
        { error: 'Vote does not belong to this retro' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .eq('id', parsed.data.vote_id)

    if (deleteError) {
      return Response.json({ error: 'Failed to remove vote' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
