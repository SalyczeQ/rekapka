import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { retros, categories, cards, users, actionItems, predictions } from "@/lib/db/schema";
import { eq, ne, and, sql, or, lte, isNull } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { RetroSession } from "@/components/retro/retro-session";
import { getPhotoUrl } from "@/lib/s3/upload";
import type { SerializedRetro, SerializedCategory, SerializedCard, SerializedActionItem, SerializedPrediction } from "@/types/serialized";

interface RetroPageProps {
  params: Promise<{ id: string }>;
}

function serialize<T>(obj: unknown): T {
  return JSON.parse(JSON.stringify(obj));
}

export default async function RetroPage({ params }: RetroPageProps) {
  const { id } = await params;
  const currentUser = await requireAuth();

  const [retro] = await db.select().from(retros).where(eq(retros.id, id));

  if (!retro) {
    notFound();
  }

  // Fetch current user's dictation preference
  const [currentUserRecord] = await db
    .select({ dictationEnabled: users.dictationEnabled })
    .from(users)
    .where(eq(users.id, currentUser.id!))
    .limit(1);

  const [retroCategories, retroCards, allUsers, retroActionItems] = await Promise.all([
    db
      .select()
      .from(categories)
      .where(eq(categories.retroId, id))
      .orderBy(categories.sortOrder),
    db
      .select({
        id: cards.id,
        retroId: cards.retroId,
        categoryId: cards.categoryId,
        authorId: cards.authorId,
        text: cards.text,
        sortOrder: cards.sortOrder,
        groupLabel: cards.groupLabel,
        isDiscussed: cards.isDiscussed,
        isSkipped: cards.isSkipped,
        discussionNotes: cards.discussionNotes,
        discussionStartedAt: cards.discussionStartedAt,
        discussionEndedAt: cards.discussionEndedAt,
        discussionDurationSec: cards.discussionDurationSec,
        carriedFromRetroId: cards.carriedFromRetroId,
        createdAt: cards.createdAt,
        updatedAt: cards.updatedAt,
        authorName: users.name,
        authorColor: users.color,
        authorImage: users.image,
      })
      .from(cards)
      .innerJoin(users, eq(cards.authorId, users.id))
      .where(eq(cards.retroId, id)),
    db
      .select({ id: users.id, name: users.name, color: users.color, image: users.image })
      .from(users),
    db
      .select({
        id: actionItems.id,
        retroId: actionItems.retroId,
        cardId: actionItems.cardId,
        text: actionItems.text,
        assigneeId: actionItems.assigneeId,
        assigneeName: users.name,
        status: actionItems.status,
        createdAt: actionItems.createdAt,
      })
      .from(actionItems)
      .leftJoin(users, eq(actionItems.assigneeId, users.id))
      .where(eq(actionItems.retroId, id)),
  ]);

  // Fetch predictions for this retro + unresolved from past retros
  const retroPredictions = await db
    .select({
      id: predictions.id,
      retroId: predictions.retroId,
      authorId: predictions.authorId,
      authorName: users.name,
      authorColor: users.color,
      text: predictions.text,
      stake: predictions.stake,
      challengedUserId: predictions.challengedUserId,
      status: predictions.status,
      deadline: predictions.deadline,
      resolvedInRetroId: predictions.resolvedInRetroId,
      createdAt: predictions.createdAt,
    })
    .from(predictions)
    .innerJoin(users, eq(predictions.authorId, users.id))
    .where(eq(predictions.retroId, id));

  // Add challenged user names
  const predictionsWithNames = await Promise.all(
    retroPredictions.map(async (p) => {
      let challengedUserName: string | null = null;
      if (p.challengedUserId) {
        const [u] = await db.select({ name: users.name }).from(users).where(eq(users.id, p.challengedUserId)).limit(1);
        challengedUserName = u?.name ?? null;
      }
      return { ...p, challengedUserName };
    })
  );

  // Unresolved predictions from past retros
  const unresolvedFromPast = await db
    .select({
      id: predictions.id,
      retroId: predictions.retroId,
      authorId: predictions.authorId,
      authorName: users.name,
      authorColor: users.color,
      text: predictions.text,
      stake: predictions.stake,
      challengedUserId: predictions.challengedUserId,
      status: predictions.status,
      deadline: predictions.deadline,
      resolvedInRetroId: predictions.resolvedInRetroId,
      createdAt: predictions.createdAt,
    })
    .from(predictions)
    .innerJoin(users, eq(predictions.authorId, users.id))
    .where(and(
      ne(predictions.retroId, id),
      eq(predictions.status, "open"),
      or(isNull(predictions.deadline), lte(predictions.deadline, new Date()))
    ));

  const unresolvedWithNames = await Promise.all(
    unresolvedFromPast.map(async (p) => {
      let challengedUserName: string | null = null;
      if (p.challengedUserId) {
        const [u] = await db.select({ name: users.name }).from(users).where(eq(users.id, p.challengedUserId)).limit(1);
        challengedUserName = u?.name ?? null;
      }
      return { ...p, challengedUserName };
    })
  );

  // Resolve signed photo URL if photo exists
  const photoSignedUrl = retro.photoUrl
    ? await getPhotoUrl(retro.photoUrl).catch(() => null)
    : null;

  return (
    <RetroSession
      retro={serialize<SerializedRetro>(retro)}
      categories={serialize<SerializedCategory[]>(retroCategories)}
      initialCards={serialize<SerializedCard[]>(retroCards)}
      initialActionItems={serialize<SerializedActionItem[]>(retroActionItems)}
      initialPredictions={serialize<SerializedPrediction[]>(predictionsWithNames)}
      unresolvedPredictions={serialize<SerializedPrediction[]>(unresolvedWithNames)}
      currentUserId={currentUser.id!}
      currentUserEmail={currentUser.email ?? ""}
      allUsers={serialize<{ id: string; name: string; color: string; image: string | null }[]>(allUsers)}
      photoUrl={photoSignedUrl}
      dictationEnabled={currentUserRecord?.dictationEnabled ?? true}
    />
  );
}
