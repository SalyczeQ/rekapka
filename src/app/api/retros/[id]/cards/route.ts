import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCardSchema } from '@/lib/validators'

export async function GET(
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

    // Fetch retro to check status and team membership
    const { data: retro, error: retroError } = await supabase
      .from('retros')
      .select('id, team_id, status')
      .eq('id', retroId)
      .single()

    if (retroError || !retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
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

    // Fetch cards with author info and tags
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select(`
        id,
        retro_id,
        category_id,
        author_id,
        text,
        sort_order,
        group_label,
        is_discussed,
        carried_from_retro_id,
        created_at,
        updated_at,
        card_tags (
          id,
          tag_id,
          tags ( id, name )
        )
      `)
      .eq('retro_id', retroId)
      .order('sort_order', { ascending: true })

    if (cardsError) {
      return Response.json({ error: 'Failed to fetch cards' }, { status: 500 })
    }

    // Privacy: in writing phase, hide text of other users' cards
    const processedCards = (cards ?? []).map((card) => {
      if (retro.status === 'writing' && card.author_id !== user.id) {
        return {
          ...card,
          text: '',
        }
      }
      return card
    })

    return Response.json({ cards: processedCards })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const parsed = createCardSchema.safeParse({ ...body, retro_id: retroId })
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Fetch retro
    const { data: retro, error: retroError } = await supabase
      .from('retros')
      .select('id, team_id, status')
      .eq('id', retroId)
      .single()

    if (retroError || !retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    // Check retro is in writing phase
    if (retro.status !== 'writing') {
      return Response.json(
        { error: 'Cards can only be added during the writing phase' },
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

    // Validate category belongs to retro
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', parsed.data.category_id)
      .eq('retro_id', retroId)
      .single()

    if (!category) {
      return Response.json(
        { error: 'Category not found for this retro' },
        { status: 400 }
      )
    }

    // Get max sort order for new card
    const { data: maxCard } = await supabase
      .from('cards')
      .select('sort_order')
      .eq('retro_id', retroId)
      .eq('category_id', parsed.data.category_id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxCard?.sort_order ?? -1) + 1

    const { data: card, error: insertError } = await supabase
      .from('cards')
      .insert({
        retro_id: retroId,
        category_id: parsed.data.category_id,
        author_id: user.id,
        text: parsed.data.text,
        sort_order: nextOrder,
      })
      .select()
      .single()

    if (insertError) {
      return Response.json({ error: 'Failed to create card' }, { status: 500 })
    }

    return Response.json({ card }, { status: 201 })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
