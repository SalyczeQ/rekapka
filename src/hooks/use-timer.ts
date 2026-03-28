"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface TimerState {
  remaining: number;
  isRunning: boolean;
  start: (seconds?: number) => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer(retroId: string, initialSeconds = 300): TimerState {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const channel = supabase.channel(`timer:${retroId}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "timer_sync" }, ({ payload }) => {
        setRemaining(payload.remaining);
        setIsRunning(payload.isRunning);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [retroId, supabase]);

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

  const broadcast = useCallback(
    (r: number, running: boolean) => {
      channelRef.current?.send({
        type: "broadcast",
        event: "timer_sync",
        payload: { remaining: r, isRunning: running },
      });
    },
    []
  );

  const start = useCallback(
    (seconds?: number) => {
      const r = seconds ?? remaining;
      setRemaining(r);
      setIsRunning(true);
      broadcast(r, true);
    },
    [remaining, broadcast]
  );

  const pause = useCallback(() => {
    setIsRunning(false);
    broadcast(remaining, false);
  }, [remaining, broadcast]);

  const reset = useCallback(() => {
    setRemaining(initialSeconds);
    setIsRunning(false);
    broadcast(initialSeconds, false);
  }, [initialSeconds, broadcast]);

  return { remaining, isRunning, start, pause, reset };
}
