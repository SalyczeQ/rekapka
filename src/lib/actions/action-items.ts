"use server";

import { db } from "@/lib/db";
import { actionItems, users, retros } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { createActionItemSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { emit } from "@/lib/realtime/event-bus";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function createActionItem(formData: FormData) {
  const user = await requireAuth();

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

  let assigneeName: string | null = null;
  if (item.assigneeId) {
    const [assignee] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, item.assigneeId))
      .limit(1);
    assigneeName = assignee?.name ?? null;
  }
  const [retro] = await db
    .select({ title: retros.title })
    .from(retros)
    .where(eq(retros.id, item.retroId))
    .limit(1);

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.ACTION_ITEM_CREATE,
    entityType: "action_item",
    entityId: item.id,
    retroId: item.retroId,
    metadata: {
      retroId: item.retroId,
      retroTitle: retro?.title ?? null,
      assigneeId: item.assigneeId,
      assigneeName,
      textLength: item.text.length,
    },
  });

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
  const user = await requireAuth();

  const [item] = await db
    .update(actionItems)
    .set({ status, updatedAt: new Date() })
    .where(eq(actionItems.id, itemId))
    .returning();

  if (item) {
    const [retro] = await db
      .select({ title: retros.title })
      .from(retros)
      .where(eq(retros.id, item.retroId))
      .limit(1);
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.ACTION_ITEM_UPDATE,
      entityType: "action_item",
      entityId: itemId,
      retroId: item.retroId,
      metadata: { retroId: item.retroId, retroTitle: retro?.title ?? null, status },
    });
    emit(item.retroId, {
      type: "action_item_updated",
      itemId,
      changes: { status },
    });
    revalidatePath(`/retros/${item.retroId}`);
  }
}

export async function deleteActionItem(itemId: string) {
  const user = await requireAuth();

  const [item] = await db
    .delete(actionItems)
    .where(eq(actionItems.id, itemId))
    .returning();

  if (item) {
    const [retro] = await db
      .select({ title: retros.title })
      .from(retros)
      .where(eq(retros.id, item.retroId))
      .limit(1);
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.ACTION_ITEM_DELETE,
      entityType: "action_item",
      entityId: itemId,
      retroId: item.retroId,
      metadata: { retroId: item.retroId, retroTitle: retro?.title ?? null },
    });
    emit(item.retroId, { type: "action_item_deleted", itemId });
    revalidatePath(`/retros/${item.retroId}`);
  }
}
