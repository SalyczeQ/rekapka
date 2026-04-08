import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { emit } from "@/lib/realtime/event-bus";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth();
  const { id } = await params;
  const { phase } = await request.json();

  const validPhases = ["writing", "discussing", "completed"];
  if (!validPhases.includes(phase)) {
    return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    status: phase,
    updatedAt: new Date(),
  };

  if (phase === "completed") {
    updates.completedAt = new Date();
  }

  await db.update(retros).set(updates).where(eq(retros.id, id));

  emit(id, { type: "phase_changed", phase });
  return NextResponse.json({ ok: true, phase });
}
