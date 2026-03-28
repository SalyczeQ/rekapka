"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
}

export function MemberList({ teamId }: { teamId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("team_members")
        .select("id, role, user_id, users:user_id(id, name, email, avatar_url)")
        .eq("team_id", teamId);

      if (data) {
        setMembers(
          data.map((m) => ({
            id: m.id,
            role: m.role,
            user: m.users as unknown as Member["user"],
          }))
        );
      }
    }
    load();
  }, [teamId, supabase]);

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3 py-1">
          <Avatar className="h-7 w-7">
            <AvatarImage src={member.user.avatar_url ?? undefined} />
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
