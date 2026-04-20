"use server";

import { db } from "@/lib/db";
import { cards, categories, retros, tags, cardTags, users, cardReactions } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { createCardSchema, updateCardSchema } from "@/lib/validators";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { replaceEmojiShortcodes } from "@/lib/emoji";
import { emit } from "@/lib/realtime/event-bus";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function createCard(formData: FormData) {
  const user = await requireAuth();

  const input = createCardSchema.parse({
    retroId: formData.get("retroId"),
    categoryId: formData.get("categoryId"),
    text: formData.get("text"),
  });

  const processedText = replaceEmojiShortcodes(input.text);

  const [card] = await db
    .insert(cards)
    .values({
      retroId: input.retroId,
      categoryId: input.categoryId,
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

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.CARD_CREATE,
    entityType: "card",
    entityId: card.id,
    retroId: input.retroId,
    metadata: { categoryId: input.categoryId, textLength: processedText.length },
  });

  emit(input.retroId, { type: "card_added", card: serialized });
  revalidatePath(`/retros/${input.retroId}`);
  return card;
}

export async function updateCard(cardId: string, formData: FormData) {
  const user = await requireAuth();

  const input = updateCardSchema.parse({
    text: formData.get("text") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    discussionNotes: formData.get("discussionNotes") || undefined,
  });

  const changes: Record<string, unknown> = { updatedAt: new Date() };
  if (input.text) changes.text = replaceEmojiShortcodes(input.text);
  if (input.categoryId) changes.categoryId = input.categoryId;
  if (input.discussionNotes !== undefined) changes.discussionNotes = input.discussionNotes;

  const [card] = await db
    .update(cards)
    .set(changes)
    .where(eq(cards.id, cardId))
    .returning();

  if (card) {
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.CARD_UPDATE,
      entityType: "card",
      entityId: cardId,
      retroId: card.retroId,
      metadata: { changes: Object.keys(changes).filter((k) => k !== "updatedAt") },
    });
    emit(card.retroId, {
      type: "card_updated",
      cardId,
      changes: JSON.parse(JSON.stringify(changes)),
    });
    revalidatePath(`/retros/${card.retroId}`);
  }

  return card;
}

export async function deleteCard(cardId: string) {
  const user = await requireAuth();

  const [card] = await db.delete(cards).where(eq(cards.id, cardId)).returning();

  if (card) {
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.CARD_DELETE,
      entityType: "card",
      entityId: cardId,
      retroId: card.retroId,
    });
    emit(card.retroId, { type: "card_deleted", cardId });
    revalidatePath(`/retros/${card.retroId}`);
  }
}

export async function advancePhase(retroId: string, newPhase: string) {
  const user = await requireAuth();

  const updates: Record<string, unknown> = {
    status: newPhase,
    updatedAt: new Date(),
  };

  if (newPhase === "writing") {
    // Reset retro timer
    updates.startedAt = new Date();
    updates.completedAt = null;
    updates.totalDurationSec = null;

    // Reset all card discussion data for a clean slate
    await db.update(cards).set({
      isDiscussed: false,
      isSkipped: false,
      discussionStartedAt: null,
      discussionEndedAt: null,
      discussionDurationSec: null,
    }).where(eq(cards.retroId, retroId));

    // Clear all reactions for this retro's cards
    await db.delete(cardReactions).where(
      sql`${cardReactions.cardId} IN (SELECT id FROM cards WHERE retro_id = ${retroId})`
    );
  }

  if (newPhase === "completed") {
    const completedAt = new Date();
    updates.completedAt = completedAt;

    // Compute totalDurationSec from startedAt
    const [retro] = await db
      .select({ startedAt: retros.startedAt, createdAt: retros.createdAt })
      .from(retros)
      .where(eq(retros.id, retroId))
      .limit(1);

    if (retro) {
      const startedAt = retro.startedAt ?? retro.createdAt;
      updates.totalDurationSec = Math.round(
        (completedAt.getTime() - startedAt.getTime()) / 1000
      );
    }

    // Clear stale stats cache so it regenerates with fresh data
    updates.statsCache = null;
  }

  await db.update(retros).set(updates).where(eq(retros.id, retroId));
  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.RETRO_PHASE_CHANGE,
    entityType: "retro",
    entityId: retroId,
    retroId,
    metadata: { phase: newPhase },
  });
  emit(retroId, { type: "phase_changed", phase: newPhase });
  revalidatePath(`/retros/${retroId}`);
}

