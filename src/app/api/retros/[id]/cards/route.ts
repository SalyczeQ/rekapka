import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers, cards, categories, cardTags, tags } from '@/lib/db/schema'
import { eq, and, desc, asc, inArray } from 'drizzle-orm'
import { createCardSchema } from '@/lib/validators'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: retroId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [retro] = await db
      .select({ id: retros.id, teamId: retros.teamId, status: retros.status })
      .from(retros)
      .where(eq(retros.id, retroId))
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

    const retroCards = await db
      .select()
      .from(cards)
      .where(eq(cards.retroId, retroId))
      .orderBy(asc(cards.sortOrder))

    const cardIds = retroCards.map((c) => c.id)

    // Fetch tags for all cards
    let cardTagsWithNames: { cardId: string; tagId: string; tagName: string }[] = []
    if (cardIds.length > 0) {
      cardTagsWithNames = await db
        .select({
          cardId: cardTags.cardId,
          tagId: cardTags.tagId,
          tagName: tags.name,
        })
        .from(cardTags)
        .innerJoin(tags, eq(cardTags.tagId, tags.id))
        .where(inArray(cardTags.cardId, cardIds))
    }

    const tagsByCardId = new Map<string, { id: string; tag_id: string; tags: { id: string; name: string } }[]>()
    for (const ct of cardTagsWithNames) {
      const list = tagsByCardId.get(ct.cardId) ?? []
      list.push({ id: ct.cardId, tag_id: ct.tagId, tags: { id: ct.tagId, name: ct.tagName } })
      tagsByCardId.set(ct.cardId, list)
    }

    const processedCards = retroCards.map((card) => {
      const cardData = {
        id: card.id,
        retro_id: card.retroId,
        category_id: card.categoryId,
        author_id: card.authorId,
        text: card.text,
        sort_order: card.sortOrder,
        group_label: card.groupLabel,
        is_discussed: card.isDiscussed,
        carried_from_retro_id: card.carriedFromRetroId,
        created_at: card.createdAt.toISOString(),
        updated_at: card.updatedAt.toISOString(),
        card_tags: tagsByCardId.get(card.id) ?? [],
      }
      if (retro.status === 'writing' && card.authorId !== session.user!.id) {
        return { ...cardData, text: '' }
      }
      return cardData
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
    const session = await auth()
    if (!session?.user?.id) {
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

    const [retro] = await db
      .select({ id: retros.id, teamId: retros.teamId, status: retros.status })
      .from(retros)
      .where(eq(retros.id, retroId))
      .limit(1)

    if (!retro) {
      return Response.json({ error: 'Retro not found' }, { status: 404 })
    }

    if (retro.status !== 'writing') {
      return Response.json(
        { error: 'Cards can only be added during the writing phase' },
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

    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, parsed.data.category_id), eq(categories.retroId, retroId)))
      .limit(1)

    if (!category) {
      return Response.json(
        { error: 'Category not found for this retro' },
        { status: 400 }
      )
    }

    const [maxCard] = await db
      .select({ sortOrder: cards.sortOrder })
      .from(cards)
      .where(and(eq(cards.retroId, retroId), eq(cards.categoryId, parsed.data.category_id)))
      .orderBy(desc(cards.sortOrder))
      .limit(1)

    const nextOrder = (maxCard?.sortOrder ?? -1) + 1

    const [card] = await db
      .insert(cards)
      .values({
        retroId,
        categoryId: parsed.data.category_id,
        authorId: session.user.id,
        text: parsed.data.text,
        sortOrder: nextOrder,
      })
      .returning()

    return Response.json({ card }, { status: 201 })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
