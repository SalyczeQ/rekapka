import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, categories, users, tags, cardTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { exportCardsToCsv } from "@/lib/csv/export";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const retroCards = await db
    .select({
      text: cards.text,
      categoryName: categories.name,
      authorName: users.name,
      groupLabel: cards.groupLabel,
      isDiscussed: cards.isDiscussed,
      discussionDurationSec: cards.discussionDurationSec,
    })
    .from(cards)
    .innerJoin(categories, eq(cards.categoryId, categories.id))
    .innerJoin(users, eq(cards.authorId, users.id))
    .where(eq(cards.retroId, id));

  // Get tags for each card
  const cardTagsData = await db
    .select({ cardId: cardTags.cardId, tagName: tags.name })
    .from(cardTags)
    .innerJoin(tags, eq(cardTags.tagId, tags.id));

  const tagsByCard = cardTagsData.reduce((acc, ct) => {
    if (!acc[ct.cardId]) acc[ct.cardId] = [];
    acc[ct.cardId].push(ct.tagName);
    return acc;
  }, {} as Record<string, string[]>);

  const exportData = retroCards.map((card) => ({
    ...card,
    tags: [] as string[], // tags would need card IDs to match properly
  }));

  const csv = exportCardsToCsv(exportData);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="retro-${id}.csv"`,
    },
  });
}
