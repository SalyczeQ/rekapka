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
import { Plus, Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ActionItem {
  id: string;
  text: string;
  assignee_id: string | null;
  due_date: string | null;
  status: string;
}

interface PhaseActionsProps {
  retroId: string;
  currentUserId: string;
}

export function PhaseActions({ retroId, currentUserId }: PhaseActionsProps) {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const result = await getActionItemsAction(retroId);
    if (result?.items) setActions(result.items);
  }, [retroId]);

  useEffect(() => {
    load();
    // Poll for updates from other participants
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [load]);

  const addAction = useCallback(async () => {
    if (!newText.trim()) return;
    setSubmitting(true);
    const result = await addActionItemAction(retroId, newText.trim(), currentUserId);
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
    setSubmitting(false);
  }, [newText, retroId, currentUserId]);

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
                <span
                  className={cn(
                    "text-sm flex-1",
                    action.status === "done" && "line-through text-muted-foreground"
                  )}
                >
                  {action.text}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
}
