'use server'

import { db } from '@/lib/db'
import { actionItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireRetroTeamMember } from '@/lib/auth/session'

export async function cycleActionStatusAction(actionId: string, currentStatus: string) {
  const [action] = await db
    .select({ retroId: actionItems.retroId })
    .from(actionItems)
    .where(eq(actionItems.id, actionId))
    .limit(1)

  if (!action) return { error: 'Action item not found' }

  const member = await requireRetroTeamMember(action.retroId)
  if (member.error) return { error: member.error }

  const nextStatus =
    currentStatus === 'open'
      ? 'in_progress'
      : currentStatus === 'in_progress'
        ? 'done'
        : 'open'

  await db
    .update(actionItems)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(actionItems.id, actionId))

  return { status: nextStatus }
}
