"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export function MemberList({ teamId }: { teamId: string }) {
  const [members, setMembers] = useState<Member[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/teams/${teamId}/members`);
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members ?? []);
    }
  }, [teamId]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3 py-1">
          <Avatar className="h-7 w-7">
            <AvatarImage src={member.user.image ?? undefined} />
            <AvatarFallback className="text-xs">
              {member.user.name?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{member.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {member.user.email}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs capitalize">
            {member.role}
          </Badge>
        </div>
      ))}
    </div>
  );
}
