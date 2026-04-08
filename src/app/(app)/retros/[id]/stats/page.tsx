import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { retros } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { StatsDashboard } from "@/components/stats/stats-dashboard";

interface StatsPageProps {
  params: Promise<{ id: string }>;
}

export default async function StatsPage({ params }: StatsPageProps) {
  const { id } = await params;
  await requireAuth();

  const [retro] = await db.select().from(retros).where(eq(retros.id, id));

  if (!retro) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <StatsDashboard retroId={id} retroTitle={retro.title} />
    </div>
  );
}
