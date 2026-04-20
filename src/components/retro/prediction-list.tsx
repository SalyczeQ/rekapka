"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Ban, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { resolvePrediction, deletePrediction } from "@/lib/actions/predictions";
import { vibrate } from "@/lib/haptics";
import type { SerializedPrediction } from "@/types/serialized";

interface PredictionListProps {
  predictions: SerializedPrediction[];
  currentRetroId: string;
  currentUserId: string;
  currentUserEmail?: string;
  onUpdate: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

export function PredictionList({ predictions, currentRetroId, currentUserId, currentUserEmail, onUpdate, onDelete }: PredictionListProps) {
  const t = useTranslations("predictions");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isAdmin = currentUserEmail === "salay14@gmail.com";

  if (predictions.length === 0) {
    return <p className="text-xs text-muted-foreground text-center py-2">{t("noPredictions")}</p>;
  }

  async function handleResolve(id: string, status: "correct" | "wrong" | "cancelled") {
    vibrate(50);
    onUpdate(id, status);
    await resolvePrediction(id, status, currentRetroId);
  }

  async function handleDelete(id: string) {
    vibrate(50);
    setConfirmDeleteId(null);
    onDelete?.(id);
    await deletePrediction(id);
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "correct":
        return <Badge className="bg-green-500/10 text-green-600 text-[10px] py-0">{t("correct")}</Badge>;
      case "wrong":
        return <Badge className="bg-red-500/10 text-red-600 text-[10px] py-0">{t("wrong")}</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="text-[10px] py-0">{t("cancelled")}</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] py-0">{t("open")}</Badge>;
    }
  };

  return (
    <div className="space-y-2">
      {predictions.map((p) => {
        const canResolve = p.status === "open" && (p.authorId === currentUserId || p.challengedUserId === currentUserId);
        return (
          <div
            key={p.id}
            className="text-sm border rounded-md px-3 py-2 space-y-1"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="flex-1 min-w-0">{p.text}</p>
              {statusBadge(p.status)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span style={{ color: p.authorColor }}>{p.authorName}</span>
              {p.stake && (
                <Badge variant="secondary" className="text-[10px] py-0">
                  🎯 {p.stake}
                </Badge>
              )}
              {p.deadline && (() => {
                const dl = new Date(p.deadline);
                const now = new Date();
                const diffDays = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const dateStr = dl.toLocaleDateString(undefined, { day: "numeric", month: "short" });
                if (p.status === "open" && diffDays < 0) {
                  return <Badge className="bg-red-500/10 text-red-600 text-[10px] py-0">{t("overdue")}</Badge>;
                }
                if (p.status === "open" && diffDays <= 7) {
                  return <Badge className="bg-amber-500/10 text-amber-600 text-[10px] py-0">{t("dueSoon")} · {dateStr}</Badge>;
                }
                return <span className="text-[10px]">📅 {dateStr}</span>;
              })()}
              {p.challengedUserName && (
                <span>→ {p.challengedUserName}</span>
              )}
            </div>
            {canResolve && (
              <div className="flex gap-1 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] text-green-600"
                  onClick={() => handleResolve(p.id, "correct")}
                >
                  <Check className="h-3 w-3 mr-0.5" aria-hidden="true" />
                  {t("correct")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] text-red-600"
                  onClick={() => handleResolve(p.id, "wrong")}
                >
                  <X className="h-3 w-3 mr-0.5" aria-hidden="true" />
                  {t("wrong")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px]"
                  onClick={() => handleResolve(p.id, "cancelled")}
                >
                  <Ban className="h-3 w-3 mr-0.5" aria-hidden="true" />
                  {t("cancelled")}
                </Button>
              </div>
            )}
            {isAdmin && (
              confirmDeleteId === p.id ? (
                <div className="flex items-center justify-end gap-1 pt-1 border-t">
                  <span className="text-[10px] text-destructive mr-1">{t("confirmDelete")}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px]"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 text-[10px]"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-0.5" aria-hidden="true" />
                    {t("delete")}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={() => setConfirmDeleteId(p.id)}
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </Button>
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
