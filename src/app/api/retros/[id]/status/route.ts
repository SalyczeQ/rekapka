import { db } from '@/lib/db'
import { retros, teamMembers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: retroId } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [retro] = await db
    .select({ status: retros.status, teamId: retros.teamId })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1)

  if (!retro) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const [membership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, retro.teamId), eq(teamMembers.userId, session.user.id)))
    .limit(1)

  if (!membership) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  return Response.json({ status: retro.status })
}
