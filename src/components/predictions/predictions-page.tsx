"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Ban } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { resolvePrediction } from "@/lib/actions/predictions";
import { vibrate } from "@/lib/haptics";
import type { SerializedPrediction } from "@/types/serialized";

interface PredictionsPageProps {
  predictions: SerializedPrediction[];
  currentUserId: string;
}

type Tab = "open" | "resolved" | "cancelled";

export function PredictionsPage({ predictions: initial, currentUserId }: PredictionsPageProps) {
  const t = useTranslations("predictions");
  const [predictions, setPredictions] = useState(initial);
  const [tab, setTab] = useState<Tab>("open");

  const open = predictions.filter((p) => p.status === "open");
  const resolved = predictions.filter((p) => p.status === "correct" || p.status === "wrong");
  const cancelled = predictions.filter((p) => p.status === "cancelled");

  const current = tab === "open" ? open : tab === "resolved" ? resolved : cancelled;

  async function handleResolve(id: string, status: "correct" | "wrong" | "cancelled") {
    vibrate(50);
    setPredictions((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    await resolvePrediction(id, status);
  }

  const deadlineBadge = (p: SerializedPrediction) => {
    if (!p.deadline) return null;
    const dl = new Date(p.deadline);
    const now = new Date();
    const diffDays = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const dateStr = dl.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    if (p.status === "open" && diffDays < 0) {
      return <Badge className="bg-red-500/10 text-red-600 text-[10px] py-0">{t("overdue")}</Badge>;
    }
    if (p.status === "open" && diffDays <= 7) {
      return <Badge className="bg-amber-500/10 text-amber-600 text-[10px] py-0">{t("dueSoon")} · {dateStr}</Badge>;
    }
    return <span className="text-[10px] text-muted-foreground">📅 {dateStr}</span>;
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "correct": return <Badge className="bg-green-500/10 text-green-600 text-[10px] py-0">{t("correct")}</Badge>;
      case "wrong": return <Badge className="bg-red-500/10 text-red-600 text-[10px] py-0">{t("wrong")}</Badge>;
      case "cancelled": return <Badge variant="secondary" className="text-[10px] py-0">{t("cancelled")}</Badge>;
      default: return <Badge variant="outline" className="text-[10px] py-0">{t("open")}</Badge>;
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "open", label: t("tabOpen"), count: open.length },
    { key: "resolved", label: t("tabResolved"), count: resolved.length },
    { key: "cancelled", label: t("tabCancelled"), count: cancelled.length },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex gap-3 text-sm text-muted-foreground">
        <span>{t("openCount", { count: open.length })}</span>
        <span>{t("resolvedCount", { count: resolved.length })}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map((tb) => (
          <Button
            key={tb.key}
            variant={tab === tb.key ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(tb.key)}
          >
            {tb.label}
            <Badge variant="secondary" className="ml-1.5 tabular-nums text-[10px] px-1.5 py-0">
              {tb.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* List */}
      {current.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">{t("noPredictions")}</p>
      ) : (
        <div className="space-y-2">
          {current.map((p) => {
            const canResolve = p.status === "open" && (p.authorId === currentUserId || p.challengedUserId === currentUserId);
            return (
              <Card key={p.id}>
                <CardContent className="py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm flex-1 min-w-0">{p.text}</p>
                    {statusBadge(p.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <span style={{ color: p.authorColor }}>{p.authorName}</span>
                    {p.stake && (
                      <Badge variant="secondary" className="text-[10px] py-0">🎯 {p.stake}</Badge>
                    )}
                    {p.challengedUserName && <span>→ {p.challengedUserName}</span>}
                    {deadlineBadge(p)}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    {p.retroTitle && (
                      <Link href={`/retros/${p.retroId}`} className="hover:underline">
                        {t("createdIn")}: {p.retroTitle}
                      </Link>
                    )}
                    {p.resolvedInRetroTitle && p.resolvedInRetroId && (
                      <Link href={`/retros/${p.resolvedInRetroId}`} className="hover:underline">
                        {t("resolvedIn")}: {p.resolvedInRetroTitle}
                      </Link>
                    )}
                  </div>
                  {canResolve && (
                    <div className="flex gap-1 pt-1">
                      <Button size="sm" variant="outline" className="h-6 text-[10px] text-green-600" onClick={() => handleResolve(p.id, "correct")}>
                        <Check className="h-3 w-3 mr-0.5" />{t("correct")}
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] text-red-600" onClick={() => handleResolve(p.id, "wrong")}>
                        <X className="h-3 w-3 mr-0.5" />{t("wrong")}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => handleResolve(p.id, "cancelled")}>
                        <Ban className="h-3 w-3 mr-0.5" />{t("cancelled")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
