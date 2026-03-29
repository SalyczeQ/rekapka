import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { retros, teamMembers, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// In-memory presence store: retroId -> Map<userId, { name, lastSeen }>
const presenceStore = new Map<string, Map<string, { name: string; lastSeen: number }>>()

const TIMEOUT_MS = 30_000 // 30s without heartbeat = offline

function getRetroPresence(retroId: string) {
  if (!presenceStore.has(retroId)) {
    presenceStore.set(retroId, new Map())
  }
  return presenceStore.get(retroId)!
}

function pruneStale(retroId: string) {
  const now = Date.now()
  const presence = getRetroPresence(retroId)
  for (const [userId, data] of presence.entries()) {
    if (now - data.lastSeen > TIMEOUT_MS) {
      presence.delete(userId)
    }
  }
}

async function authorize(retroId: string, userId: string) {
  const [retro] = await db
    .select({ teamId: retros.teamId })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1)
  if (!retro) return false

  const [membership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, retro.teamId), eq(teamMembers.userId, userId)))
    .limit(1)
  return !!membership
}

// GET — return current online users
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: retroId } = await params
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  if (!(await authorize(retroId, session.user.id))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  pruneStale(retroId)
  const presence = getRetroPresence(retroId)
  const online = Array.from(presence.entries()).map(([userId, data]) => ({
    userId,
    name: data.name,
  }))

  return Response.json({ online })
}

// POST — heartbeat: update lastSeen for current user
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: retroId } = await params
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  if (!(await authorize(retroId, session.user.id))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch name from DB if not in body
  let name: string = session.user.name ?? 'Unknown'
  try {
    const body = await request.json()
    if (body?.name) name = body.name
  } catch {}

  pruneStale(retroId)
  getRetroPresence(retroId).set(session.user.id, { name, lastSeen: Date.now() })

  return Response.json({ ok: true })
}

// DELETE — explicit leave
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: retroId } = await params
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  getRetroPresence(retroId).delete(session.user.id)
  return Response.json({ ok: true })
}
