import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers, categories, cards, votes, cardTags, tags, users } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { generateCsv } from '@/lib/csv/export'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: retroId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [retro] = await db
      .select({ id: retros.id, title: retros.title, teamId: retros.teamId })
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

    const retroCards = await db
      .select({
        id: cards.id,
        text: cards.text,
        categoryId: cards.categoryId,
        authorId: cards.authorId,
        isDiscussed: cards.isDiscussed,
        groupLabel: cards.groupLabel,
      })
      .from(cards)
      .where(eq(cards.retroId, retroId))

    const retroCategories = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(eq(categories.retroId, retroId))

    const cardIds = retroCards.map((c) => c.id)
    const authorIds = [...new Set(retroCards.map((c) => c.authorId))]

    const retroUsers = authorIds.length > 0
      ? await db
          .select({ id: users.id, name: users.name })
          .from(users)
          .where(inArray(users.id, authorIds))
      : []

    const retroVotes = cardIds.length > 0
      ? await db
          .select({ cardId: votes.cardId })
          .from(votes)
          .where(inArray(votes.cardId, cardIds))
      : []

    const retroCardTags = cardIds.length > 0
      ? await db
          .select({ cardId: cardTags.cardId, tagId: cardTags.tagId })
          .from(cardTags)
          .where(inArray(cardTags.cardId, cardIds))
      : []

    const tagIds = [...new Set(retroCardTags.map((ct) => ct.tagId))]
    const retroTags = tagIds.length > 0
      ? await db
          .select({ id: tags.id, name: tags.name })
          .from(tags)
          .where(inArray(tags.id, tagIds))
      : []

    const categoryMap = new Map(retroCategories.map((c) => [c.id, c.name]))
    const userMap = new Map(retroUsers.map((u) => [u.id, u.name]))
    const tagMap = new Map(retroTags.map((t) => [t.id, t.name]))

    const voteCountMap = new Map<string, number>()
    for (const v of retroVotes) {
      voteCountMap.set(v.cardId, (voteCountMap.get(v.cardId) ?? 0) + 1)
    }

    const cardTagsMap = new Map<string, string[]>()
    for (const ct of retroCardTags) {
      const existing = cardTagsMap.get(ct.cardId) ?? []
      const tagName = tagMap.get(ct.tagId)
      if (tagName) existing.push(tagName)
      cardTagsMap.set(ct.cardId, existing)
    }

    const csvCards = retroCards.map((card) => ({
      category: categoryMap.get(card.categoryId) ?? '',
      text: card.text,
      author: userMap.get(card.authorId) ?? '',
      votes: voteCountMap.get(card.id) ?? 0,
      tags: (cardTagsMap.get(card.id) ?? []).join(', '),
      discussed: card.isDiscussed,
      group_label: card.groupLabel ?? '',
    }))

    const csv = generateCsv(csvCards)
    const filename = `${retro.title.replace(/[^a-z0-9]/gi, '_')}_export.csv`

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
