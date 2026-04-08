"use client";

import type { SerializedRetro } from "@/types/serialized";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Camera } from "lucide-react";

interface RetroMetadataProps {
  retro: SerializedRetro;
}

export function RetroMetadata({ retro }: RetroMetadataProps) {
  const t = useTranslations("retro");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{retro.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {new Date(retro.date).toLocaleDateString()}
        </div>
        {retro.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {retro.location}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Camera className="h-4 w-4" aria-hidden="true" />
          {retro.photoUrl ? t("photoUploaded") : t("noPhoto")}
        </div>
      </CardContent>
    </Card>
  );
}
