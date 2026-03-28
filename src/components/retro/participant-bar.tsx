"use client";

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
  currentUserName?: string;
}

// Simplified participant bar — shows current user as online.
// Full multi-user presence will be added when a WebSocket/SSE layer is introduced.
export function ParticipantBar({
  currentUserName,
}: ParticipantBarProps) {
  const name = currentUserName ?? "You";

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        <Tooltip>
          <TooltipTrigger>
            <div className="relative">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px]">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full h-2 w-2 border border-background" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{name} (you)</p>
          </TooltipContent>
        </Tooltip>
        <span className="text-xs text-muted-foreground ml-1">online</span>
      </div>
    </TooltipProvider>
  );
}
