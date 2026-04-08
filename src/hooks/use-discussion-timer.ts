"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SSEEvent } from "@/types/realtime";

interface UseDiscussionTimerOptions {
  /** Current card being discussed (null = no active discussion) */
  currentCardId: string | null;
  /** When the current card's discussion started (ISO string) */
  discussionStartedAt: string | null;
  /** When the retro's writing phase started (ISO string) */
  retroStartedAt: string | null;
}

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Local count-up timer for discussion phase.
 * Derives elapsed time from timestamps (no server sync needed).
 * Resets when currentCardId or discussionStartedAt changes.
 */
export function useDiscussionTimer({
  currentCardId,
  discussionStartedAt,
  retroStartedAt,
}: UseDiscussionTimerOptions) {
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tick every second to trigger re-render
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const now = Date.now();

  const cardElapsed =
    currentCardId && discussionStartedAt
      ? Math.floor((now - new Date(discussionStartedAt).getTime()) / 1000)
      : 0;

  const totalElapsed = retroStartedAt
    ? Math.floor((now - new Date(retroStartedAt).getTime()) / 1000)
    : 0;

  return {
    cardElapsed,
    totalElapsed,
    discussionActive: currentCardId !== null,
    formatTime,
  };
}
