import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { StatsClient } from "./stats-client";

export default async function RetroStatsPage({
  params,
}: {
  params: Promise<{ "team-slug": string; id: string }>;
}) {
  const { id: retroId } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [retro] = await db
    .select({ id: retros.id, title: retros.title, statsCache: retros.statsCache })
    .from(retros)
    .where(eq(retros.id, retroId))
    .limit(1);

  if (!retro) notFound();

  const initialStats = retro.statsCache
    ? JSON.parse(retro.statsCache)
    : null;

  return (
    <StatsClient
      retroId={retro.id}
      retroTitle={retro.title}
      initialStats={initialStats}
    />
  );
}
