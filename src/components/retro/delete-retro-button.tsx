"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRetroAction } from "@/lib/actions/retro";
import { toast } from "sonner";

interface DeleteRetroButtonProps {
  retroId: string;
  teamSlug: string;
  variant?: "icon" | "full";
}

export function DeleteRetroButton({ retroId, teamSlug, variant = "icon" }: DeleteRetroButtonProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this retro? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteRetroAction(retroId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Retro deleted");
        router.push(`/app/${teamSlug}/retros`);
        router.refresh();
      }
    });
  }

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={pending}
        className="text-destructive border-destructive/30 hover:bg-destructive/10"
      >
        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
        {pending ? "Deleting…" : "Delete retro"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      title="Delete retro"
      className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
