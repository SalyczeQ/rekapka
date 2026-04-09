"use client";

import { cn } from "@/lib/utils";
import { advancePhase } from "@/lib/actions/retro-session";
import { vibrate } from "@/lib/haptics";
import { Button } from "@/components/ui/button";
import { ChevronRight, Undo2 } from "lucide-react";
import { RETRO_STATUSES } from "@/types";
import { useTranslations } from "next-intl";

interface PhaseBarProps {
  currentPhase: string;
  retroId: string;
  onPhaseChange: (phase: string) => void;
  currentUserEmail?: string;
}

export function PhaseBar({ currentPhase, retroId, onPhaseChange, currentUserEmail }: PhaseBarProps) {
  const t = useTranslations("phase");
  const currentIndex = RETRO_STATUSES.indexOf(currentPhase as typeof RETRO_STATUSES[number]);
  const nextPhase = RETRO_STATUSES[currentIndex + 1];

  const phaseLabel = (phase: string) => t(phase as "writing" | "discussing" | "completed");

  return (
    <div className="border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-2">
        <nav className="flex items-center gap-1" aria-label="Retro phases">
          {RETRO_STATUSES.map((phase, index) => (
            <div key={phase} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground mx-0.5" aria-hidden="true" />
              )}
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  index < currentIndex && "bg-primary/20 text-primary",
                  index === currentIndex && "bg-primary text-primary-foreground",
                  index > currentIndex && "text-muted-foreground"
                )}
                aria-current={index === currentIndex ? "step" : undefined}
              >
                {phaseLabel(phase)}
              </span>
            </div>
          ))}
        </nav>

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
            <form
              action={async () => {
                await advancePhase(retroId, nextPhase);
                vibrate(80);
                onPhaseChange(nextPhase);
              }}
            >
              <Button type="submit" size="sm">
                {t("next", { phase: phaseLabel(nextPhase) })}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
