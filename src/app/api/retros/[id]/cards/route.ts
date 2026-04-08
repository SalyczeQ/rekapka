import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { replaceEmojiShortcodes } from "@/lib/emoji";
import { emit } from "@/lib/realtime/event-bus";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth();
  const { id } = await params;

  const retroCards = await db
    .select({
      id: cards.id,
      retroId: cards.retroId,
      categoryId: cards.categoryId,
      authorId: cards.authorId,
      text: cards.text,
      sortOrder: cards.sortOrder,
      groupLabel: cards.groupLabel,
      isDiscussed: cards.isDiscussed,
      isSkipped: cards.isSkipped,
      discussionNotes: cards.discussionNotes,
      discussionDurationSec: cards.discussionDurationSec,
      createdAt: cards.createdAt,
      updatedAt: cards.updatedAt,
      authorName: users.name,
      authorColor: users.color,
      authorImage: users.image,
    })
    .from(cards)
    .innerJoin(users, eq(cards.authorId, users.id))
    .where(eq(cards.retroId, id));

  return NextResponse.json(retroCards);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  const { id } = await params;
  const { categoryId, text } = await request.json();

  const processedText = replaceEmojiShortcodes(text);

  const [card] = await db
    .insert(cards)
    .values({
      retroId: id,
      categoryId,
      authorId: user.id!,
      text: processedText,
    })
    .returning();

  // Fetch author info for the SSE event
  const [author] = await db
    .select({ name: users.name, color: users.color, image: users.image })
    .from(users)
    .where(eq(users.id, user.id!))
    .limit(1);

  const serialized = JSON.parse(JSON.stringify({
    ...card,
    authorName: author?.name ?? "",
    authorColor: author?.color ?? "#888",
    authorImage: author?.image ?? null,
  }));

  emit(id, { type: "card_added", card: serialized });
  return NextResponse.json(card, { status: 201 });
}
