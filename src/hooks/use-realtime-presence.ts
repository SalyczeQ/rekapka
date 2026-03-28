"use client";

import { useState } from "react";

interface OnlineUser {
  userId: string;
  name: string;
}

// Simplified presence — returns only the current user.
// Full multi-user presence will be added when a WebSocket/SSE layer is introduced.
export function useRealtimePresence(retroId: string, currentUser: { id: string; name: string }) {
  const [onlineUsers] = useState<OnlineUser[]>([
    { userId: currentUser.id, name: currentUser.name },
  ]);

  return onlineUsers;
}
