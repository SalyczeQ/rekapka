import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Fetch retro
    const { data: retro, error: retroError } = await supabase
      .from('retros')
      .select('id, team_id, status, created_by, title, template')
      .eq('id', retroId)
      .single()

    if (retroError || !retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    // Check user is owner or facilitator
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', retro.team_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const isCreator = retro.created_by === user.id
    const isFacilitatorOrOwner =
      membership.role === 'owner' || membership.role === 'facilitator'

    if (!isCreator && !isFacilitatorOrOwner) {
      return Response.json(
        { error: 'Only the facilitator or owner can complete a retro' },
        { status: 403 }
      )
    }

    // Retro must be in 'actions' phase to complete
    if (retro.status !== 'actions') {
      return Response.json(
        { error: 'Retro must be in the actions phase to be completed' },
        { status: 409 }
      )
    }

    // Set status to completed
    const { data: completedRetro, error: updateError } = await supabase
      .from('retros')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', retroId)
      .select()
      .single()

    if (updateError) {
      return Response.json(
        { error: 'Failed to complete retro' },
        { status: 500 }
      )
    }

    // Find undiscussed cards to carry over
    const { data: undiscussedCards } = await supabase
      .from('cards')
      .select('id, category_id, author_id, text, sort_order')
      .eq('retro_id', retroId)
      .eq('is_discussed', false)

    let carryOverRetroId: string | null = null

    if (undiscussedCards && undiscussedCards.length > 0) {
      // Create a new draft retro for carry-over cards
      const { data: newRetro, error: newRetroError } = await supabase
        .from('retros')
        .insert({
          team_id: retro.team_id,
          title: `Follow-up: ${retro.title}`,
          status: 'draft',
          template: retro.template,
          created_by: user.id,
        })
        .select()
        .single()

      if (newRetroError || !newRetro) {
        // Non-fatal: retro is completed but carry-over failed
        return Response.json({
          retro: completedRetro,
          carry_over: { error: 'Failed to create follow-up retro' },
        })
      }

      carryOverRetroId = newRetro.id

      // Copy categories from original retro to new retro
      const { data: originalCategories } = await supabase
        .from('categories')
        .select('name, icon, sort_order, color')
        .eq('retro_id', retroId)
        .order('sort_order', { ascending: true })

      if (originalCategories && originalCategories.length > 0) {
        const newCategories = originalCategories.map((cat) => ({
          retro_id: newRetro.id,
          name: cat.name,
          icon: cat.icon,
          sort_order: cat.sort_order,
          color: cat.color,
        }))

        const { data: insertedCategories } = await supabase
          .from('categories')
          .insert(newCategories)
          .select()

        if (insertedCategories) {
          // Build a mapping from old category name to new category id
          const categoryMap = new Map<string, string>()
          for (const cat of insertedCategories) {
            categoryMap.set(cat.name, cat.id)
          }

          // Get original categories to map old category_id -> name
          const { data: origCats } = await supabase
            .from('categories')
            .select('id, name')
            .eq('retro_id', retroId)

          const oldCatIdToName = new Map<string, string>()
          for (const c of origCats ?? []) {
            oldCatIdToName.set(c.id, c.name)
          }

          // Clone undiscussed cards into the new retro
          const newCards = undiscussedCards
            .map((card, index) => {
              const catName = oldCatIdToName.get(card.category_id)
              const newCatId = catName ? categoryMap.get(catName) : undefined
              if (!newCatId) return null
              return {
                retro_id: newRetro.id,
                category_id: newCatId,
                author_id: card.author_id,
                text: card.text,
                sort_order: index,
                carried_from_retro_id: retroId,
              }
            })
            .filter((c): c is NonNullable<typeof c> => c !== null)

          if (newCards.length > 0) {
            await supabase.from('cards').insert(newCards)
          }
        }
      }
    }

    return Response.json({
      retro: completedRetro,
      carry_over: carryOverRetroId
        ? {
            retro_id: carryOverRetroId,
            cards_carried: undiscussedCards?.length ?? 0,
          }
        : null,
    })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
