"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BarChart3,
  Download,
  Loader2,
  RefreshCw,
  MapPin,
  Calendar,
  CheckSquare,
  MessageSquare,
  ThumbsUp,
  X,
} from "lucide-react";

interface AiStats {
  themes: string[];
  sentiment: { positive: number; negative: number; neutral: number };
  wordCloud: { word: string; count: number }[];
  summary: string;
}

interface ActionItem {
  id: string;
  text: string;
  status: string;
  dueDate: string | null;
  assigneeName: string | null;
}

export function StatsClient({
  retroId,
  retroTitle,
  retroDate,
  retroLocation,
  retroPhotoUrl,
  totalCards,
  discussedCards,
  totalVotes,
  actionItems,
  initialStats = null,
}: {
  retroId: string;
  retroTitle: string;
  retroDate: string;
  retroLocation: string | null;
  retroPhotoUrl: string | null;
  totalCards: number;
  discussedCards: number;
  totalVotes: number;
  actionItems: ActionItem[];
  initialStats?: AiStats | null;
}) {
  const [stats, setStats] = useState<AiStats | null>(initialStats);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  async function generateStats() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retro_id: retroId }),
      });
      if (!res.ok) throw new Error("Failed to generate stats");
      const data = await res.json();
      setStats(data.stats);
    } catch {
      toast.error("Failed to generate stats");
    }
    setLoading(false);
  }

  const openActions = actionItems.filter((a) => a.status === "open");
  const inProgressActions = actionItems.filter((a) => a.status === "in_progress");
  const doneActions = actionItems.filter((a) => a.status === "done");

  const aiTotal = stats
    ? stats.sentiment.positive + stats.sentiment.negative + stats.sentiment.neutral
    : 0;

  const statusLabel: Record<string, string> = {
    open: "Open",
    in_progress: "In progress",
    done: "Done",
  };
  const statusColor: Record<string, string> = {
    open: "bg-muted text-muted-foreground",
    in_progress: "bg-primary/10 text-primary",
    done: "bg-green-500/10 text-green-600 dark:text-green-400",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{retroTitle}</h1>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(`/api/retros/${retroId}/export`, "_blank")}
        >
          <Download className="h-3 w-3 mr-1" />
          CSV
        </Button>
      </div>

      {/* Retro metadata */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {retroDate}
        </span>
        {retroLocation && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {retroLocation}
          </span>
        )}
      </div>

      {/* Photo */}
      {retroPhotoUrl && (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={retroPhotoUrl}
            alt="Retro photo"
            className="w-full max-h-56 object-cover rounded-lg border border-border cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
          <p className="text-xs text-muted-foreground mt-1">Tap to enlarge</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && retroPhotoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={retroPhotoUrl}
            alt="Retro photo"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="py-3 px-3 flex flex-col items-center gap-1">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-xl font-semibold">{totalCards}</span>
            <span className="text-xs text-muted-foreground">Cards</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-3 flex flex-col items-center gap-1">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-xl font-semibold">
              {discussedCards}
              <span className="text-sm font-normal text-muted-foreground">
                /{totalCards}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">Discussed</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-3 flex flex-col items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xl font-semibold">{totalVotes}</span>
            <span className="text-xs text-muted-foreground">Votes cast</span>
          </CardContent>
        </Card>
      </div>

      {/* Discussion progress bar */}
      {totalCards > 0 && (
        <Card>
          <CardContent className="py-3 px-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Discussion progress</span>
              <span>
                {discussedCards}/{totalCards} (
                {Math.round((discussedCards / totalCards) * 100)}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${(discussedCards / totalCards) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action items */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Action Items</span>
              <span className="text-xs font-normal text-muted-foreground">
                {doneActions.length}/{actionItems.length} done
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-2">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 py-2 border-b border-border last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      item.status === "done"
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {item.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {item.assigneeName && (
                      <span className="text-xs text-muted-foreground">
                        → {item.assigneeName}
                      </span>
                    )}
                    {item.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        Due {item.dueDate}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    statusColor[item.status] ?? statusColor.open
                  }`}
                >
                  {statusLabel[item.status] ?? item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Stats section */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          AI Insights
        </h2>
        {stats && (
          <Button
            size="sm"
            variant="ghost"
            onClick={generateStats}
            disabled={loading}
            title="Regenerate AI stats"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {!stats ? (
        <Card>
          <CardContent className="py-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              Generate AI-powered insights for this retro.
            </p>
            <Button size="sm" onClick={generateStats} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Generate AI insights"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-sm">{stats.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">Key Themes</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-1">
                {stats.themes.map((theme) => (
                  <Badge key={theme} variant="secondary">
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">Sentiment</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex gap-2 h-4 rounded-full overflow-hidden">
                {stats.sentiment.positive > 0 && (
                  <div
                    className="bg-green-500 rounded-full"
                    style={{
                      width: `${(stats.sentiment.positive / aiTotal) * 100}%`,
                    }}
                  />
                )}
                {stats.sentiment.neutral > 0 && (
                  <div
                    className="bg-blue-500 rounded-full"
                    style={{
                      width: `${(stats.sentiment.neutral / aiTotal) * 100}%`,
                    }}
                  />
                )}
                {stats.sentiment.negative > 0 && (
                  <div
                    className="bg-red-500 rounded-full"
                    style={{
                      width: `${(stats.sentiment.negative / aiTotal) * 100}%`,
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Positive: {stats.sentiment.positive}</span>
                <span>Neutral: {stats.sentiment.neutral}</span>
                <span>Negative: {stats.sentiment.negative}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">Word Cloud</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-1">
                {stats.wordCloud.slice(0, 20).map((w) => (
                  <span
                    key={w.word}
                    className="text-foreground"
                    style={{
                      fontSize: `${Math.max(10, Math.min(24, 10 + w.count * 3))}px`,
                    }}
                  >
                    {w.word}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
