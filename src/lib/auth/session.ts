import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type SessionUser = typeof users.$inferSelect

/**
 * Get the currently authenticated user from the database.
 * Returns null if not signed in or user not found.
 * Use in server components and route handlers.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  return user ?? null
}
