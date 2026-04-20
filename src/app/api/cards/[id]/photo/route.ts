import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadCardPhoto } from "@/lib/s3/upload";
import { emit } from "@/lib/realtime/event-bus";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: cardId } = await params;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 400 });
  }

  const [card] = await db
    .select({ id: cards.id, retroId: cards.retroId, authorId: cards.authorId })
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  if (card.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not your card" }, { status: 403 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = await uploadCardPhoto(buffer, file.type, card.retroId);

  await db
    .update(cards)
    .set({ imageKey: key, updatedAt: new Date() })
    .where(eq(cards.id, cardId));

  emit(card.retroId, {
    type: "card_updated",
    cardId,
    changes: { imageKey: key },
  });

  const [retro] = await db
    .select({ title: retros.title })
    .from(retros)
    .where(eq(retros.id, card.retroId))
    .limit(1);

  await logAudit({
    actor: session.user,
    action: AUDIT_ACTIONS.CARD_PHOTO_UPLOAD,
    entityType: "card",
    entityId: cardId,
    retroId: card.retroId,
    metadata: {
      retroId: card.retroId,
      retroTitle: retro?.title ?? null,
      mimeType: file.type,
      sizeBytes: file.size,
      imageKey: key,
    },
  });

  return NextResponse.json({ key });
}
