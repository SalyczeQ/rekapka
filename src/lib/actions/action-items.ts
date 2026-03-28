'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { actionItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function cycleActionStatusAction(actionId: string, currentStatus: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

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
