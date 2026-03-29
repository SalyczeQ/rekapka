"use client";

import { useState, useEffect, useRef } from "react";

interface OnlineUser {
  userId: string;
  name: string;
}

const HEARTBEAT_INTERVAL = 15_000; // 15s
const POLL_INTERVAL = 10_000;      // 10s

export function useRealtimePresence(
  retroId: string,
  currentUser: { id: string; name: string }
) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([
    { userId: currentUser.id, name: currentUser.name },
  ]);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const heartbeat = () => {
      fetch(`/api/retros/${retroId}/presence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: currentUser.name }),
      }).catch(() => {});
    };

    const poll = () => {
      fetch(`/api/retros/${retroId}/presence`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.online)) {
            setOnlineUsers(data.online);
          }
        })
        .catch(() => {});
    };

    // Immediate heartbeat + poll on mount
    heartbeat();
    poll();

    heartbeatRef.current = setInterval(heartbeat, HEARTBEAT_INTERVAL);
    pollRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      clearInterval(heartbeatRef.current!);
      clearInterval(pollRef.current!);
      // Signal leave
      fetch(`/api/retros/${retroId}/presence`, { method: "DELETE" }).catch(() => {});
    };
  }, [retroId, currentUser.id, currentUser.name]);

  return onlineUsers;
}
