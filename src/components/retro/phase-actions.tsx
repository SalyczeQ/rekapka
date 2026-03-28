"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("action_items")
        .select("*")
        .eq("retro_id", retroId)
        .order("created_at");
      if (data) setActions(data);
    }
    load();
  }, [retroId, supabase]);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`actions-${retroId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "action_items",
          filter: `retro_id=eq.${retroId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setActions((prev) => [...prev, payload.new as ActionItem]);
          } else if (payload.eventType === "UPDATE") {
            setActions((prev) =>
              prev.map((a) =>
                a.id === (payload.new as ActionItem).id
                  ? (payload.new as ActionItem)
                  : a
              )
            );
          } else if (payload.eventType === "DELETE") {
            setActions((prev) =>
              prev.filter(
                (a) => a.id !== (payload.old as { id: string }).id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [retroId, supabase]);

  const addAction = useCallback(async () => {
    if (!newText.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("action_items").insert({
      retro_id: retroId,
      text: newText.trim(),
      assignee_id: currentUserId,
    });
    if (error) toast.error("Failed to add action item");
    setNewText("");
    setSubmitting(false);
  }, [newText, retroId, currentUserId, supabase]);

  const cycleStatus = useCallback(
    async (action: ActionItem) => {
      const nextStatus =
        action.status === "open"
          ? "in_progress"
          : action.status === "in_progress"
          ? "done"
          : "open";
      await supabase
        .from("action_items")
        .update({ status: nextStatus })
        .eq("id", action.id);
    },
    [supabase]
  );

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
