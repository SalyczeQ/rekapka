import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { advancePhaseSchema, PHASE_ORDER } from '@/lib/validators'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: retroId } = await params
    const session = await auth()
    if (!session?.user?.id) {
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

    const [retro] = await db
      .select({
        id: retros.id,
        teamId: retros.teamId,
        status: retros.status,
        createdBy: retros.createdBy,
      })
      .from(retros)
      .where(eq(retros.id, retroId))
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

    const isCreator = retro.createdBy === session.user.id
    const isFacilitatorOrOwner =
      membership.role === 'owner' || membership.role === 'facilitator'

    if (!isCreator && !isFacilitatorOrOwner) {
      return Response.json(
        { error: 'Only the facilitator or owner can advance the phase' },
        { status: 403 }
      )
    }

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

    if (parsed.data.target_status === 'completed') {
      return Response.json(
        { error: 'Use the /complete endpoint to finish a retro' },
        { status: 409 }
      )
    }

    const [updated] = await db
      .update(retros)
      .set({ status: parsed.data.target_status, updatedAt: new Date() })
      .where(eq(retros.id, retroId))
      .returning()

    return Response.json({ retro: updated })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
