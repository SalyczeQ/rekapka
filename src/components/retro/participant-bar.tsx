"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Participant {
  id: string;
  name: string;
  color: string;
  image: string | null;
  online?: boolean;
}

interface ParticipantBarProps {
  participants: Participant[];
}

export function ParticipantBar({ participants }: ParticipantBarProps) {
  if (participants.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      {participants.map((p) => (
        <div key={p.id} className="relative" title={`${p.name}${p.online ? " (online)" : ""}`}>
          <Avatar className="h-6 w-6 md:h-7 md:w-7 border-2" style={{ borderColor: p.color }}>
            {p.image && <AvatarImage src={p.image} alt={p.name} />}
            <AvatarFallback
              className="text-[10px] text-white"
              style={{ backgroundColor: p.color }}
            >
              {p.name?.charAt(0)?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          {p.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
      ))}
    </div>
  );
}
