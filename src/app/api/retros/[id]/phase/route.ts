import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { advancePhaseSchema, PHASE_ORDER } from '@/lib/validators'

export async function PATCH(
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
    const parsed = advancePhaseSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Fetch retro
    const { data: retro, error: retroError } = await supabase
      .from('retros')
      .select('id, team_id, status, created_by')
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
        { error: 'Only the facilitator or owner can advance the phase' },
        { status: 403 }
      )
    }

    // Validate phase transition order
    const currentIndex = PHASE_ORDER.indexOf(
      retro.status as (typeof PHASE_ORDER)[number]
    )
    const targetIndex = PHASE_ORDER.indexOf(parsed.data.target_status)

    if (currentIndex === -1 || targetIndex === -1) {
      return Response.json({ error: 'Invalid phase' }, { status: 400 })
    }

    if (targetIndex !== currentIndex + 1) {
      return Response.json(
        {
          error: `Invalid phase transition: cannot go from '${retro.status}' to '${parsed.data.target_status}'. Next valid phase is '${PHASE_ORDER[currentIndex + 1] ?? 'none'}'.`,
        },
        { status: 409 }
      )
    }

    // Do not allow advancing to 'completed' via this endpoint
    // Use the /complete endpoint instead
    if (parsed.data.target_status === 'completed') {
      return Response.json(
        { error: 'Use the /complete endpoint to finish a retro' },
        { status: 409 }
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('retros')
      .update({ status: parsed.data.target_status })
      .eq('id', retroId)
      .select()
      .single()

    if (updateError) {
      return Response.json(
        { error: 'Failed to advance phase' },
        { status: 500 }
      )
    }

    return Response.json({ retro: updated })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
