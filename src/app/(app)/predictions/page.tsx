import { db } from "@/lib/db";
import { predictions, users, retros } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import { PredictionsPage } from "@/components/predictions/predictions-page";
import type { SerializedPrediction } from "@/types/serialized";

function serialize<T>(obj: unknown): T {
  return JSON.parse(JSON.stringify(obj));
}

export default async function PredictionsRoute() {
  const currentUser = await requireAuth();
  const t = await getTranslations("predictions");

  const allPredictions = await db
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
      retroTitle: retros.title,
    })
    .from(predictions)
    .innerJoin(users, eq(predictions.authorId, users.id))
    .innerJoin(retros, eq(predictions.retroId, retros.id))
    .orderBy(desc(predictions.createdAt));

  // Add challenged user names + resolved retro titles
  const enriched = await Promise.all(
    allPredictions.map(async (p) => {
      let challengedUserName: string | null = null;
      if (p.challengedUserId) {
        const [u] = await db.select({ name: users.name }).from(users).where(eq(users.id, p.challengedUserId)).limit(1);
        challengedUserName = u?.name ?? null;
      }
      let resolvedInRetroTitle: string | undefined;
      if (p.resolvedInRetroId) {
        const [r] = await db.select({ title: retros.title }).from(retros).where(eq(retros.id, p.resolvedInRetroId)).limit(1);
        resolvedInRetroTitle = r?.title;
      }
      return { ...p, challengedUserName, resolvedInRetroTitle };
    })
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("allPredictions")}</h1>
      <PredictionsPage
        predictions={serialize<SerializedPrediction[]>(enriched)}
        currentUserId={currentUser.id!}
        currentUserEmail={currentUser.email ?? undefined}
      />
    </div>
  );
}
