import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { teamMembers, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the requesting user is a member
    const [selfMembership] = await db
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, session.user.id)))
      .limit(1)

    if (!selfMembership) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const members = await db
      .select({
        id: teamMembers.id,
        role: teamMembers.role,
        userId: teamMembers.userId,
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId))

    return Response.json({
      members: members.map((m) => ({
        id: m.id,
        role: m.role,
        user: {
          id: m.userId,
          name: m.userName,
          email: m.userEmail,
          image: m.userImage,
        },
      })),
    })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
