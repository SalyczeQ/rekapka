"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface TimerState {
  remaining: number;
  isRunning: boolean;
  start: (seconds?: number) => void;
  pause: () => void;
  reset: () => void;
}

// Local-only timer. Multi-client sync will be added when a WebSocket/SSE layer is introduced.
export function useTimer(retroId: string, initialSeconds = 300): TimerState {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining]);

  const start = useCallback(
    (seconds?: number) => {
      const r = seconds ?? remaining;
      setRemaining(r);
      setIsRunning(true);
    },
    [remaining]
  );

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRemaining(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { remaining, isRunning, start, pause, reset };
}
