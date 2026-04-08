import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inviteTokens } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";

export async function POST() {
  const user = await requireAuth();

  const [token] = await db
    .insert(inviteTokens)
    .values({
      createdBy: user.id!,
      isReusable: true,
    })
    .returning();

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token.token}`;

  return NextResponse.json({ token: token.token, url });
}
