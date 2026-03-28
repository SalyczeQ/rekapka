"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type RetroPhase = "write" | "vote" | "discuss" | "actions" | "complete";

const PHASE_ORDER: RetroPhase[] = ["write", "vote", "discuss", "actions", "complete"];

export function useRetroPhase(retroId: string, initialPhase: RetroPhase = "write") {
  const [phase, setPhase] = useState<RetroPhase>(initialPhase);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`phase:${retroId}`)
      .on("broadcast", { event: "phase_change" }, ({ payload }) => {
        setPhase(payload.phase as RetroPhase);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [retroId, supabase]);

  const advancePhase = useCallback(async () => {
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      const nextPhase = PHASE_ORDER[currentIndex + 1];
      setPhase(nextPhase);

      const channel = supabase.channel(`phase:${retroId}`);
      await channel.send({
        type: "broadcast",
        event: "phase_change",
        payload: { phase: nextPhase },
      });
    }
  }, [phase, retroId, supabase]);

  return { phase, advancePhase };
}
