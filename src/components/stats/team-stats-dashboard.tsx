"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { formatTimeAgo, type Locale } from "@/lib/time-ago";
import { ANONYMOUS_ID } from "@/lib/anonymous";
import {
  Clock,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Tag,
  BarChart3,
  Loader2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface RetroData {
  id: string;
  title: string;
  date: string;
  startedAt: string | null;
  completedAt: string | null;
  totalDurationSec: number | null;
}

interface CardData {
  id: string;
  retroId: string;
  categoryId: string;
  authorId: string;
  text: string;
  isDiscussed: boolean;
  isSkipped: boolean;
  discussionDurationSec: number | null;
  categoryName: string;
  authorName: string;
}

interface ActionItemData {
  id: string;
  retroId: string;
  status: string;
  assigneeId: string | null;
}

interface UserData {
  id: string;
  name: string;
  color: string;
  lastSeenAt?: string | null;
}

interface TagData {
  name: string;
  usageCount: number;
}

type TimeRange = "last5" | "3months" | "6months" | "all";

interface AIAnalysis {
  recurringThemes: string[];
  sentimentTrend: string;
  unresolvedPatterns: string[];
  recommendations: string[];
  summary: string;
}

interface TeamStatsDashboardProps {
  retros: RetroData[];
  cards: CardData[];
  actionItems: ActionItemData[];
  users: UserData[];
  topTags: TagData[];
}

export function TeamStatsDashboard({
  retros,
  cards,
  actionItems,
  users,
  topTags,
}: TeamStatsDashboardProps) {
  const t = useTranslations("teamStats");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Filter retros by time range
  const filteredRetros = useMemo(() => {
    const now = new Date();
    return retros.filter((r) => {
      const date = new Date(r.date);
      switch (timeRange) {
        case "last5":
          return retros.indexOf(r) < 5;
        case "3months": {
          const cutoff = new Date(now);
          cutoff.setMonth(cutoff.getMonth() - 3);
          return date >= cutoff;
        }
        case "6months": {
          const cutoff = new Date(now);
          cutoff.setMonth(cutoff.getMonth() - 6);
          return date >= cutoff;
        }
        case "all":
          return true;
      }
    });
  }, [retros, timeRange]);

  const filteredRetroIds = new Set(filteredRetros.map((r) => r.id));
  const filteredCards = useMemo(
    () => cards.filter((c) => filteredRetroIds.has(c.retroId)),
    [cards, filteredRetroIds]
  );
  const filteredActions = useMemo(
    () => actionItems.filter((a) => filteredRetroIds.has(a.retroId)),
    [actionItems, filteredRetroIds]
  );

  // Compute stats
  const stats = useMemo(() => {
    const retroCount = filteredRetros.length;
    const totalCards = filteredCards.length;
    const discussed = filteredCards.filter((c) => c.isDiscussed).length;
    const skipped = filteredCards.filter((c) => c.isSkipped).length;

    // Duration
    const durations = filteredRetros
      .map((r) => r.totalDurationSec ?? 0)
      .filter((d) => d > 0);
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    // Discussion times
    const discussionTimes = filteredCards
      .map((c) => c.discussionDurationSec ?? 0)
      .filter((t) => t > 0);
    const avgDiscussion = discussionTimes.length > 0
      ? Math.round(discussionTimes.reduce((a, b) => a + b, 0) / discussionTimes.length)
      : 0;

    // Cards per retro
    const avgCardsPerRetro = retroCount > 0 ? Math.round(totalCards / retroCount) : 0;

    // Cards by category across all retros
    const byCat: Record<string, number> = {};
    filteredCards.forEach((c) => {
      byCat[c.categoryName] = (byCat[c.categoryName] || 0) + 1;
    });

    // Participation: cards per user (exclude the anonymous placeholder)
    const byUser: Record<string, { name: string; color: string; count: number; lastSeenAt: string | null }> = {};
    filteredCards.forEach((c) => {
      if (c.authorId === ANONYMOUS_ID) return;
      if (!byUser[c.authorId]) {
        const user = users.find((u) => u.id === c.authorId);
        byUser[c.authorId] = {
          name: user?.name ?? c.authorName,
          color: user?.color ?? "#888",
          count: 0,
          lastSeenAt: user?.lastSeenAt ?? null,
        };
      }
      byUser[c.authorId].count++;
    });
    const participation = Object.values(byUser).sort((a, b) => b.count - a.count);

    // Action items
    const totalActionItems = filteredActions.length;
    const doneActionItems = filteredActions.filter((a) => a.status === "done").length;
    const completionRate = totalActionItems > 0
      ? Math.round((doneActionItems / totalActionItems) * 100)
      : 0;

    // Trend: compare first half vs second half of retros
    const half = Math.floor(filteredRetros.length / 2);
    const olderRetroIds = new Set(filteredRetros.slice(half).map((r) => r.id));
    const newerRetroIds = new Set(filteredRetros.slice(0, half).map((r) => r.id));
    const olderMad = filteredCards.filter((c) => olderRetroIds.has(c.retroId) && c.categoryName === "Mad").length;
    const newerMad = filteredCards.filter((c) => newerRetroIds.has(c.retroId) && c.categoryName === "Mad").length;
    const olderGlad = filteredCards.filter((c) => olderRetroIds.has(c.retroId) && c.categoryName === "Glad").length;
    const newerGlad = filteredCards.filter((c) => newerRetroIds.has(c.retroId) && c.categoryName === "Glad").length;

    const olderTotal = filteredCards.filter((c) => olderRetroIds.has(c.retroId)).length || 1;
    const newerTotal = filteredCards.filter((c) => newerRetroIds.has(c.retroId)).length || 1;

    const madTrend = (newerMad / newerTotal) - (olderMad / olderTotal);
    const gladTrend = (newerGlad / newerTotal) - (olderGlad / olderTotal);

    // Per-retro card count trend for chart
    const retroTrend = [...filteredRetros].reverse().map((r) => ({
      title: r.title,
      date: r.date,
      total: filteredCards.filter((c) => c.retroId === r.id).length,
      mad: filteredCards.filter((c) => c.retroId === r.id && c.categoryName === "Mad").length,
      sad: filteredCards.filter((c) => c.retroId === r.id && c.categoryName === "Sad").length,
      glad: filteredCards.filter((c) => c.retroId === r.id && c.categoryName === "Glad").length,
    }));

    return {
      retroCount,
      totalCards,
      discussed,
      skipped,
      avgDuration,
      avgDiscussion,
      avgCardsPerRetro,
      byCat,
      participation,
      totalActionItems,
      doneActionItems,
      completionRate,
      madTrend,
      gladTrend,
      retroTrend,
    };
  }, [filteredRetros, filteredCards, filteredActions, users]);

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m < 60) return `${m}m ${s}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  };

  const handleGenerateAI = async () => {
    setLoadingAi(true);
    setAiAnalysis(null);
    try {
      const res = await fetch("/api/ai/team-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retroIds: filteredRetros.map((r) => r.id) }),
      });
      if (res.ok) {
        setAiAnalysis(await res.json());
      }
    } finally {
      setLoadingAi(false);
    }
  };

  const ranges: { key: TimeRange; label: string }[] = [
    { key: "last5", label: t("last5") },
    { key: "3months", label: t("3months") },
    { key: "6months", label: t("6months") },
    { key: "all", label: t("allTime") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <Button
              key={r.key}
              variant={timeRange === r.key ? "default" : "outline"}
              size="sm"
              onClick={() => { setTimeRange(r.key); setAiAnalysis(null); }}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {t("subtitle", { count: stats.retroCount })}
      </p>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{stats.retroCount}</p>
            <p className="text-xs text-muted-foreground">{t("retros")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{stats.totalCards}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <MessageSquare className="h-3 w-3" aria-hidden="true" />
              {t("totalCards")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{formatDuration(stats.avgDuration)}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {t("avgDuration")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{stats.avgCardsPerRetro}</p>
            <p className="text-xs text-muted-foreground">{t("avgCardsPerRetro")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Health trend */}
      {stats.retroCount >= 2 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">{t("healthTrend")}</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {stats.madTrend < -0.05 ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : stats.madTrend > 0.05 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <span className="h-4 w-4 text-center text-muted-foreground">—</span>
              )}
              <span>
                Mad cards: {stats.madTrend < -0.05 ? t("decreasing") : stats.madTrend > 0.05 ? t("increasing") : t("stable")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {stats.gladTrend > 0.05 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : stats.gladTrend < -0.05 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <span className="h-4 w-4 text-center text-muted-foreground">—</span>
              )}
              <span>
                Glad cards: {stats.gladTrend > 0.05 ? t("increasing") : stats.gladTrend < -0.05 ? t("decreasing") : t("stable")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card trend per retro - bar chart */}
      {stats.retroTrend.length >= 2 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">{t("cardTrend")}</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end gap-1.5 h-32">
              {stats.retroTrend.map((r, i) => {
                const max = Math.max(...stats.retroTrend.map((x) => x.total), 1);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end min-w-0">
                    <span className="text-[10px] tabular-nums font-medium">{r.total}</span>
                    <div className="w-full flex flex-col-reverse rounded-t-sm overflow-hidden" style={{ height: `${(r.total / max) * 100}%` }}>
                      <div className="bg-red-400" style={{ flex: r.mad }} />
                      <div className="bg-blue-400" style={{ flex: r.sad }} />
                      <div className="bg-green-400" style={{ flex: r.glad }} />
                    </div>
                    <span className="text-[9px] text-muted-foreground truncate w-full text-center" title={r.title}>
                      {new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground justify-center">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />Mad</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />Sad</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />Glad</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category breakdown */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">{t("categoryBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex gap-4">
            {Object.entries(stats.byCat).map(([name, count]) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-sm">{name}</span>
                <Badge variant="secondary" className="tabular-nums">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participation */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-1">
            <Users className="h-4 w-4" aria-hidden="true" />
            {t("participation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-1.5">
            {stats.participation.map((p) => {
              const ago = formatTimeAgo(p.lastSeenAt, locale);
              const seenLabel = ago
                ? tCommon("lastSeen", { when: ago })
                : tCommon("neverSeen");
              return (
                <div key={p.name} className="flex items-center gap-2 text-sm flex-wrap">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="flex-1 min-w-0 truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground italic">{seenLabel}</span>
                  <span className="tabular-nums text-muted-foreground">{p.count} cards</span>
                  <span className="tabular-nums text-muted-foreground text-xs">
                    ({Math.round((p.count / stats.totalCards) * 100)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action items */}
      {stats.totalActionItems > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t("actionItems")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold tabular-nums">{stats.totalActionItems}</p>
                <p className="text-xs text-muted-foreground">{t("total")}</p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">{stats.doneActionItems}</p>
                <p className="text-xs text-muted-foreground">{t("completed")}</p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">{stats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">{t("completionRate")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussion metrics */}
      {stats.avgDiscussion > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-xl font-bold tabular-nums">{formatDuration(stats.avgDiscussion)}</p>
              <p className="text-xs text-muted-foreground">{t("avgDiscussionTime")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-xl font-bold tabular-nums">
                {stats.totalCards > 0 ? Math.round((stats.discussed / stats.totalCards) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">{t("discussionRate")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top tags */}
      {topTags.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-1">
              <Tag className="h-4 w-4" aria-hidden="true" />
              {t("topTags")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex flex-wrap gap-1.5">
              {topTags.map((tag) => (
                <Badge key={tag.name} variant="outline" className="tabular-nums">
                  {tag.name} ({tag.usageCount})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-1">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t("aiAnalysis")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 space-y-4">
          {!aiAnalysis && !loadingAi && (
            <Button onClick={handleGenerateAI} variant="outline" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
              {t("generateAI")}
            </Button>
          )}
          {loadingAi && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t("analyzingTeam")}
            </div>
          )}
          {aiAnalysis && (
            <div className="space-y-4">
              {aiAnalysis.summary && (
                <p className="text-sm">{aiAnalysis.summary}</p>
              )}

              {aiAnalysis.recurringThemes?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5">{t("recurringThemes")}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {aiAnalysis.recurringThemes.map((theme) => (
                      <Badge key={theme} variant="secondary">{theme}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {aiAnalysis.sentimentTrend && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">{t("sentimentTrend")}</h4>
                  <p className="text-sm">{aiAnalysis.sentimentTrend}</p>
                </div>
              )}

              {aiAnalysis.unresolvedPatterns?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    {t("unresolvedPatterns")}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {aiAnalysis.unresolvedPatterns.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-muted-foreground shrink-0">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAnalysis.recommendations?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5">{t("recommendations")}</h4>
                  <ul className="space-y-1 text-sm">
                    {aiAnalysis.recommendations.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500 shrink-0">→</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
