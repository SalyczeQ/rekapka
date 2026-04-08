import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { retros, cards, categories, users } from "@/lib/db/schema";
import { eq, ne } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CardsList } from "@/components/retro/cards-list";

interface CardsPageProps {
  params: Promise<{ id: string }>;
}

function serialize<T>(obj: unknown): T {
  return JSON.parse(JSON.stringify(obj));
}

export default async function CardsPage({ params }: CardsPageProps) {
  const { id } = await params;
  await requireAuth();
  const t = await getTranslations("cards");

  const [retro] = await db.select().from(retros).where(eq(retros.id, id));
  if (!retro) notFound();

  const retroCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.retroId, id))
    .orderBy(categories.sortOrder);

  const retroCards = await db
    .select({
      id: cards.id,
      text: cards.text,
      categoryId: cards.categoryId,
      authorId: cards.authorId,
      isDiscussed: cards.isDiscussed,
      isSkipped: cards.isSkipped,
      discussionDurationSec: cards.discussionDurationSec,
      discussionNotes: cards.discussionNotes,
      groupLabel: cards.groupLabel,
      guessedAuthor: cards.guessedAuthor,
      createdAt: cards.createdAt,
      authorName: users.name,
      authorColor: users.color,
      authorImage: users.image,
    })
    .from(cards)
    .innerJoin(users, eq(cards.authorId, users.id))
    .where(eq(cards.retroId, id))
    .orderBy(cards.sortOrder);

  // Get unique authors who have cards in this retro
  const authorMap = new Map<string, { id: string; name: string; color: string; image: string | null }>();
  for (const card of retroCards) {
    if (!authorMap.has(card.authorId)) {
      authorMap.set(card.authorId, {
        id: card.authorId,
        name: card.authorName,
        color: card.authorColor,
        image: card.authorImage,
      });
    }
  }
  const authors = Array.from(authorMap.values());

  // Fetch all real users (non-anonymous) for author reassignment
  const allUsers = await db
    .select({ id: users.id, name: users.name, color: users.color, image: users.image })
    .from(users)
    .where(ne(users.email, "anonymous@rekapka.local"));

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 select-none">
      <div className="flex items-center gap-3">
        <Link
          href={`/retros/${id}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("backToRetro")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{retro.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle", { count: retroCards.length })}
          </p>
        </div>
      </div>

      <CardsList
        cards={serialize(retroCards)}
        categories={serialize(retroCategories)}
        authors={serialize(authors)}
        allUsers={serialize(allUsers)}
      />
    </div>
  );
}