export async function markCardDiscussed(cardId: string) {
  const user = await requireAuth();

  const [card] = await db
    .update(cards)
    .set({
      isDiscussed: true,
      discussionEndedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(cards.id, cardId))
    .returning();

  if (card) {
    // Compute duration if we have a start time
    if (card.discussionStartedAt) {
      const durationSec = Math.floor(
        (Date.now() - new Date(card.discussionStartedAt).getTime()) / 1000
      );
      await db
        .update(cards)
        .set({ discussionDurationSec: durationSec })
        .where(eq(cards.id, cardId));
    }
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.CARD_DISCUSS_DONE,
      entityType: "card",
      entityId: cardId,
      retroId: card.retroId,
    });
    emit(card.retroId, { type: "discussion_update", action: "done", cardId });
    revalidatePath(`/retros/${card.retroId}`);
  }
}

export async function skipCard(cardId: string) {
  const user = await requireAuth();

  const [card] = await db
    .update(cards)
    .set({ isSkipped: true, updatedAt: new Date() })
    .where(eq(cards.id, cardId))
    .returning();

  if (card) {
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.CARD_SKIP,
      entityType: "card",
      entityId: cardId,
      retroId: card.retroId,
    });
    emit(card.retroId, { type: "discussion_update", action: "skip", cardId });
    revalidatePath(`/retros/${card.retroId}`);
  }
}

export async function unskipCard(cardId: string) {
  const user = await requireAuth();

  const [card] = await db
    .update(cards)
    .set({ isSkipped: false, updatedAt: new Date() })
    .where(eq(cards.id, cardId))
    .returning();

  if (card) {
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.CARD_UNSKIP,
      entityType: "card",
      entityId: cardId,
      retroId: card.retroId,
    });
    emit(card.retroId, { type: "discussion_update", action: "unskip", cardId });
    revalidatePath(`/retros/${card.retroId}`);
  }
}

export async function startCardDiscussion(cardId: string) {
  const user = await requireAuth();

  const [card] = await db
    .update(cards)
    .set({ discussionStartedAt: new Date(), updatedAt: new Date() })
    .where(eq(cards.id, cardId))
    .returning();

  if (card) {
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.CARD_DISCUSS_START,
      entityType: "card",
      entityId: cardId,
      retroId: card.retroId,
    });
    emit(card.retroId, { type: "discussion_update", action: "start", cardId });
    revalidatePath(`/retros/${card.retroId}`);
  }
}

export async function addTagToCard(cardId: string, tagName: string) {
  const user = await requireAuth();

  const trimmedName = tagName.trim().toLowerCase();
  if (!trimmedName) return;

  // Upsert tag
  let [tag] = await db
    .select()
    .from(tags)
    .where(eq(tags.name, trimmedName))
    .limit(1);

  if (!tag) {
    [tag] = await db
      .insert(tags)
      .values({ name: trimmedName })
      .returning();
  }

  // Link tag to card (ignore duplicate)
  try {
    await db.insert(cardTags).values({ cardId, tagId: tag.id });
    await db
      .update(tags)
      .set({ usageCount: sql`${tags.usageCount} + 1` })
      .where(eq(tags.id, tag.id));

    // Find retroId for the card to emit SSE event
    const [card] = await db.select({ retroId: cards.retroId }).from(cards).where(eq(cards.id, cardId)).limit(1);
    if (card) {
      await logAudit({
        actor: user,
        action: AUDIT_ACTIONS.CARD_TAG_ADD,
        entityType: "card",
        entityId: cardId,
        retroId: card.retroId,
        metadata: { tag: trimmedName },
      });
      emit(card.retroId, {
        type: "card_updated",
        cardId,
        changes: { updatedAt: new Date().toISOString() },
      });
    }
  } catch {
    // Unique constraint violation — tag already on card
  }
}

export async function removeTagFromCard(cardId: string, tagId: string) {
  const user = await requireAuth();

  await db
    .delete(cardTags)
    .where(and(eq(cardTags.cardId, cardId), eq(cardTags.tagId, tagId)));

  // Emit SSE event so other clients refresh tag state
  const [card] = await db.select({ retroId: cards.retroId }).from(cards).where(eq(cards.id, cardId)).limit(1);
  if (card) {
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.CARD_TAG_REMOVE,
      entityType: "card",
      entityId: cardId,
      retroId: card.retroId,
      metadata: { tagId },
    });
    emit(card.retroId, {
      type: "card_updated",
      cardId,
      changes: { updatedAt: new Date().toISOString() },
    });
  }
}

export async function assignCardAuthor(cardId: string, userId: string) {
  const user = await requireAuth();

  await db
    .update(cards)
    .set({ authorId: userId, updatedAt: new Date() })
    .where(eq(cards.id, cardId));

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.CARD_ASSIGN_AUTHOR,
    entityType: "card",
    entityId: cardId,
    metadata: { newAuthorId: userId },
  });

  revalidatePath("/retros");
}
