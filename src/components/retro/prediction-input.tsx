"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { createPrediction } from "@/lib/actions/predictions";
import { toast } from "sonner";
import { vibrate } from "@/lib/haptics";

interface PredictionInputProps {
  retroId: string;
  allUsers: { id: string; name: string }[];
  currentUserId: string;
}

export function PredictionInput({ retroId, allUsers, currentUserId }: PredictionInputProps) {
  const t = useTranslations("predictions");
  const [text, setText] = useState("");
  const [stake, setStake] = useState("");
  const [deadline, setDeadline] = useState("");
  const [challengedUserId, setChallengedUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("retroId", retroId);
      fd.set("text", text.trim());
      if (stake.trim()) fd.set("stake", stake.trim());
      if (deadline) fd.set("deadline", deadline);
      if (challengedUserId) fd.set("challengedUserId", challengedUserId);
      await createPrediction(fd);
      vibrate(30);
      setText("");
      setStake("");
      setDeadline("");
      setChallengedUserId("");
    } catch {
      toast.error(t("failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const otherUsers = allUsers.filter((u) => u.id !== currentUserId);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={t("predictionPlaceholder")}
        className="w-full text-sm bg-transparent border border-input rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
        autoComplete="off"
      />
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          placeholder={t("stakePlaceholder")}
          className="flex-1 min-w-0 text-sm bg-transparent border border-input rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
          autoComplete="off"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="text-sm bg-transparent border border-input rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={t("deadline")}
        />
        <select
          value={challengedUserId}
          onChange={(e) => setChallengedUserId(e.target.value)}
          className="text-sm bg-transparent border border-input rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t("challenge")}…</option>
          {otherUsers.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <Button
          size="icon"
          className="shrink-0 h-8 w-8"
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          aria-label={t("addPrediction")}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
