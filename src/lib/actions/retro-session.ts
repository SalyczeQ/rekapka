'use server'

import { db } from '@/lib/db'
import { retros, cards, actionItems } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { requireRetroTeamMember } from '@/lib/auth/session'

export async function updateRetroMetadataAction(
  retroId: string,
  data: { location?: string | null; date?: string; photoUrl?: string | null }
) {
  const member = await requireRetroTeamMember(retroId)
  if ('error' in member) return { error: member.error }

  await db
    .update(retros)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(retros.id, retroId))

  return { success: true }
}

export async function deleteCardAction(cardId: string, retroId: string) {
  const member = await requireRetroTeamMember(retroId)
  if ('error' in member) return { error: member.error }

  await db
    .delete(cards)
    .where(and(eq(cards.id, cardId), eq(cards.authorId, member.userId)))

  return { success: true }
}

export async function toggleDiscussedAction(cardId: string, retroId: string) {
  const member = await requireRetroTeamMember(retroId)
  if ('error' in member) return { error: member.error }

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
  const member = await requireRetroTeamMember(retroId)
  if ('error' in member) return { error: member.error }

  const [item] = await db
    .insert(actionItems)
    .values({ retroId, text, assigneeId })
    .returning()

  return { item }
}

export async function getActionItemsAction(retroId: string) {
  const member = await requireRetroTeamMember(retroId)
  if ('error' in member) return { items: [] }

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
