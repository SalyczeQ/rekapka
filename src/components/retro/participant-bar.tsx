"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRealtimePresence } from "@/hooks/use-realtime-presence";

interface ParticipantBarProps {
  retroId: string;
  currentUserId: string;
  currentUserName?: string;
}

export function ParticipantBar({
  retroId,
  currentUserId,
  currentUserName = "You",
}: ParticipantBarProps) {
  const onlineUsers = useRealtimePresence(retroId, {
    id: currentUserId,
    name: currentUserName,
  });

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {onlineUsers.map((user) => {
          const isMe = user.userId === currentUserId;
          return (
            <Tooltip key={user.userId}>
              <TooltipTrigger>
                <div className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full h-2 w-2 border border-background" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {user.name}
                  {isMe ? " (you)" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {onlineUsers.length > 0 && (
          <span className="text-xs text-muted-foreground ml-1">
            {onlineUsers.length} online
          </span>
        )}
      </div>
    </TooltipProvider>
  );
}
