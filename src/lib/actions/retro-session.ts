'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, cards, actionItems } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'

export async function updateRetroMetadataAction(
  retroId: string,
  data: { location?: string | null; date?: string; photoUrl?: string | null }
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  await db
    .update(retros)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(retros.id, retroId))

  return { success: true }
}

export async function deleteCardAction(cardId: string, userId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  await db
    .delete(cards)
    .where(and(eq(cards.id, cardId), eq(cards.authorId, userId)))

  return { success: true }
}

export async function toggleDiscussedAction(cardId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const [card] = await db
    .select({ isDiscussed: cards.isDiscussed })
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1)

  if (!card) return { error: 'Card not found' }

  await db
    .update(cards)
    .set({ isDiscussed: !card.isDiscussed, updatedAt: new Date() })
    .where(eq(cards.id, cardId))

  return { success: true }
}

export async function addActionItemAction(retroId: string, text: string, assigneeId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const [item] = await db
    .insert(actionItems)
    .values({ retroId, text, assigneeId })
    .returning()

  return { item }
}

export async function getActionItemsAction(retroId: string) {
  const session = await auth()
  if (!session?.user?.id) return { items: [] }

  const items = await db
    .select()
    .from(actionItems)
    .where(eq(actionItems.retroId, retroId))
    .orderBy(asc(actionItems.createdAt))

  return {
    items: items.map((i) => ({
      id: i.id,
      text: i.text,
      assignee_id: i.assigneeId,
      due_date: i.dueDate,
      status: i.status,
    })),
  }
}
