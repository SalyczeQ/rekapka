import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSSEStream } from "@/lib/realtime/stream";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id: retroId } = await params;

  const [[user], [retro]] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        color: users.color,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1),
    db
      .select({ title: retros.title })
      .from(retros)
      .where(eq(retros.id, retroId))
      .limit(1),
  ]);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const stream = createSSEStream(retroId, user, retro?.title ?? null);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
