import { db } from "@/lib/db";
import { retros } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getPhotoUrl } from "@/lib/s3/upload";

export default async function DashboardPage() {
  const t = await getTranslations("retro");
  const tNav = await getTranslations("nav");

  const retroList = await db
    .select()
    .from(retros)
    .orderBy(desc(retros.date))
    .limit(50);

  // Resolve signed photo URLs
  const retrosWithPhotos = await Promise.all(
    retroList.map(async (retro) => ({
      ...retro,
      photoSignedUrl: retro.photoUrl ? await getPhotoUrl(retro.photoUrl).catch(() => null) : null,
    }))
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-balance">{t("retros")}</h1>
        <Link href="/retros/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {tNav("newRetro")}
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
        <div className="space-y-3">
          {retrosWithPhotos.map((retro) => (
            <Link key={retro.id} href={`/retros/${retro.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer overflow-hidden">
                <div className="flex">
                  {retro.photoSignedUrl && (
                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={retro.photoSignedUrl}
                        alt={`${retro.title} team photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg truncate">{retro.title}</CardTitle>
                        <Badge variant={retro.status === "completed" ? "secondary" : "default"} className="shrink-0 ml-2">
                          {retro.status === "completed" ? t("statusCompleted") : t("active")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          {retro.date instanceof Date
                            ? retro.date.toLocaleDateString()
                            : new Date(retro.date).toLocaleDateString()}
                        </span>
                        {retro.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {retro.location}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
