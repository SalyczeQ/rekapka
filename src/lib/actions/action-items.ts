"use server";

import { db } from "@/lib/db";
import { actionItems } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { createActionItemSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { emit } from "@/lib/realtime/event-bus";

export async function createActionItem(formData: FormData) {
  await requireAuth();

  const input = createActionItemSchema.parse({
    retroId: formData.get("retroId"),
    cardId: formData.get("cardId") || undefined,
    text: formData.get("text"),
    assigneeId: formData.get("assigneeId") || undefined,
    dueDate: formData.get("dueDate") || undefined,
  });

  const [item] = await db
    .insert(actionItems)
    .values({
      retroId: input.retroId,
      cardId: input.cardId ?? null,
      text: input.text,
      assigneeId: input.assigneeId ?? null,
      dueDate: input.dueDate ?? null,
    })
    .returning();

  emit(input.retroId, {
    type: "action_item_added",
    item: {
      id: item.id,
      retroId: item.retroId,
      cardId: item.cardId,
      text: item.text,
      assigneeId: item.assigneeId,
      status: item.status,
    },
  });
  revalidatePath(`/retros/${input.retroId}`);
  return item;
}

export async function updateActionItemStatus(itemId: string, status: string) {
  await requireAuth();

  const [item] = await db
    .update(actionItems)
    .set({ status, updatedAt: new Date() })
    .where(eq(actionItems.id, itemId))
    .returning();

  if (item) {
    emit(item.retroId, {
      type: "action_item_updated",
      itemId,
      changes: { status },
    });
    revalidatePath(`/retros/${item.retroId}`);
  }
}

export async function deleteActionItem(itemId: string) {
  await requireAuth();

  const [item] = await db
    .delete(actionItems)
    .where(eq(actionItems.id, itemId))
    .returning();

  if (item) {
    emit(item.retroId, { type: "action_item_deleted", itemId });
    revalidatePath(`/retros/${item.retroId}`);
  }
}
