import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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
    .select({ status: retros.status })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1)

  if (!retro) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json({ status: retro.status })
}
