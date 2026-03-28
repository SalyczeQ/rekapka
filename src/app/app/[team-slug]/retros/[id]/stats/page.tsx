"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BarChart3, Download, Loader2 } from "lucide-react";

interface Stats {
  themes: string[];
  sentiment: { positive: number; negative: number; neutral: number };
  wordCloud: { word: string; count: number }[];
  summary: string;
}

export default function RetroStatsPage() {
  const routeParams = useParams();
  const retroId = routeParams.id as string;
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [retroTitle, setRetroTitle] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function loadRetro() {
      const { data } = await supabase
        .from("retros")
        .select("title")
        .eq("id", retroId)
        .single();
      if (data) setRetroTitle(data.title);
    }
    loadRetro();
  }, [retroId, supabase]);

  async function generateStats() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retroId }),
      });
      if (!res.ok) throw new Error("Failed to generate stats");
      const data = await res.json();
      setStats(data);
    } catch {
      toast.error("Failed to generate stats");
    }
    setLoading(false);
  }

  async function exportCsv() {
    window.open(`/api/retros/${retroId}/export`, "_blank");
  }

  const total = stats
    ? stats.sentiment.positive + stats.sentiment.negative + stats.sentiment.neutral
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{retroTitle || "Retro"} Stats</h1>
        <Button size="sm" variant="outline" onClick={exportCsv}>
          <Download className="h-3 w-3 mr-1" />
          CSV
        </Button>
      </div>

      {!stats ? (
        <Card>
          <CardContent className="py-8 text-center">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-3">
              Generate AI-powered insights for this retro.
            </p>
            <Button onClick={generateStats} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Generate stats"
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
                      width: `${(stats.sentiment.positive / total) * 100}%`,
                    }}
                  />
                )}
                {stats.sentiment.neutral > 0 && (
                  <div
                    className="bg-blue-500 rounded-full"
                    style={{
                      width: `${(stats.sentiment.neutral / total) * 100}%`,
                    }}
                  />
                )}
                {stats.sentiment.negative > 0 && (
                  <div
                    className="bg-red-500 rounded-full"
                    style={{
                      width: `${(stats.sentiment.negative / total) * 100}%`,
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
