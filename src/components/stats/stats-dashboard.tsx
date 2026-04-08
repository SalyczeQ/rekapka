"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MessageSquare,
  User,
  FileText,
  BarChart3,
  TrendingUp,
  SkipForward,
  CheckCircle2,
  Timer,
} from "lucide-react";
import type { RetroStats } from "@/lib/ai/generate-stats";

interface StatsDashboardProps {
  retroId: string;
  retroTitle: string;
}

export function StatsDashboard({ retroId, retroTitle }: StatsDashboardProps) {
  const [stats, setStats] = useState<RetroStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/ai/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ retroId }),
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [retroId]);

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m < 60) return `${m}m ${s}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{retroTitle} — Stats</h1>
        <p className="text-muted-foreground">Generating stats…</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{retroTitle} — Stats</h1>
        <p className="text-muted-foreground">No stats available.</p>
      </div>
    );
  }

  const totalDiscussionTime = stats.avgDiscussionSec * stats.discussedCards;
  const writingTime = stats.totalDurationSec > 0
    ? Math.max(0, stats.totalDurationSec - totalDiscussionTime)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{retroTitle} — Stats</h1>

      {/* AI Summary */}
      {stats.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{stats.summary}</p>
            {stats.themes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {stats.themes.map((theme) => (
                  <Badge key={theme} variant="secondary">
                    {theme}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold tabular-nums">
                  {formatDuration(stats.totalDurationSec)}
                </p>
                <p className="text-sm text-muted-foreground">Total Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold tabular-nums">
                  {stats.discussedCards}/{stats.totalCards}
                </p>
                <p className="text-sm text-muted-foreground">Cards Discussed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {stats.skippedCards > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <SkipForward className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stats.skippedCards}</p>
                  <p className="text-sm text-muted-foreground">Skipped</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stats.actionItemCount > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stats.actionItemCount}</p>
                  <p className="text-sm text-muted-foreground">Action Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stats.avgCardWords > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stats.avgCardWords}</p>
                  <p className="text-sm text-muted-foreground">Avg Words/Card</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Time breakdown */}
      {stats.totalDurationSec > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" aria-hidden="true" />
              Time Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Writing</span>
              <span className="tabular-nums font-medium">{formatDuration(writingTime)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discussing</span>
              <span className="tabular-nums font-medium">{formatDuration(totalDiscussionTime)}</span>
            </div>
            {stats.avgDiscussionSec > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Avg per card</span>
                <span className="tabular-nums">{formatDuration(stats.avgDiscussionSec)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Discussion distribution */}
      {stats.discussionDistribution && (() => {
        const d = stats.discussionDistribution;
        const total = d.under1 + d.oneToThree + d.threeToFive + d.overFive;
        if (total === 0) return null;
        const max = Math.max(d.under1, d.oneToThree, d.threeToFive, d.overFive);
        const bars = [
          { label: "<1m", value: d.under1, color: "bg-green-500" },
          { label: "1-3m", value: d.oneToThree, color: "bg-blue-500" },
          { label: "3-5m", value: d.threeToFive, color: "bg-amber-500" },
          { label: "5m+", value: d.overFive, color: "bg-red-500" },
        ];
        return (
          <Card>
            <CardHeader>
              <CardTitle>Discussion Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 h-36">
                {bars.map((bar) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-sm font-semibold tabular-nums">{bar.value}</span>
                    <div
                      className={`w-full rounded-t-sm ${bar.color} transition-all duration-500 ease-out`}
                      style={{
                        height: max > 0 ? `${Math.max((bar.value / max) * 100, bar.value > 0 ? 8 : 0)}%` : "0%",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{bar.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* People stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.mostCardsByUser && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.mostCardsByUser.count}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Most cards by {stats.mostCardsByUser.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stats.mostVerboseUser && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.mostVerboseUser.totalChars}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Chars by {stats.mostVerboseUser.name} (most verbose)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stats.longestDiscussedCard && stats.longestDiscussedCard.durationSec > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {stats.longestDiscussedCard.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Longest discussed ({formatDuration(stats.longestDiscussedCard.durationSec)}) by{" "}
                    {stats.longestDiscussedCard.authorName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stats.mostDiscussedCategory && stats.mostDiscussedCategory.totalDurationSec > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.mostDiscussedCategory.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Most discussed category (
                    {formatDuration(stats.mostDiscussedCategory.totalDurationSec)})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cards by category */}
      {stats.cardsByCategory && stats.cardsByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cards by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {stats.cardsByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="text-sm">{cat.name}</span>
                  <Badge variant="secondary" className="tabular-nums">{cat.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sentiment */}
      {(stats.sentiment.positive > 0 || stats.sentiment.negative > 0 || stats.sentiment.neutral > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex h-4 rounded-full overflow-hidden">
              {stats.sentiment.positive > 0 && (
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${stats.sentiment.positive}%` }}
                />
              )}
              {stats.sentiment.neutral > 0 && (
                <div
                  className="bg-gray-400 transition-all"
                  style={{ width: `${stats.sentiment.neutral}%` }}
                />
              )}
              {stats.sentiment.negative > 0 && (
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${stats.sentiment.negative}%` }}
                />
              )}
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-green-500">
                Positive: {stats.sentiment.positive}%
              </span>
              <span className="text-gray-500">
                Neutral: {stats.sentiment.neutral}%
              </span>
              <span className="text-red-500">
                Negative: {stats.sentiment.negative}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
