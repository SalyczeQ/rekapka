"use server";

import { db } from "@/lib/db";
import { inviteTokens } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function createInviteToken() {
  const user = await requireAuth();

  const [token] = await db
    .insert(inviteTokens)
    .values({
      createdBy: user.id!,
      isReusable: true,
    })
    .returning();

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.INVITE_CREATE,
    entityType: "invite_token",
    entityId: token.id,
  });

  revalidatePath("/settings");
  return token;
}

export async function deleteInviteToken(tokenId: string) {
  const user = await requireAuth();
  await db.delete(inviteTokens).where(eq(inviteTokens.id, tokenId));
  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.INVITE_DELETE,
    entityType: "invite_token",
    entityId: tokenId,
  });
  revalidatePath("/settings");
}
