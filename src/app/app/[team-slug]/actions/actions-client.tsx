"use client";

import { useState } from "react";
import { cycleActionStatusAction } from "@/lib/actions/action-items";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Circle, Clock } from "lucide-react";

interface ActionItem {
  id: string;
  text: string;
  status: string;
  assigneeId: string | null;
  dueDate: string | null;
  retroId: string;
}

export function ActionsClient({ actions: initialActions }: { actions: ActionItem[] }) {
  const [actions, setActions] = useState(initialActions);

  async function cycleStatus(action: ActionItem) {
    const result = await cycleActionStatusAction(action.id, action.status);
    if (result?.status) {
      setActions((prev) =>
        prev.map((a) =>
          a.id === action.id ? { ...a, status: result.status! } : a
        )
      );
    }
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
