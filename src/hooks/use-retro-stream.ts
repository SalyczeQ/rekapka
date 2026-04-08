"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { SSEEvent, SSEPresenceUser } from "@/types/realtime";

type SSEEventHandler = (event: SSEEvent) => void;

interface UseRetroStreamOptions {
  retroId: string;
  onEvent?: SSEEventHandler;
}

/**
 * Connects to the SSE endpoint for a retro and dispatches events.
 * Browser-native EventSource handles auto-reconnect.
 * Also tracks presence from SSE events.
 */
export function useRetroStream({ retroId, onEvent }: UseRetroStreamOptions) {
  const [connected, setConnected] = useState(false);
  const [presence, setPresence] = useState<SSEPresenceUser[]>([]);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    const es = new EventSource(`/api/retros/${retroId}/stream`);

    es.onopen = () => {
      setConnected(true);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { type: string };

        // Handle initial connected event with presence
        if (data.type === "connected") {
          const connected = data as { type: string; users?: SSEPresenceUser[] };
          if (connected.users) {
            setPresence(connected.users);
          }
          return;
        }

        // Handle presence updates
        if (data.type === "presence") {
          const presenceEvent = data as { type: string; users: SSEPresenceUser[] };
          setPresence(presenceEvent.users);
        }

        onEventRef.current?.(data as SSEEvent);
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setConnected(false);
      // EventSource auto-reconnects
    };

    return () => {
      es.close();
      setConnected(false);
    };
  }, [retroId]);

  return { connected, presence };
}
