"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Circle, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionStatus = "open" | "in_progress" | "done";

const STATUS_CYCLE: ActionStatus[] = ["open", "in_progress", "done"];

const STATUS_CONFIG: Record<
  ActionStatus,
  { label: string; icon: typeof Circle; variant: "outline" | "secondary" | "default" }
> = {
  open: { label: "Open", icon: Circle, variant: "outline" },
  in_progress: { label: "In Progress", icon: Loader2, variant: "secondary" },
  done: { label: "Done", icon: CheckCircle2, variant: "default" },
};

interface ActionItemCardProps {
  action: {
    id: string;
    text: string;
    status: ActionStatus;
    due_date: string | null;
    assignee: {
      name: string;
      avatar_url: string | null;
    } | null;
  };
  onStatusChange?: (status: ActionStatus) => void;
}

export function ActionItemCard({ action, onStatusChange }: ActionItemCardProps) {
  const config = STATUS_CONFIG[action.status];
  const StatusIcon = config.icon;

  function cycleStatus() {
    const currentIndex = STATUS_CYCLE.indexOf(action.status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    onStatusChange?.(nextStatus);
  }

  return (
    <Card
      className={cn(
        "transition-all",
        action.status === "done" && "opacity-60"
      )}
    >
      <CardContent className="py-2 px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm whitespace-pre-wrap break-words",
                action.status === "done" && "line-through"
              )}
            >
              {action.text}
            </p>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {action.assignee && (
                <div className="flex items-center gap-1">
                  <Avatar size="sm">
                    {action.assignee.avatar_url && (
                      <AvatarImage src={action.assignee.avatar_url} />
                    )}
                    <AvatarFallback>
                      {action.assignee.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {action.assignee.name}
                  </span>
                </div>
              )}

              {action.due_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(action.due_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0"
            onClick={cycleStatus}
          >
            <Badge variant={config.variant} className="gap-1">
              <StatusIcon
                className={cn(
                  "h-3 w-3",
                  action.status === "in_progress" && "animate-spin"
                )}
              />
              {config.label}
            </Badge>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
