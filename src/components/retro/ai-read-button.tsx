"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, X, RefreshCw } from "lucide-react";

interface AIReadResult {
  summary: string;
  themes: string[];
  mood: string;
  focusPoints: string[];
}

interface AiReadButtonProps {
  retroId: string;
  cardCount: number;
}

export function AiReadButton({ retroId, cardCount }: AiReadButtonProps) {
  const t = useTranslations("aiRead");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIReadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRead() {
    if (cardCount === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/read-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retroId }),
      });

      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError(t("failed"));
    } finally {
      setIsLoading(false);
    }
  }

  if (cardCount === 0) return null;

  const moodColor = result?.mood === "positive"
    ? "text-green-500"
    : result?.mood === "concerned"
      ? "text-red-500"
      : "text-amber-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant={result ? "outline" : "secondary"}
          size="sm"
          onClick={handleRead}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" aria-hidden="true" />
              {t("reading")}
            </>
          ) : result ? (
            <>
              <RefreshCw className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {t("reread")}
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {t("readCards")}
            </>
          )}
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>

      {result && (
        <Card className="relative">
          <button
            type="button"
            onClick={() => setResult(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label={t("dismiss")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <CardContent className="pt-4 pb-3 space-y-3">
            {/* Mood badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={moodColor}>
                {t(`mood.${result.mood}`)}
              </Badge>
            </div>

            {/* Summary */}
            <p className="text-sm">{result.summary}</p>

            {/* Themes */}
            {result.themes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {result.themes.map((theme) => (
                  <Badge key={theme} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            )}

            {/* Focus points */}
            {result.focusPoints.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t("focusPoints")}</p>
                <ul className="space-y-1 text-sm">
                  {result.focusPoints.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary shrink-0">→</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
