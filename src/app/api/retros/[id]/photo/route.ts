import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadPhoto } from "@/lib/s3/upload";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = await uploadPhoto(buffer, file.type, id);

  await db
    .update(retros)
    .set({ photoUrl: key, updatedAt: new Date() })
    .where(eq(retros.id, id));

  const [retro] = await db
    .select({ title: retros.title })
    .from(retros)
    .where(eq(retros.id, id))
    .limit(1);

  await logAudit({
    actor: session.user,
    action: AUDIT_ACTIONS.RETRO_PHOTO_UPLOAD,
    entityType: "retro",
    entityId: id,
    retroId: id,
    metadata: {
      retroId: id,
      retroTitle: retro?.title ?? null,
      mimeType: file.type,
      sizeBytes: file.size,
      photoKey: key,
    },
  });

  return NextResponse.json({ key });
}
