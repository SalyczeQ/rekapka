"use client";

import { useState, useTransition } from "react";
import { advancePhase } from "@/lib/actions/retro-session";
import { vibrate } from "@/lib/haptics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Undo2 } from "lucide-react";
import { RETRO_STATUSES } from "@/types";
import { useTranslations } from "next-intl";
import { AiGroupButton } from "./ai-group-button";
import type { SerializedCard } from "@/types/serialized";

interface PhaseBarProps {
  currentPhase: string;
  retroId: string;
  retroTitle?: string;
  onPhaseChange: (phase: string) => void;
  currentUserEmail?: string;
  cards: SerializedCard[];
  onCardsChange: (cards: SerializedCard[]) => void;
}

export function PhaseBar({ currentPhase, retroId, retroTitle, onPhaseChange, currentUserEmail, cards, onCardsChange }: PhaseBarProps) {
  const t = useTranslations("phase");
  const currentIndex = RETRO_STATUSES.indexOf(currentPhase as typeof RETRO_STATUSES[number]);
  const nextPhase = RETRO_STATUSES[currentIndex + 1];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const phaseLabel = (phase: string) => t(phase as "writing" | "discussing" | "completed");

  const handleConfirm = () => {
    if (!nextPhase) return;
    startTransition(async () => {
      await advancePhase(retroId, nextPhase);
      vibrate(80);
      onPhaseChange(nextPhase);
      setConfirmOpen(false);
    });
  };

  const confirmDescription =
    nextPhase === "discussing"
      ? t("confirmDiscussing")
      : nextPhase === "completed"
      ? t("confirmCompleted")
      : "";

  return (
    <div className="border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 min-w-0">
          {currentPhase === "writing" && (
            <AiGroupButton retroId={retroId} cards={cards} onCardsChange={onCardsChange} />
          )}
        </div>

        {retroTitle && (
          <h1 className="hidden md:block flex-1 min-w-0 px-3 text-sm font-semibold truncate text-center">
            {retroTitle}
          </h1>
        )}

        <div className="flex items-center gap-2">
          {currentPhase === "discussing" && currentUserEmail === "salay14@gmail.com" && (
            <form
              action={async () => {
                await advancePhase(retroId, "writing");
                vibrate(80);
                onPhaseChange("writing");
              }}
            >
              <Button type="submit" size="sm" variant="outline" aria-label={phaseLabel("writing")}>
                <Undo2 className="h-3.5 w-3.5 md:mr-1.5" aria-hidden="true" />
                <span className="hidden md:inline">{phaseLabel("writing")}</span>
              </Button>
            </form>
          )}
          {nextPhase && (
            <Button type="button" size="sm" onClick={() => setConfirmOpen(true)}>
              {t("next", { phase: phaseLabel(nextPhase) })}
            </Button>
          )}
        </div>
      </div>

      {nextPhase && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirmTitle", { phase: phaseLabel(nextPhase) })}</DialogTitle>
              <DialogDescription>{confirmDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmOpen(false)}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button type="button" size="sm" onClick={handleConfirm} disabled={isPending}>
                {t("confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
