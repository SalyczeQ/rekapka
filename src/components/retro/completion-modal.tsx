"use client";

import { useState, useEffect, useMemo } from "react";
import type { SerializedRetro, SerializedCategory, SerializedCard, SerializedActionItem } from "@/types/serialized";
import { Confetti } from "@/components/shared/confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Clock,
  MessageSquare,
  SkipForward,
  ArrowRightLeft,
  Users,
  BarChart3,
  Loader2,
  Timer,
  PenLine,
  CheckCircle2,
  MapPin,
  Camera,
  Upload,
  Check,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { vibrate } from "@/lib/haptics";
import { REACTION_EMOJIS } from "@/lib/reactions";

interface CompletionModalProps {
  retro: SerializedRetro;
  categories: SerializedCategory[];
  cards: SerializedCard[];
  actionItems?: SerializedActionItem[];
  allUsers: { id: string; name: string; color: string; image: string | null }[];
  initialPhotoUrl?: string | null;
  currentUserEmail?: string;
  reactions?: Record<string, Record<string, number>>;
}

export function CompletionModal({
  retro,
  categories,
  cards,
  actionItems = [],
  allUsers,
  initialPhotoUrl,
  currentUserEmail,
  reactions = {},
}: CompletionModalProps) {
  const t = useTranslations("completion");
  const [generatingStats, setGeneratingStats] = useState(false);
  const [statsGenerated, setStatsGenerated] = useState(!!retro.statsCache);
  const [location, setLocation] = useState(retro.location ?? "");
  const [locationSaved, setLocationSaved] = useState(!!retro.location);
  const [savingLocation, setSavingLocation] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(!!retro.photoUrl);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(initialPhotoUrl ?? null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Celebration haptic on mount
  useEffect(() => {
    vibrate([50, 50, 50, 50, 100]);
  }, []);

  // Trigger stats generation on mount if not cached
  useEffect(() => {
    if (retro.statsCache) return;
    setGeneratingStats(true);
    fetch(`/api/ai/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retroId: retro.id }),
    })
      .then(() => setStatsGenerated(true))
      .catch(() => {})
      .finally(() => setGeneratingStats(false));
  }, [retro.id, retro.statsCache]);

  // Compute instant stats
  const stats = useMemo(() => {
    const discussed = cards.filter((c) => c.isDiscussed);
    const skipped = cards.filter((c) => c.isSkipped && !c.isDiscussed);
    const undiscussed = cards.filter((c) => !c.isDiscussed && !c.isSkipped);

    // Total duration: prefer DB value, then compute from timestamps
    const totalDuration = retro.totalDurationSec
      ?? (retro.startedAt && retro.completedAt
        ? Math.floor((new Date(retro.completedAt).getTime() - new Date(retro.startedAt).getTime()) / 1000)
        : retro.startedAt
          ? Math.floor((Date.now() - new Date(retro.startedAt).getTime()) / 1000)
          : 0);

    // Discussion times
    const discussionTimes = discussed
      .map((c) => c.discussionDurationSec ?? 0)
      .filter((t) => t > 0);
    const avgDiscussion = discussionTimes.length > 0
      ? Math.round(discussionTimes.reduce((a, b) => a + b, 0) / discussionTimes.length)
      : 0;
    const totalDiscussionTime = discussionTimes.reduce((a, b) => a + b, 0);
    const writingTime = totalDuration > 0 ? Math.max(0, totalDuration - totalDiscussionTime) : 0;

    const longestCard = discussed.reduce(
      (best, c) => ((c.discussionDurationSec ?? 0) > (best?.discussionDurationSec ?? 0) ? c : best),
      discussed[0] as SerializedCard | undefined
    );

    const cardsByCategory = categories.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      count: cards.filter((c) => c.categoryId === cat.id).length,
    }));

    const mostPopularCategory = [...cardsByCategory].sort((a, b) => b.count - a.count)[0];

    const cardsByAuthor = allUsers
      .map((u) => ({
        name: u.name,
        color: u.color,
        count: cards.filter((c) => c.authorId === u.id).length,
      }))
      .filter((a) => a.count > 0)
      .sort((a, b) => b.count - a.count);

    // Average card length in words
    const totalWords = cards.reduce((sum, c) => sum + c.text.split(/\s+/).filter(Boolean).length, 0);
    const avgCardWords = cards.length > 0 ? Math.round(totalWords / cards.length) : 0;

    // Discussion time distribution
    const distribution = { under1: 0, oneToThree: 0, threeToFive: 0, overFive: 0 };
    for (const t of discussionTimes) {
      if (t < 60) distribution.under1++;
      else if (t < 180) distribution.oneToThree++;
      else if (t < 300) distribution.threeToFive++;
      else distribution.overFive++;
    }

    return {
      total: cards.length,
      discussed: discussed.length,
      skipped: skipped.length,
      undiscussed: undiscussed.length,
      totalDuration,
      writingTime,
      totalDiscussionTime,
      avgDiscussion,
      longestCard,
      cardsByCategory,
      mostPopularCategory,
      cardsByAuthor,
      avgCardWords,
      distribution,
      actionItemCount: actionItems.length,
    };
  }, [cards, categories, allUsers, retro, actionItems]);

  // Reaction stats: most reacted card per emoji + overall leaderboard
  const reactionStats = useMemo(() => {
    const cardEntries = Object.entries(reactions);
    if (cardEntries.length === 0) return null;

    // Total reactions per card
    const cardTotals: { cardId: string; total: number }[] = cardEntries.map(([cardId, emojis]) => ({
      cardId,
      total: Object.values(emojis).reduce((a, b) => a + b, 0),
    }));

    // Most reacted card overall
    const sortedByTotal = [...cardTotals].sort((a, b) => b.total - a.total);
    const mostReactedCardId = sortedByTotal[0]?.total > 0 ? sortedByTotal[0].cardId : null;
    const mostReactedCard = mostReactedCardId ? cards.find((c) => c.id === mostReactedCardId) : null;
    const mostReactedTotal = sortedByTotal[0]?.total ?? 0;

    // Per-emoji winners: which card got the most of each emoji
    const emojiWinners: { emoji: string; display: string; cardId: string; count: number; cardText: string; authorName: string; authorColor: string }[] = [];
    for (const { key, display } of REACTION_EMOJIS) {
      let bestCardId = "";
      let bestCount = 0;
      for (const [cardId, emojis] of cardEntries) {
        const count = emojis[key] ?? 0;
        if (count > bestCount) {
          bestCount = count;
          bestCardId = cardId;
        }
      }
      if (bestCount > 0) {
        const card = cards.find((c) => c.id === bestCardId);
        if (card) {
          emojiWinners.push({
            emoji: key,
            display,
            cardId: bestCardId,
            count: bestCount,
            cardText: card.text,
            authorName: card.authorName,
            authorColor: card.authorColor,
          });
        }
      }
    }

    // Total reactions count
    const totalReactions = cardTotals.reduce((sum, c) => sum + c.total, 0);

    return {
      mostReactedCard,
      mostReactedTotal,
      emojiWinners,
      totalReactions,
    };
  }, [reactions, cards]);

  const handleSaveLocation = async () => {
    if (!location.trim() || savingLocation) return;
    setSavingLocation(true);
    try {
      const { updateRetro } = await import("@/lib/actions/retro");
      const fd = new FormData();
      fd.set("location", location.trim());
      await updateRetro(retro.id, fd);
      setLocationSaved(true);
      toast.success(t("locationSaved"));
    } catch {
      toast.error(t("locationFailed"));
    } finally {
      setSavingLocation(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    // Show local preview immediately
    setPhotoPreviewUrl(URL.createObjectURL(file));
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch(`/api/retros/${retro.id}/photo`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error();
      setPhotoUploaded(true);
      toast.success(t("photoSaved"));
    } catch {
      toast.error(t("photoFailed"));
      setPhotoPreviewUrl(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m < 60) return `${m}m ${s}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Confetti trigger={true} />

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-balance">{t("retroComplete")}</h2>
        <p className="text-muted-foreground">
          {retro.title}
        </p>
      </div>

      {/* Location & Photo */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">{t("retroDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 space-y-3">
          {/* Location — always editable */}
          <div className="space-y-1.5">
            <Label htmlFor="completion-location" className="text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {t("locationLabel")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="completion-location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setLocationSaved(false);
                }}
                placeholder={t("locationPlaceholder")}
                autoComplete="off"
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveLocation();
                  }
                }}
              />
              <Button
                size="sm"
                variant={locationSaved ? "outline" : "default"}
                onClick={handleSaveLocation}
                disabled={!location.trim() || savingLocation || locationSaved}
              >
                {savingLocation ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : locationSaved ? (
                  <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                ) : (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          {/* Photo upload */}
          <div className="space-y-1.5">
            <Label htmlFor="completion-photo" className="text-xs flex items-center gap-1">
              <Camera className="h-3 w-3" aria-hidden="true" />
              {t("photoLabel")}
            </Label>
            {photoPreviewUrl && (
              <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreviewUrl}
                  alt="Team photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label
              htmlFor="completion-photo"
              className="flex items-center justify-center gap-2 border border-dashed border-input rounded-md px-3 py-3 cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
            >
              {uploadingPhoto ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : photoUploaded ? (
                <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
              ) : (
                <Upload className="h-4 w-4" aria-hidden="true" />
              )}
              {uploadingPhoto ? t("uploading") : photoUploaded ? t("photoUploaded") : t("uploadPhoto")}
              <input
                id="completion-photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{formatDuration(stats.totalDuration)}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {t("totalDuration")}
            </p>
          </CardContent>
        </Card>
        <Link href={`/retros/${retro.id}/cards`} className="block">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-bold tabular-nums">{stats.total}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <MessageSquare className="h-3 w-3" aria-hidden="true" />
                {t("totalCards")}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{stats.discussed}</p>
            <p className="text-xs text-muted-foreground">{t("discussed")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{stats.skipped + stats.undiscussed}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <SkipForward className="h-3 w-3" aria-hidden="true" />
              {t("skippedCarried")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time breakdown */}
      {stats.totalDuration > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-1">
              <Timer className="h-4 w-4" aria-hidden="true" />
              {t("timeBreakdown")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("writingTime")}</span>
              <span className="tabular-nums font-medium">{formatDuration(stats.writingTime)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t("discussingTime")}</span>
              <span className="tabular-nums font-medium">{formatDuration(stats.totalDiscussionTime)}</span>
            </div>
            {stats.avgDiscussion > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t("avgPerCard")}</span>
                <span className="tabular-nums">{formatDuration(stats.avgDiscussion)}</span>
              </div>
            )}
            {stats.longestCard && (stats.longestCard.discussionDurationSec ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="truncate mr-2">{t("longestDiscussion")}</span>
                <span className="tabular-nums shrink-0">{formatDuration(stats.longestCard.discussionDurationSec ?? 0)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Discussion time distribution */}
      {stats.discussed > 0 && (() => {
        const d = stats.distribution;
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
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{t("discussionDistribution")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-end gap-3 h-28">
                {bars.map((bar) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-xs font-medium tabular-nums">{bar.value}</span>
                    <div
                      className={`w-full rounded-t-sm ${bar.color} transition-all duration-500 ease-out`}
                      style={{
                        height: max > 0 ? `${Math.max((bar.value / max) * 100, bar.value > 0 ? 8 : 0)}%` : "0%",
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">{bar.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Cards by category */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">{t("cardsByCategory")}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex gap-4">
            {stats.cardsByCategory.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                {cat.icon && <span>{cat.icon}</span>}
                <span className="text-sm">{cat.name}</span>
                <Badge variant="secondary" className="tabular-nums">{cat.count}</Badge>
              </div>
            ))}
          </div>
          {stats.mostPopularCategory && stats.mostPopularCategory.count > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {t("mostPopular")}: {stats.mostPopularCategory.icon} {stats.mostPopularCategory.name}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cards by author */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-1">
            <Users className="h-4 w-4" aria-hidden="true" />
            {t("cardsByAuthor")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-1">
            {stats.cardsByAuthor.map((author) => (
              <div key={author.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: author.color }}
                />
                <span className="flex-1">{author.name}</span>
                <span className="tabular-nums text-muted-foreground">{author.count}</span>
              </div>
            ))}
          </div>
          {stats.avgCardWords > 0 && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <PenLine className="h-3 w-3" aria-hidden="true" />
              {t("avgCardLength", { words: stats.avgCardWords })}
            </p>
          )}
          <Link href={`/retros/${retro.id}/cards`} className="block mt-3">
            <Button variant="outline" size="sm" className="w-full">
              {t("showAllCards")}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Action items */}
      {stats.actionItemCount > 0 && (
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold tabular-nums">{stats.actionItemCount}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              {t("actionItemsCreated")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reaction leaderboard */}
      {reactionStats && reactionStats.totalReactions > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">{t("reactionLeaderboard")}</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 space-y-3">
            {/* Most reacted card */}
            {reactionStats.mostReactedCard && (
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-muted-foreground mb-1">{t("mostReactedCard")}</p>
                <div className="flex items-start gap-2">
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: reactionStats.mostReactedCard.authorColor }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm line-clamp-2">{reactionStats.mostReactedCard.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {reactionStats.mostReactedCard.authorName} — {reactionStats.mostReactedTotal} {t("reactionsCount")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Per-emoji winners */}
            <div className="space-y-1.5">
              {reactionStats.emojiWinners.map((winner) => (
                <div key={winner.emoji} className="flex items-center gap-2 text-sm">
                  <span className="text-base w-6 text-center shrink-0">{winner.display}</span>
                  <span className="tabular-nums font-medium shrink-0 w-6 text-center">{winner.count}</span>
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: winner.authorColor }}
                    />
                    <span className="truncate text-muted-foreground">{winner.cardText}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center tabular-nums">
              {reactionStats.totalReactions} {t("totalReactions")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI stats link */}
      <div className="flex items-center justify-center gap-3">
        {generatingStats && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            {t("generatingStats")}
          </span>
        )}
        {statsGenerated && (
          <Link href={`/retros/${retro.id}/stats`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
              {t("viewStats")}
            </Button>
          </Link>
        )}
      </div>

      {/* Create Next Retro */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-1">
            <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
            {t("createNext")}
          </CardTitle>
          {(stats.undiscussed + stats.skipped) > 0 && (
            <p className="text-xs text-muted-foreground">
              {t("undiscussedCarryOver", { count: stats.undiscussed + stats.skipped })}
            </p>
          )}
        </CardHeader>
        <CardContent className="pb-4">
          <form
            action={async (formData: FormData) => {
              const { createRetro } = await import("@/lib/actions/retro");
              await createRetro(formData);
            }}
            className="space-y-3"
          >
            <input type="hidden" name="fromRetroId" value={retro.id} />
            <div className="space-y-1.5">
              <Label htmlFor="next-title">{t("titleLabel")}</Label>
              <Input
                id="next-title"
                name="title"
                placeholder={t("titlePlaceholder")}
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="next-date">{t("dateLabel")}</Label>
              <Input
                id="next-date"
                name="date"
                type="date"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="next-location">{t("locationLabel")}</Label>
              <Input
                id="next-location"
                name="location"
                placeholder={t("locationPlaceholder")}
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full">
              {t("createNext")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Admin delete button */}
      {currentUserEmail === "salay14@gmail.com" && (
        <div className="pt-4 border-t">
          {confirmDelete ? (
            <div className="space-y-2 text-center">
              <p className="text-sm text-destructive">{t("confirmDelete")}</p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    const { deleteRetro } = await import("@/lib/actions/retro");
                    await deleteRetro(retro.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  {t("deleteRetro")}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              {t("deleteRetro")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
