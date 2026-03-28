"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionItem {
  id: string;
  text: string;
  status: string;
  assignee_id: string | null;
  due_date: string | null;
  retro_id: string;
}

export default function ActionsPage() {
  const routeParams = useParams();
  const teamSlug = routeParams["team-slug"] as string;
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: team } = await supabase
        .from("teams")
        .select("id")
        .eq("slug", teamSlug)
        .single();

      if (!team) return;

      const { data: retros } = await supabase
        .from("retros")
        .select("id")
        .eq("team_id", team.id);

      if (!retros?.length) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("action_items")
        .select("*")
        .in(
          "retro_id",
          retros.map((r) => r.id)
        )
        .order("created_at", { ascending: false });

      setActions(data ?? []);
      setLoading(false);
    }
    load();
  }, [teamSlug, supabase]);

  async function cycleStatus(action: ActionItem) {
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

    setActions((prev) =>
      prev.map((a) => (a.id === action.id ? { ...a, status: nextStatus } : a))
    );
  }

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

  const openActions = actions.filter((a) => a.status !== "done");
  const doneActions = actions.filter((a) => a.status === "done");

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Action Items</h1>

      {actions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No action items yet.
        </p>
      ) : (
        <>
          {openActions.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Open ({openActions.length})
              </h2>
              {openActions.map((action) => (
                <Card key={action.id}>
                  <CardContent className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cycleStatus(action)}
                        className="shrink-0"
                      >
                        {statusIcon(action.status)}
                      </button>
                      <span className="text-sm flex-1">{action.text}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {doneActions.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Done ({doneActions.length})
              </h2>
              {doneActions.map((action) => (
                <Card key={action.id}>
                  <CardContent className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cycleStatus(action)}
                        className="shrink-0"
                      >
                        {statusIcon(action.status)}
                      </button>
                      <span className="text-sm flex-1 line-through text-muted-foreground">
                        {action.text}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
