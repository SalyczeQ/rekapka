"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, PartyPopper } from "lucide-react";
import { triggerConfetti } from "./confetti";

interface RetroCompletionModalProps {
  retro: {
    location: string | null;
    photo_url: string | null;
    date: string;
  };
  onComplete: () => Promise<void>;
  onCancel: () => void;
}

export function RetroCompletionModal({
  retro,
  onComplete,
  onCancel,
}: RetroCompletionModalProps) {
  const [completing, setCompleting] = useState(false);
  const warnings: string[] = [];

  if (!retro.location) warnings.push("Location is not set");
  if (!retro.photo_url) warnings.push("Photo is not uploaded");

  async function handleComplete() {
    setCompleting(true);
    await onComplete();
    triggerConfetti();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5" />
            Complete retro?
          </DialogTitle>
          <DialogDescription>
            Once completed, the retro will be locked. Undiscussed cards will
            carry over to the next retro.
          </DialogDescription>
        </DialogHeader>

        {warnings.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-1">
            {warnings.map((w) => (
              <div
                key={w}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <AlertTriangle className="h-3 w-3 shrink-0" />
                {w}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={completing}
            className="flex-1"
          >
            {completing ? "Completing..." : "Complete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
