"use server";

import { db } from "@/lib/db";
import { retros, categories, cards } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { createRetroSchema, updateRetroSchema } from "@/lib/validators";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CATEGORY_NAMES } from "@/types";
import { emit } from "@/lib/realtime/event-bus";

const CATEGORY_DEFAULTS = [
  { name: "Mad", icon: "😡", color: "#EF4444", sortOrder: 0 },
  { name: "Sad", icon: "😢", color: "#3B82F6", sortOrder: 1 },
  { name: "Glad", icon: "😊", color: "#10B981", sortOrder: 2 },
] as const;

export async function createRetro(formData: FormData) {
  const user = await requireAuth();
  const fromRetroId = formData.get("fromRetroId") as string | null;

  const input = createRetroSchema.parse({
    title: formData.get("title"),
    date: formData.get("date"),
    location: formData.get("location") || undefined,
  });

  const [retro] = await db
    .insert(retros)
    .values({
      title: input.title,
      date: input.date,
      location: input.location ?? null,
      createdBy: user.id!,
      status: "writing",
      startedAt: new Date(),
    })
    .returning();

  // Create the 3 default categories
  const newCategories = await db
    .insert(categories)
    .values(
      CATEGORY_DEFAULTS.map((cat) => ({
        retroId: retro.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        sortOrder: cat.sortOrder,
      }))
    )
    .returning();

  // Carry over undiscussed + skipped cards from previous retro
  if (fromRetroId) {
    const cardsToCarry = await db
      .select()
      .from(cards)
      .where(and(eq(cards.retroId, fromRetroId), eq(cards.isDiscussed, false)));

    if (cardsToCarry.length > 0) {
      const oldCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.retroId, fromRetroId));

      const categoryMap = new Map<string, string>();
      for (const oldCat of oldCategories) {
        const newCat = newCategories.find((nc) => nc.name === oldCat.name);
        if (newCat) {
          categoryMap.set(oldCat.id, newCat.id);
        }
      }

      for (const card of cardsToCarry) {
        const newCategoryId = categoryMap.get(card.categoryId);
        if (newCategoryId) {
          await db.insert(cards).values({
            retroId: retro.id,
            categoryId: newCategoryId,
            authorId: card.authorId,
            text: card.text,
            groupLabel: null,
            isDiscussed: false,
            isSkipped: false,
            carriedFromRetroId: fromRetroId,
          });
        }
      }
    }
  }

  revalidatePath("/");
  redirect(`/retros/${retro.id}`);
}

export async function updateRetro(retroId: string, formData: FormData) {
  await requireAuth();

  const input = updateRetroSchema.parse({
    title: formData.get("title") || undefined,
    location: formData.get("location") || undefined,
    date: formData.get("date") || undefined,
  });

  await db
    .update(retros)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(retros.id, retroId));

  emit(retroId, { type: "retro_updated", changes: { ...input } });
  revalidatePath(`/retros/${retroId}`);
}

export async function deleteRetro(retroId: string) {
  const user = await requireAuth();

  if (user.email !== "salay14@gmail.com") {
    throw new Error("Not authorized to delete retros");
  }

  await db.delete(retros).where(eq(retros.id, retroId));
  revalidatePath("/");
  redirect("/retros");
}
