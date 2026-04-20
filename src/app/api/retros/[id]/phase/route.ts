import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { emit } from "@/lib/realtime/event-bus";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  const { id } = await params;
  const { phase } = await request.json();

  const validPhases = ["writing", "discussing", "completed"];
  if (!validPhases.includes(phase)) {
    return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
  }

  const [prev] = await db
    .select({ status: retros.status, title: retros.title })
    .from(retros)
    .where(eq(retros.id, id))
    .limit(1);
  const fromPhase = prev?.status ?? null;
  const retroTitle = prev?.title ?? null;

  const updates: Record<string, unknown> = {
    status: phase,
    updatedAt: new Date(),
  };

  if (phase === "completed") {
    updates.completedAt = new Date();
  }

  await db.update(retros).set(updates).where(eq(retros.id, id));

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.RETRO_PHASE_CHANGE,
    entityType: "retro",
    entityId: id,
    retroId: id,
    metadata: { retroId: id, retroTitle, from: fromPhase, to: phase },
  });

  emit(id, { type: "phase_changed", phase });
  return NextResponse.json({ ok: true, phase });
}
