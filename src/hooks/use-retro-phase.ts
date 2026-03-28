"use client";

import { useEffect, useState, useCallback } from "react";

export type RetroPhase = "write" | "vote" | "discuss" | "actions" | "complete";

const PHASE_ORDER: RetroPhase[] = ["write", "vote", "discuss", "actions", "complete"];

export function useRetroPhase(retroId: string, initialPhase: RetroPhase = "write") {
  const [phase, setPhase] = useState<RetroPhase>(initialPhase);

  // Poll for phase changes
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/retros/${retroId}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status) setPhase(data.status as RetroPhase);
      } catch {
        // Silently ignore
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [retroId]);

  const advancePhase = useCallback(async () => {
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      const nextPhase = PHASE_ORDER[currentIndex + 1];
      setPhase(nextPhase);
    }
  }, [phase]);

  return { phase, advancePhase };
}
