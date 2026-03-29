"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addActionItemAction,
  getActionItemsAction,
} from "@/lib/actions/retro-session";
import { cycleActionStatusAction } from "@/lib/actions/action-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Check, Circle, Clock, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ActionItem {
  id: string;
  text: string;
  assignee_id: string | null;
  due_date: string | null;
  status: string;
}

interface TeamMember {
  userId: string;
  name: string;
}

interface PhaseActionsProps {
  retroId: string;
  currentUserId: string;
  teamId?: string;
}

export function PhaseActions({ retroId, currentUserId, teamId }: PhaseActionsProps) {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [newText, setNewText] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Fetch team members for assignee dropdown
  useEffect(() => {
    if (!teamId) return;
    fetch(`/api/teams/${teamId}/members`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.members) {
          setMembers(
            data.members.map((m: { user: { id: string; name: string } }) => ({
              userId: m.user.id,
              name: m.user.name,
            }))
          );
        }
      })
      .catch(() => {});
  }, [teamId]);

  const load = useCallback(async () => {
    const result = await getActionItemsAction(retroId);
    if (result?.items) setActions(result.items);
  }, [retroId]);

  useEffect(() => {
    // Initial fetch via timer + poll for updates from other participants
    const timer = setTimeout(load, 0);
    const interval = setInterval(load, 3000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [load]);

  const addAction = useCallback(async () => {
    if (!newText.trim()) return;
    setSubmitting(true);
    const result = await addActionItemAction(
      retroId,
      newText.trim(),
      assigneeId || currentUserId,
      dueDate || null
    );
    if (result?.error) {
      toast.error("Failed to add action item");
    } else if (result?.item) {
      setActions((prev) => [
        ...prev,
        {
          id: result.item.id,
          text: result.item.text,
          assignee_id: result.item.assigneeId,
          due_date: result.item.dueDate,
          status: result.item.status,
        },
      ]);
    }
    setNewText("");
    setAssigneeId("");
    setDueDate("");
    setSubmitting(false);
  }, [newText, retroId, currentUserId, assigneeId, dueDate]);

  const cycleStatus = useCallback(async (action: ActionItem) => {
    const result = await cycleActionStatusAction(action.id, action.status);
    if (result?.status) {
      setActions((prev) =>
        prev.map((a) =>
          a.id === action.id ? { ...a, status: result.status! } : a
        )
      );
    }
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <Check className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMemberName = (id: string | null) =>
    members.find((m) => m.userId === id)?.name;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium">Action items</h2>

      <div className="space-y-2">
        {actions.map((action) => (
          <Card key={action.id}>
            <CardContent className="py-2 px-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cycleStatus(action)}
                  className="shrink-0"
                >
                  {statusIcon(action.status)}
                </button>
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "text-sm",
                      action.status === "done" && "line-through text-muted-foreground"
                    )}
                  >
                    {action.text}
                  </span>
                  {(action.assignee_id || action.due_date) && (
                    <div className="flex items-center gap-3 mt-0.5">
                      {action.assignee_id && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {getMemberName(action.assignee_id) ?? "Assigned"}
                        </span>
                      )}
                      {action.due_date && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(action.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add action item..."
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAction();
              }
            }}
          />
          <Button
            size="icon"
            onClick={addAction}
            disabled={!newText.trim() || submitting}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {newText.trim() && members.length > 0 && (
          <div className="flex gap-2 items-center">
            <Select value={assigneeId} onValueChange={(v) => setAssigneeId(v ?? "")}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Assignee (optional)" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-[160px] h-8 text-xs"
              placeholder="Due date"
            />
          </div>
        )}
      </div>
    </div>
  );
}
