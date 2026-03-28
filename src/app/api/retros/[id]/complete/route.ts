import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers, categories, cards } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'

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

    const [retro] = await db
      .select({
        id: retros.id,
        teamId: retros.teamId,
        status: retros.status,
        createdBy: retros.createdBy,
        title: retros.title,
        template: retros.template,
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
        { error: 'Only the facilitator or owner can complete a retro' },
        { status: 403 }
      )
    }

    if (retro.status !== 'actions') {
      return Response.json(
        { error: 'Retro must be in the actions phase to be completed' },
        { status: 409 }
      )
    }

    const [completedRetro] = await db
      .update(retros)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(retros.id, retroId))
      .returning()

    // Find undiscussed cards to carry over
    const undiscussedCards = await db
      .select({
        id: cards.id,
        categoryId: cards.categoryId,
        authorId: cards.authorId,
        text: cards.text,
        sortOrder: cards.sortOrder,
      })
      .from(cards)
      .where(and(eq(cards.retroId, retroId), eq(cards.isDiscussed, false)))

    let carryOverRetroId: string | null = null

    if (undiscussedCards.length > 0) {
      const [newRetro] = await db
        .insert(retros)
        .values({
          teamId: retro.teamId,
          title: `Follow-up: ${retro.title}`,
          status: 'draft',
          template: retro.template,
          createdBy: session.user.id,
        })
        .returning({ id: retros.id })

      if (!newRetro) {
        return Response.json({
          retro: completedRetro,
          carry_over: { error: 'Failed to create follow-up retro' },
        })
      }

      carryOverRetroId = newRetro.id

      const originalCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          sortOrder: categories.sortOrder,
          color: categories.color,
        })
        .from(categories)
        .where(eq(categories.retroId, retroId))
        .orderBy(asc(categories.sortOrder))

      if (originalCategories.length > 0) {
        const insertedCategories = await db
          .insert(categories)
          .values(
            originalCategories.map((cat) => ({
              retroId: newRetro.id,
              name: cat.name,
              icon: cat.icon,
              sortOrder: cat.sortOrder,
              color: cat.color,
            }))
          )
          .returning({ id: categories.id, name: categories.name })

        // Map old category name -> new category id
        const categoryMap = new Map<string, string>()
        for (const cat of insertedCategories) {
          categoryMap.set(cat.name, cat.id)
        }

        // Map old category id -> name
        const oldCatIdToName = new Map<string, string>()
        for (const c of originalCategories) {
          oldCatIdToName.set(c.id, c.name)
        }

        const newCards = undiscussedCards
          .map((card, index) => {
            const catName = oldCatIdToName.get(card.categoryId)
            const newCatId = catName ? categoryMap.get(catName) : undefined
            if (!newCatId) return null
            return {
              retroId: newRetro.id,
              categoryId: newCatId,
              authorId: card.authorId,
              text: card.text,
              sortOrder: index,
              carriedFromRetroId: retroId,
            }
          })
          .filter((c): c is NonNullable<typeof c> => c !== null)

        if (newCards.length > 0) {
          await db.insert(cards).values(newCards)
        }
      }
    }

    return Response.json({
      retro: completedRetro,
      carry_over: carryOverRetroId
        ? {
            retro_id: carryOverRetroId,
            cards_carried: undiscussedCards.length,
          }
        : null,
    })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
