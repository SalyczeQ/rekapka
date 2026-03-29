"use client";

import { cn } from "@/lib/utils";

const PHASES = [
  { key: "draft", label: "Draft" },
  { key: "writing", label: "Write" },
  { key: "grouping", label: "Group" },
  { key: "voting", label: "Vote" },
  { key: "discussing", label: "Discuss" },
  { key: "actions", label: "Actions" },
  { key: "completed", label: "Done" },
];

interface RetroPhaseBarProps {
  status: string;
}

export function RetroPhaseBar({ status }: RetroPhaseBarProps) {
  const currentIndex = PHASES.findIndex((p) => p.key === status);

  return (
    <div className="sticky top-[49px] z-30 bg-background border-b px-4 py-2">
      <div className="flex items-center gap-1 overflow-x-auto max-w-lg mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PHASES.map((phase, i) => (
          <div key={phase.key} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  "w-4 h-0.5 mx-0.5",
                  i <= currentIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-full whitespace-nowrap transition-colors",
                i === currentIndex
                  ? "bg-primary text-primary-foreground font-medium"
                  : i < currentIndex
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {phase.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
