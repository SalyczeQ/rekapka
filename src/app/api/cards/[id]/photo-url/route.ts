import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPhotoUrl } from "@/lib/s3/upload";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: cardId } = await params;

  const [card] = await db
    .select({ imageKey: cards.imageKey })
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);

  if (!card?.imageKey) {
    return NextResponse.json({ error: "No image" }, { status: 404 });
  }

  const url = await getPhotoUrl(card.imageKey);
  return NextResponse.json({ url });
}
