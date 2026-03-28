"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParticipantBarProps {
  retroId: string;
  currentUserId: string;
}

interface Participant {
  userId: string;
  name: string;
  cardCount: number;
}

export function ParticipantBar({
  retroId,
  currentUserId,
}: ParticipantBarProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`presence-${retroId}`)
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{
          userId: string;
          name: string;
          cardCount: number;
        }>();
        const people: Participant[] = [];
        for (const presences of Object.values(state)) {
          if (presences[0]) {
            people.push({
              userId: presences[0].userId,
              name: presences[0].name,
              cardCount: presences[0].cardCount,
            });
          }
        }
        setParticipants(people);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const { data: profile } = await supabase
            .from("users")
            .select("name")
            .eq("id", currentUserId)
            .single();

          await channel.track({
            userId: currentUserId,
            name: profile?.name ?? "Anonymous",
            cardCount: 0,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [retroId, currentUserId, supabase]);

  if (participants.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {participants.map((p) => (
          <Tooltip key={p.userId}>
            <TooltipTrigger>
              <div className="relative">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px]">
                    {p.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full h-2 w-2 border border-background" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {p.name}
                {p.userId === currentUserId && " (you)"}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          {participants.length} online
        </span>
      </div>
    </TooltipProvider>
  );
}
