"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function RecalculateGuessesButton() {
  const t = useTranslations("settings");
  const [loading, setLoading] = useState(false);

  async function handleRecalculate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/guess-authors", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(t("recalculateSuccess", { count: data.guessed }));
    } catch {
      toast.error(t("recalculateFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleRecalculate} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
      ) : (
        <Bot className="h-4 w-4 mr-2" aria-hidden="true" />
      )}
      {loading ? t("recalculating") : t("recalculate")}
    </Button>
  );
}
