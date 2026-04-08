"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import type { SerializedCard } from "@/types/serialized";

interface AiGroupButtonProps {
  retroId: string;
  cards: SerializedCard[];
  onCardsChange: (cards: SerializedCard[]) => void;
}

export function AiGroupButton({ retroId, cards, onCardsChange }: AiGroupButtonProps) {
  const t = useTranslations("grouping");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasGroups = cards.some((c) => c.groupLabel);

  async function handleGroup() {
    if (cards.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retroId }),
      });

      if (!res.ok) throw new Error("Failed to group cards");

      const { results } = await res.json();

      // Update local card state with group labels
      const labelMap = new Map<string, string>();
      for (const r of results) {
        if (r.groupLabel) labelMap.set(r.cardId, r.groupLabel);
      }

      onCardsChange(
        cards.map((card) => {
          const newLabel = labelMap.get(card.id);
          return newLabel ? { ...card, groupLabel: newLabel } : card;
        })
      );
    } catch {
      setError(t("failed"));
    } finally {
      setIsLoading(false);
    }
  }

  if (cards.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={hasGroups ? "outline" : "secondary"}
        size="sm"
        onClick={handleGroup}
        disabled={isLoading}
        aria-label={hasGroups ? t("regroup") : t("aiGroupCards")}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" aria-hidden="true" />
            {t("grouping")}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-1.5" aria-hidden="true" />
            {hasGroups ? t("regroup") : t("aiGroupCards")}
          </>
        )}
      </Button>
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}
