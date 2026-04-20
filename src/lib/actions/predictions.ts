"use server";

import { db } from "@/lib/db";
import { predictions, users, retros } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { emit } from "@/lib/realtime/event-bus";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function createPrediction(formData: FormData) {
  const user = await requireAuth();

  const retroId = formData.get("retroId") as string;
  const text = (formData.get("text") as string)?.trim();
  const stake = (formData.get("stake") as string)?.trim() || null;
  const challengedUserId = (formData.get("challengedUserId") as string) || null;
  const deadlineStr = formData.get("deadline") as string | null;
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  if (!text || !retroId) return;

  const [prediction] = await db
    .insert(predictions)
    .values({
      retroId,
      authorId: user.id!,
      text,
      stake,
      challengedUserId,
      deadline,
    })
    .returning();

  // Fetch author + challenged user names for SSE
  const [author] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, user.id!))
    .limit(1);

  let challengedUserName: string | null = null;
  if (challengedUserId) {
    const [challenged] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, challengedUserId))
      .limit(1);
    challengedUserName = challenged?.name ?? null;
  }

  const [retro] = await db
    .select({ title: retros.title })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1);

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.PREDICTION_CREATE,
    entityType: "prediction",
    entityId: prediction.id,
    retroId,
    metadata: {
      retroId,
      retroTitle: retro?.title ?? null,
      challengedUserId,
      challengedUserName,
      stake,
      textLength: text.length,
    },
  });

  emit(retroId, {
    type: "prediction_added",
    prediction: {
      id: prediction.id,
      retroId: prediction.retroId,
      authorId: prediction.authorId,
      authorName: author?.name ?? "",
      text: prediction.text,
      stake: prediction.stake,
      challengedUserId: prediction.challengedUserId,
      challengedUserName,
      status: prediction.status,
      deadline: prediction.deadline ? prediction.deadline.toISOString() : null,
      createdAt: new Date().toISOString(),
    },
  });

  revalidatePath(`/retros/${retroId}`);
  return prediction;
}

export async function resolvePrediction(
  predictionId: string,
  status: "correct" | "wrong" | "cancelled",
  currentRetroId?: string
) {
  const user = await requireAuth();

  const [prediction] = await db
    .update(predictions)
    .set({
      status,
      resolvedAt: new Date(),
      resolvedBy: user.id!,
      resolvedInRetroId: currentRetroId ?? null,
      updatedAt: new Date(),
    })
    .where(eq(predictions.id, predictionId))
    .returning();

  if (prediction) {
    const [origRetro] = await db
      .select({ title: retros.title })
      .from(retros)
      .where(eq(retros.id, prediction.retroId))
      .limit(1);
    let resolvedInRetroTitle: string | null = null;
    if (currentRetroId) {
      const [r] = await db
        .select({ title: retros.title })
        .from(retros)
        .where(eq(retros.id, currentRetroId))
        .limit(1);
      resolvedInRetroTitle = r?.title ?? null;
    }
    await logAudit({
      actor: user,
      action: AUDIT_ACTIONS.PREDICTION_RESOLVE,
      entityType: "prediction",
      entityId: predictionId,
      retroId: prediction.retroId,
      metadata: {
        retroId: prediction.retroId,
        retroTitle: origRetro?.title ?? null,
        status,
        resolvedInRetroId: currentRetroId ?? null,
        resolvedInRetroTitle,
      },
    });
    emit(prediction.retroId, {
      type: "prediction_resolved",
      predictionId,
      status,
    });
    revalidatePath(`/retros/${prediction.retroId}`);
  }
}

export async function deletePrediction(predictionId: string) {
  const user = await requireAuth();

  if (user.email !== "salay14@gmail.com") {
    throw new Error("Not authorized to delete predictions");
  }

  const [prediction] = await db
    .select({
      id: predictions.id,
      retroId: predictions.retroId,
      text: predictions.text,
      authorId: predictions.authorId,
    })
    .from(predictions)
    .where(eq(predictions.id, predictionId))
    .limit(1);

  if (!prediction) return;

  await db.delete(predictions).where(eq(predictions.id, predictionId));

  const [retro] = await db
    .select({ title: retros.title })
    .from(retros)
    .where(eq(retros.id, prediction.retroId))
    .limit(1);

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.PREDICTION_DELETE,
    entityType: "prediction",
    entityId: predictionId,
    retroId: prediction.retroId,
    metadata: {
      retroId: prediction.retroId,
      retroTitle: retro?.title ?? null,
      authorId: prediction.authorId,
      textLength: prediction.text.length,
    },
  });

  emit(prediction.retroId, {
    type: "prediction_deleted",
    predictionId,
  });

  revalidatePath(`/retros/${prediction.retroId}`);
  revalidatePath("/predictions");
}
