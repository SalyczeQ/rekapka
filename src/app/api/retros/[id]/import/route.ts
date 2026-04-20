import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards, categories, retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { importCardsFromCsv } from "@/lib/csv/import";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  const { id } = await params;

  const body = await request.text();
  const rows = importCardsFromCsv(body);

  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows found in CSV" }, { status: 400 });
  }

  const retroCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.retroId, id));

  const categoryMap = new Map(retroCategories.map((c) => [c.name.toLowerCase(), c.id]));

  let imported = 0;

  for (const row of rows) {
    const categoryId = categoryMap.get(row.category.toLowerCase());
    if (!categoryId || !row.text.trim()) continue;

    await db.insert(cards).values({
      retroId: id,
      categoryId,
      authorId: user.id!,
      text: row.text.trim(),
    });

    imported++;
  }

  const [retro] = await db
    .select({ title: retros.title })
    .from(retros)
    .where(eq(retros.id, id))
    .limit(1);

  await logAudit({
    actor: user,
    action: AUDIT_ACTIONS.RETRO_CARD_IMPORT,
    entityType: "retro",
    entityId: id,
    retroId: id,
    metadata: { retroId: id, retroTitle: retro?.title ?? null, imported, totalRows: rows.length },
  });

  return NextResponse.json({ imported });
}
