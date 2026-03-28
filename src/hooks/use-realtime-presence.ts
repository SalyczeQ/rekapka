"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface OnlineUser {
  userId: string;
  name: string;
}

export function useRealtimePresence(retroId: string, currentUser: { id: string; name: string }) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel(`presence:${retroId}`, {
      config: { presence: { key: currentUser.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ userId: string; name: string }>();
        const users: OnlineUser[] = [];
        for (const key of Object.keys(state)) {
          const presences = state[key];
          if (presences.length > 0) {
            users.push({
              userId: presences[0].userId,
              name: presences[0].name,
            });
          }
        }
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: currentUser.id,
            name: currentUser.name,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [retroId, currentUser.id, currentUser.name, supabase]);

  return onlineUsers;
}
