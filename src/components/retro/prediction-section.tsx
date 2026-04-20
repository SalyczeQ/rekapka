"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { PredictionInput } from "./prediction-input";
import { PredictionList } from "./prediction-list";
import type { SerializedPrediction } from "@/types/serialized";

interface PredictionSectionProps {
  retroId: string;
  predictions: SerializedPrediction[];
  unresolvedFromPast: SerializedPrediction[];
  currentUserId: string;
  currentUserEmail?: string;
  allUsers: { id: string; name: string }[];
  onPredictionsChange: (predictions: SerializedPrediction[]) => void;
  onUnresolvedChange: (predictions: SerializedPrediction[]) => void;
}

export function PredictionSection({
  retroId,
  predictions,
  unresolvedFromPast,
  currentUserId,
  currentUserEmail,
  allUsers,
  onPredictionsChange,
  onUnresolvedChange,
}: PredictionSectionProps) {
  const t = useTranslations("predictions");
  const [expanded, setExpanded] = useState(unresolvedFromPast.length > 0);

  const openCount = unresolvedFromPast.filter((p) => p.status === "open").length;

  return (
    <div className="border-t pt-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs text-muted-foreground justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-1.5">
          <Lightbulb className="h-3 w-3" aria-hidden="true" />
          {t("title")}
          {openCount > 0 && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              {openCount}
            </Badge>
          )}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </Button>

      {expanded && (
        <div className="mt-3 space-y-4">
          {/* Unresolved from past retros */}
          {unresolvedFromPast.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">{t("unresolved")}</h4>
              <PredictionList
                predictions={unresolvedFromPast}
                currentRetroId={retroId}
                currentUserId={currentUserId}
                currentUserEmail={currentUserEmail}
                onUpdate={(id, status) => {
                  onUnresolvedChange(
                    unresolvedFromPast.map((p) =>
                      p.id === id ? { ...p, status } : p
                    )
                  );
                }}
                onDelete={(id) => {
                  onUnresolvedChange(unresolvedFromPast.filter((p) => p.id !== id));
                }}
              />
            </div>
          )}

          {/* Predictions made in this retro */}
          {predictions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">{t("thisRetro")}</h4>
              <PredictionList
                predictions={predictions}
                currentRetroId={retroId}
                currentUserId={currentUserId}
                currentUserEmail={currentUserEmail}
                onUpdate={(id, status) => {
                  onPredictionsChange(
                    predictions.map((p) =>
                      p.id === id ? { ...p, status } : p
                    )
                  );
                }}
                onDelete={(id) => {
                  onPredictionsChange(predictions.filter((p) => p.id !== id));
                }}
              />
            </div>
          )}

          {/* Add new prediction */}
          <PredictionInput
            retroId={retroId}
            allUsers={allUsers}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
  );
}
