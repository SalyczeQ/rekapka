"use server";

import { db } from "@/lib/db";
import { inviteTokens } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createInviteToken() {
  const user = await requireAuth();

  const [token] = await db
    .insert(inviteTokens)
    .values({
      createdBy: user.id!,
      isReusable: true,
    })
    .returning();

  revalidatePath("/admin");
  return token;
}

export async function deleteInviteToken(tokenId: string) {
  await requireAuth();
  await db.delete(inviteTokens).where(eq(inviteTokens.id, tokenId));
  revalidatePath("/admin");
}
