import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers, cards, votes } from '@/lib/db/schema'
import { eq, and, inArray, sql } from 'drizzle-orm'
import { createVoteSchema, deleteVoteSchema } from '@/lib/validators'

export async function POST(
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
    const parsed = createVoteSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const [retro] = await db
      .select({ id: retros.id, teamId: retros.teamId, status: retros.status, maxVotes: retros.maxVotes })
      .from(retros)
      .where(eq(retros.id, retroId))
      .limit(1)

    if (!retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    if (retro.status !== 'voting') {
      return Response.json(
        { error: 'Votes can only be cast during the voting phase' },
        { status: 409 }
      )
    }

    const [membership] = await db
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, retro.teamId), eq(teamMembers.userId, session.user.id)))
      .limit(1)

    if (!membership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [card] = await db
      .select({ id: cards.id })
      .from(cards)
      .where(and(eq(cards.id, parsed.data.card_id), eq(cards.retroId, retroId)))
      .limit(1)

    if (!card) {
      return Response.json(
        { error: 'Card not found in this retro' },
        { status: 400 }
      )
    }

    const [existingVote] = await db
      .select({ id: votes.id })
      .from(votes)
      .where(and(eq(votes.cardId, parsed.data.card_id), eq(votes.userId, session.user.id)))
      .limit(1)

    if (existingVote) {
      return Response.json(
        { error: 'You have already voted on this card' },
        { status: 409 }
      )
    }

    // Count user's total votes in this retro
    const retroCards = await db
      .select({ id: cards.id })
      .from(cards)
      .where(eq(cards.retroId, retroId))

    const cardIds = retroCards.map((c) => c.id)

    if (cardIds.length > 0) {
      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(votes)
        .where(and(eq(votes.userId, session.user.id), inArray(votes.cardId, cardIds)))

      if ((countResult?.count ?? 0) >= retro.maxVotes) {
        return Response.json(
          { error: `Maximum of ${retro.maxVotes} votes reached` },
          { status: 409 }
        )
      }
    }

    const [vote] = await db
      .insert(votes)
      .values({
        cardId: parsed.data.card_id,
        userId: session.user.id,
      })
      .returning()

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
    const session = await auth()
    if (!session?.user?.id) {
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

    // Find the vote and check ownership
    const [vote] = await db
      .select({ id: votes.id, userId: votes.userId, cardId: votes.cardId })
      .from(votes)
      .where(eq(votes.id, parsed.data.vote_id))
      .limit(1)

    if (!vote) {
      return Response.json({ error: 'Vote not found' }, { status: 404 })
    }

    if (vote.userId !== session.user.id) {
      return Response.json(
        { error: 'You can only remove your own votes' },
        { status: 403 }
      )
    }

    // Verify card belongs to this retro
    const [card] = await db
      .select({ retroId: cards.retroId })
      .from(cards)
      .where(eq(cards.id, vote.cardId))
      .limit(1)

    if (!card || card.retroId !== retroId) {
      return Response.json(
        { error: 'Vote does not belong to this retro' },
        { status: 400 }
      )
    }

    await db.delete(votes).where(eq(votes.id, parsed.data.vote_id))

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
