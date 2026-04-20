import { db } from "@/lib/db";
import { retros, cards } from "@/lib/db/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, MessageSquare, Clock } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { getPhotoUrl } from "@/lib/s3/upload";

export default async function DashboardPage() {
  const t = await getTranslations("retro");
  const tNav = await getTranslations("nav");
  const locale = await getLocale();

  const retroList = await db
    .select()
    .from(retros)
    .orderBy(desc(retros.date))
    .limit(50);

  // Fetch card counts per retro
  const cardCounts = await db
    .select({
      retroId: cards.retroId,
      total: count(),
      discussed: sql<number>`count(*) filter (where ${cards.isDiscussed} = true)`,
    })
    .from(cards)
    .groupBy(cards.retroId);

  const cardCountMap = new Map(
    cardCounts.map((c) => [c.retroId, { total: c.total, discussed: c.discussed }])
  );

  // Resolve signed photo URLs
  const retrosWithPhotos = await Promise.all(
    retroList.map(async (retro) => ({
      ...retro,
      photoSignedUrl: retro.photoUrl ? await getPhotoUrl(retro.photoUrl).catch(() => null) : null,
      cardCount: cardCountMap.get(retro.id) ?? { total: 0, discussed: 0 },
    }))
  );

  const activeRetros = retrosWithPhotos.filter((r) => r.status !== "completed");
  const completedRetros = retrosWithPhotos.filter((r) => r.status === "completed");

  const formatDuration = (sec: number | null) => {
    if (!sec) return null;
    const m = Math.floor(sec / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  };

  const dateLocale = locale === "cs" ? "cs-CZ" : "en-US";
  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" });
  };

  function RetroCard({ retro }: { retro: (typeof retrosWithPhotos)[number] }) {
    const isActive = retro.status !== "completed";
    const duration = formatDuration(retro.totalDurationSec);

    return (
      <Link href={`/retros/${retro.id}`}>
        <Card className={`hover:bg-accent/50 transition-colors cursor-pointer ${isActive ? "border-primary/30 ring-1 ring-primary/10" : ""}`}>
          <div className="flex items-center gap-4 p-4">
            {retro.photoSignedUrl && (
              <div className="relative w-20 h-20 md:w-32 md:h-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={retro.photoSignedUrl}
                  alt={`${retro.title} team photo`}
                  fill
                  sizes="(max-width: 768px) 80px, 128px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate flex-1 min-w-0">{retro.title}</h3>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={`shrink-0 text-[10px] ${isActive ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {isActive ? t("active") : t("statusCompleted")}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap tabular-nums">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  {formatDate(retro.date)}
                </span>
                {retro.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {retro.location}
                  </span>
                )}
                {retro.cardCount.total > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" aria-hidden="true" />
                    {retro.cardCount.discussed}/{retro.cardCount.total}
                  </span>
                )}
                {duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-balance">{t("retros")}</h1>
        <Link href="/retros/new">
          <Button size="sm">
            <Plus className="h-4 w-4 md:mr-2" aria-hidden="true" />
            <span className="hidden md:inline">{tNav("newRetro")}</span>
          </Button>
        </Link>
      </div>

      {retroList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("noRetros")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Active retros */}
          {activeRetros.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t("active")}
              </h2>
              <div className="space-y-3">
                {activeRetros.map((retro) => (
                  <RetroCard key={retro.id} retro={retro} />
                ))}
              </div>
            </section>
          )}

          {/* Completed retros */}
          {completedRetros.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t("statusCompleted")} ({completedRetros.length})
              </h2>
              <div className="space-y-2">
                {completedRetros.map((retro) => (
                  <RetroCard key={retro.id} retro={retro} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
