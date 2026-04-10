"use server";

import { db } from "@/lib/db";
import { cardReactions, cards } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, sql, inArray } from "drizzle-orm";
import { emit } from "@/lib/realtime/event-bus";
import { REACTION_EMOJIS } from "@/lib/reactions";
import type { ReactionKey } from "@/lib/reactions";

const validKeys = new Set<string>(REACTION_EMOJIS.map((e) => e.key));

export async function toggleReaction(cardId: string, emoji: string) {
  const user = await requireAuth();

  if (!validKeys.has(emoji)) {
    throw new Error("Invalid emoji");
  }

  const [existing] = await db
    .select({ id: cardReactions.id })
    .from(cardReactions)
    .where(
      and(
        eq(cardReactions.cardId, cardId),
        eq(cardReactions.userId, user.id!),
        eq(cardReactions.emoji, emoji)
      )
    )
    .limit(1);

  if (existing) {
    await db.delete(cardReactions).where(eq(cardReactions.id, existing.id));
  } else {
    await db.insert(cardReactions).values({
      cardId,
      userId: user.id!,
      emoji,
    });
  }

  const counts = await db
    .select({
      emoji: cardReactions.emoji,
      count: sql<number>`count(*)::int`,
    })
    .from(cardReactions)
    .where(eq(cardReactions.cardId, cardId))
    .groupBy(cardReactions.emoji);

  const reactions: Record<string, number> = {};
  for (const row of counts) {
    reactions[row.emoji] = row.count;
  }

  const [card] = await db
    .select({ retroId: cards.retroId })
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);

  if (card) {
    emit(card.retroId, {
      type: "reactions_updated",
      cardId,
      reactions,
    });
  }

  return reactions;
}

export async function getCardReactions(cardIds: string[]): Promise<Record<string, Record<string, number>>> {
  if (cardIds.length === 0) return {};

  const rows = await db
    .select({
      cardId: cardReactions.cardId,
      emoji: cardReactions.emoji,
      count: sql<number>`count(*)::int`,
    })
    .from(cardReactions)
    .where(inArray(cardReactions.cardId, cardIds))
    .groupBy(cardReactions.cardId, cardReactions.emoji);

  const result: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    if (!result[row.cardId]) result[row.cardId] = {};
    result[row.cardId][row.emoji] = row.count;
  }
  return result;
}

export async function getUserReactions(cardIds: string[], userId: string): Promise<Record<string, string[]>> {
  if (cardIds.length === 0) return {};

  const rows = await db
    .select({
      cardId: cardReactions.cardId,
      emoji: cardReactions.emoji,
    })
    .from(cardReactions)
    .where(
      and(
        inArray(cardReactions.cardId, cardIds),
        eq(cardReactions.userId, userId)
      )
    );

  const result: Record<string, string[]> = {};
  for (const row of rows) {
    if (!result[row.cardId]) result[row.cardId] = [];
    result[row.cardId].push(row.emoji);
  }
  return result;
}
