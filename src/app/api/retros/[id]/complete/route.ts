import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { retros, cards, categories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { emit } from "@/lib/realtime/event-bus";
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
  const body = await request.json();
  const { nextRetroId } = body;

  // Get current retro
  const [retro] = await db.select().from(retros).where(eq(retros.id, id));
  if (!retro) {
    return NextResponse.json({ error: "Retro not found" }, { status: 404 });
  }

  // Validate required fields
  if (!retro.location || !retro.date || !retro.photoUrl) {
    return NextResponse.json(
      { error: "Missing required fields: location, date, and photo must be set before completing" },
      { status: 400 }
    );
  }

  // Complete the retro
  const completedAt = new Date();
  const startedAt = retro.startedAt ?? retro.createdAt;
  const totalDurationSec = Math.round(
    (completedAt.getTime() - startedAt.getTime()) / 1000
  );

  await db
    .update(retros)
    .set({
      status: "completed",
      completedAt,
      totalDurationSec,
      updatedAt: new Date(),
    })
    .where(eq(retros.id, id));

  // Carry over undiscussed cards to next retro if provided
  if (nextRetroId) {
    const undiscussedCards = await db
      .select()
      .from(cards)
      .where(and(eq(cards.retroId, id), eq(cards.isDiscussed, false)));

    if (undiscussedCards.length > 0) {
      // Get categories of next retro to map old→new
      const oldCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.retroId, id));
      const newCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.retroId, nextRetroId));

      const categoryMap = new Map<string, string>();
      for (const oldCat of oldCategories) {
        const newCat = newCategories.find((nc) => nc.name === oldCat.name);
        if (newCat) {
          categoryMap.set(oldCat.id, newCat.id);
        }
      }

      for (const card of undiscussedCards) {
        const newCategoryId = categoryMap.get(card.categoryId);
        if (newCategoryId) {
          await db.insert(cards).values({
            retroId: nextRetroId,
            categoryId: newCategoryId,
            authorId: card.authorId,
            text: card.text,
            groupLabel: null,
            isDiscussed: false,
            isSkipped: false,
            carriedFromRetroId: id,
          });
        }
      }
    }
  }

  let carriedToTitle: string | null = null;
  if (nextRetroId) {
    const [nextRetro] = await db
      .select({ title: retros.title })
      .from(retros)
      .where(eq(retros.id, nextRetroId))
      .limit(1);
    carriedToTitle = nextRetro?.title ?? null;
  }

  await logAudit({
    actor: session.user,
    action: AUDIT_ACTIONS.RETRO_COMPLETE,
    entityType: "retro",
    entityId: id,
    retroId: id,
    metadata: {
      retroId: id,
      retroTitle: retro.title,
      totalDurationSec,
      carriedTo: nextRetroId ?? null,
      carriedToTitle,
    },
  });

  emit(id, { type: "phase_changed", phase: "completed" });

  return NextResponse.json({ success: true, totalDurationSec });
}
