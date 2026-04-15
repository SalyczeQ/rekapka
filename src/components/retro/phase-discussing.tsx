"use client";

import { useState, useEffect, useCallback } from "react";
import type { SerializedRetro, SerializedCategory, SerializedCard, SerializedActionItem } from "@/types/serialized";
import { fairSort } from "@/lib/sorting";
import {
  markCardDiscussed,
  skipCard,
  unskipCard,
  startCardDiscussion,
  updateCard,
} from "@/lib/actions/retro-session";
import { createActionItem } from "@/lib/actions/action-items";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { vibrate } from "@/lib/haptics";
import { CardItem } from "./card-item";
import { ReactionBar } from "./reaction-bar";
import { deleteActionItem } from "@/lib/actions/action-items";
import { CardInput } from "./card-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkipForward, Check, Clock, Plus, StickyNote, Trash2, PenLine, ChevronDown, Timer, PartyPopper, Undo2 } from "lucide-react";

interface PhaseDiscussingProps {
  retro: SerializedRetro;
  categories: SerializedCategory[];
  cards: SerializedCard[];
  actionItems: SerializedActionItem[];
  currentUserId: string;
  allUsers: { id: string; name: string; color: string; image: string | null }[];
  onCardsChange: (cards: SerializedCard[]) => void;
  onActionItemsChange: (items: SerializedActionItem[]) => void;
  dictationEnabled?: boolean;
  reactions: Record<string, Record<string, number>>;
  userReactions: Record<string, string[]>;
  reactionSoundsEnabled?: boolean;
}

export function PhaseDiscussing({
  retro,
  categories,
  cards,
  actionItems,
  currentUserId,
  allUsers,
  onCardsChange,
  onActionItemsChange,
  dictationEnabled = true,
  reactions,
  userReactions,
  reactionSoundsEnabled = false,
}: PhaseDiscussingProps) {
  const t = useTranslations();
  const activeCards = cards.filter((c) => !c.isDiscussed && !c.isSkipped);
  const skippedCards = cards.filter((c) => !c.isDiscussed && c.isSkipped);
  const sortedCards = [...fairSort(activeCards), ...skippedCards];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardTimer, setCardTimer] = useState(0);
  const [actionText, setActionText] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [showNotesActions, setShowNotesActions] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [addCardCategoryId, setAddCardCategoryId] = useState(categories[0]?.id ?? "");

  const currentUser = allUsers.find((u) => u.id === currentUserId) ?? {
    id: currentUserId, name: "You", color: "#888", image: null,
  };

  const currentCard = sortedCards[currentIndex];
  const discussedCount = cards.filter((c) => c.isDiscussed).length;
  const totalCards = cards.length;

  // Total discussion time = sum of all discussed cards + current card timer
  const totalDiscussionTime = cards
    .filter((c) => c.isDiscussed && c.discussionDurationSec)
    .reduce((sum, c) => sum + (c.discussionDurationSec ?? 0), 0) + cardTimer;

  // Auto-start discussion for current card + reset UI state
  // Auto-expand notes when card has existing action items or notes
  useEffect(() => {
    if (currentCard && !currentCard.discussionStartedAt) {
      startCardDiscussion(currentCard.id);
    }
    if (currentCard) {
      const hasActions = actionItems.some((a) => a.cardId === currentCard.id);
      const hasNotes = !!(currentCard.discussionNotes);
      setShowNotesActions(hasActions || hasNotes);
    } else {
      setShowNotesActions(false);
    }
    setNotes(currentCard?.discussionNotes ?? "");
    setActionText("");
    setAssigneeId("");
  }, [currentCard?.id]);

  // Count-up timer — resume from discussionStartedAt if available
  useEffect(() => {
    if (!currentCard) return;
    const elapsed = currentCard.discussionStartedAt
      ? Math.max(0, Math.floor((Date.now() - new Date(currentCard.discussionStartedAt).getTime()) / 1000))
      : 0;
    setCardTimer(elapsed);
    const interval = setInterval(() => {
      setCardTimer((prev) => {
        const next = prev + 1;
        if (next > 0 && next % 60 === 0) vibrate(15);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentCard?.id]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleMarkDiscussed = useCallback(async () => {
    if (!currentCard || busy) return;
    setBusy(true);
    try {
      if (notes.trim() && notes.trim() !== (currentCard.discussionNotes ?? "")) {
        const fd = new FormData();
        fd.set("discussionNotes", notes.trim());
        await updateCard(currentCard.id, fd);
      }
      await markCardDiscussed(currentCard.id);
      vibrate(50);
      onCardsChange(
        cards.map((c) =>
          c.id === currentCard.id
            ? { ...c, isDiscussed: true, discussionDurationSec: cardTimer, discussionNotes: notes.trim() || null }
            : c
        )
      );
    } catch {
      vibrate([100, 50, 100]);
      toast.error(t("discussion.failedMarkDiscussed"));
    } finally {
      setBusy(false);
    }
  }, [currentCard, cards, cardTimer, notes, onCardsChange, busy]);

  const handleSkip = useCallback(async () => {
    if (!currentCard || busy) return;
    setBusy(true);
    try {
      await skipCard(currentCard.id);
      vibrate([20, 20, 20]);
      onCardsChange(
        cards.map((c) =>
          c.id === currentCard.id ? { ...c, isSkipped: true } : c
        )
      );
    } catch {
      vibrate([100, 50, 100]);
      toast.error(t("discussion.failedSkip"));
    } finally {
      setBusy(false);
    }
  }, [currentCard, cards, onCardsChange, busy]);

  const handleUnskip = useCallback(
    async (cardId: string) => {
      if (busy) return;
      setBusy(true);
      try {
        await unskipCard(cardId);
        onCardsChange(
          cards.map((c) => (c.id === cardId ? { ...c, isSkipped: false } : c))
        );
      } catch {
        toast.error(t("discussion.failedUnskip"));
      } finally {
        setBusy(false);
      }
    },
    [cards, onCardsChange, busy]
  );

  const handleAddActionItem = useCallback(async () => {
    if (!actionText.trim() || !currentCard) return;
    try {
      const fd = new FormData();
      fd.set("retroId", retro.id);
      fd.set("cardId", currentCard.id);
      fd.set("text", actionText.trim());
      if (assigneeId) fd.set("assigneeId", assigneeId);
      const item = await createActionItem(fd);
      onActionItemsChange([
        ...actionItems,
        {
          id: item.id,
          retroId: item.retroId,
          cardId: item.cardId,
          text: item.text,
          assigneeId: item.assigneeId,
          assigneeName: allUsers.find((u) => u.id === item.assigneeId)?.name ?? null,
          status: item.status,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success(t("discussion.actionItemAdded"));
      setActionText("");
      setAssigneeId("");
    } catch {
      vibrate([100, 50, 100]);
      toast.error(t("discussion.failedAddAction"));
    }
  }, [actionText, assigneeId, currentCard, retro.id, actionItems, allUsers, onActionItemsChange]);

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? "";

  const getCategoryIcon = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.icon ?? "";

  const timerPulse = cardTimer > 0 && cardTimer % 60 === 0;
  const progressPct = totalCards > 0 ? (discussedCount / totalCards) * 100 : 0;

  // Empty state: all cards discussed
  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
        {/* Full progress bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden mx-auto max-w-xs">
          <div className="h-full bg-primary rounded-full w-full" />
        </div>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
          <PartyPopper className="h-7 w-7 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold">{t("retro.allDiscussed")}</h2>
        <p className="text-muted-foreground">
          {t("retro.cardsDiscussed", { count: discussedCount })}
        </p>
        {totalDiscussionTime > 0 && (
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-full px-4 py-1.5">
            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-mono tabular-nums">{formatTime(totalDiscussionTime)}</span>
            <span>{t("discussion.totalTime")}</span>
          </div>
        )}
      </div>
    );
  }

  const cardActions = currentCard ? actionItems.filter((a) => a.cardId === currentCard.id) : [];
  const categoryIcon = getCategoryIcon(currentCard.categoryId);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* 1. Progress bar + stats */}
      <div className="space-y-2">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("card.cardOf", { current: currentIndex + 1, total: sortedCards.length, discussed: discussedCount })}
          </span>
          <div className="flex items-center gap-3">
            {/* Per-card timer */}
            <span
              className={cn(
                "flex items-center gap-1 font-mono tabular-nums transition-all duration-300",
                timerPulse && "scale-110 text-primary font-semibold"
              )}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatTime(cardTimer)}
            </span>
            {/* Total discussion time (show only when > card time) */}
            {totalDiscussionTime > cardTimer && (
              <span className="flex items-center gap-1 font-mono tabular-nums text-xs opacity-60">
                <Timer className="h-3 w-3" aria-hidden="true" />
                {formatTime(totalDiscussionTime)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Current card — key triggers enter animation on card change */}
      <div key={currentCard.id} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
        <Card className="border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-1.5">
                {categoryIcon && <span>{categoryIcon}</span>}
                {getCategoryName(currentCard.categoryId)}
              </CardTitle>
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: currentCard.authorColor }}
              >
                {currentCard.authorName}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <CardItem
              card={currentCard}
              isOwn={currentCard.authorId === currentUserId}
              showContent={true}
              blurred={true}
            />
            <ReactionBar
              cardId={currentCard.id}
              reactions={reactions[currentCard.id] ?? {}}
              userReactions={userReactions[currentCard.id] ?? []}
              soundEnabled={reactionSoundsEnabled}
            />
          </CardContent>
        </Card>
      </div>

      {/* 3. Primary actions — Skip / Done — always show text */}
      <div className="flex gap-2">
        {currentCard.isSkipped ? (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleUnskip(currentCard.id)}
            disabled={busy}
          >
            <Undo2 className="h-4 w-4 mr-2" aria-hidden="true" />
            {t("card.unskip")}
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" onClick={handleSkip} disabled={busy}>
            <SkipForward className="h-4 w-4 mr-2" aria-hidden="true" />
            {t("card.skip")}
          </Button>
        )}
        <Button className="flex-1" onClick={handleMarkDiscussed} disabled={busy}>
          <Check className="h-4 w-4 mr-2" aria-hidden="true" />
          {t("card.done")}
        </Button>
      </div>

      {/* 4. Skipped cards mini-list */}
      {skippedCards.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium px-1">
            {t("card.skippedCards", { count: skippedCards.length })}
          </p>
          <div className="space-y-1">
            {skippedCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-2 text-sm bg-muted/30 rounded-md px-3 py-1.5 border border-dashed border-muted-foreground/20"
              >
                <div
                  className="w-1 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: card.authorColor }}
                />
                <span className="flex-1 min-w-0 truncate text-muted-foreground">
                  {card.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs shrink-0 px-2"
                  onClick={() => handleUnskip(card.id)}
                  disabled={busy}
                >
                  <Undo2 className="h-3 w-3 mr-1" aria-hidden="true" />
                  {t("card.unskip")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Notes & Actions — collapsible, auto-opens when card has items */}
      <div className="border-t pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground justify-between"
          onClick={() => setShowNotesActions(!showNotesActions)}
        >
          <span className="flex items-center gap-1">
            <StickyNote className="h-3 w-3" aria-hidden="true" />
            {t("discussion.notesAndActions")}
            {cardActions.length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 rounded-full">
                {cardActions.length}
              </span>
            )}
          </span>
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", showNotesActions && "rotate-180")} aria-hidden="true" />
        </Button>
        {showNotesActions && (
          <div className="mt-2 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Notes */}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm bg-transparent border border-input rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={2}
              placeholder={t("discussion.notesPlaceholder")}
            />

            {/* Action item input — assignee visible on all sizes */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); handleAddActionItem(); }
                  }}
                  placeholder={t("discussion.actionItemPlaceholder")}
                  autoComplete="off"
                  className="flex-1 min-w-0 text-sm bg-transparent border border-input rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={handleAddActionItem} disabled={!actionText.trim()} aria-label="Add action item">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full text-sm bg-transparent border border-input rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={t("discussion.assignTo")}
              >
                <option value="">{t("discussion.unassigned")}</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Action items list */}
            {cardActions.length > 0 && (
              <ul className="space-y-1">
                {cardActions.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm bg-muted/50 rounded-md px-3 py-1.5">
                    <Check className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
                    <span className="flex-1 min-w-0 truncate">{item.text}</span>
                    {item.assigneeName && (
                      <span className="text-xs text-muted-foreground shrink-0">{item.assigneeName}</span>
                    )}
                    <button type="button" className="text-muted-foreground hover:text-destructive shrink-0" aria-label={`Delete: ${item.text}`}
                      onClick={async () => { await deleteActionItem(item.id); onActionItemsChange(actionItems.filter((a) => a.id !== item.id)); }}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 6. Add new card during discussion */}
      <div className="border-t pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground justify-between"
          onClick={() => setShowAddCard(!showAddCard)}
        >
          <span className="flex items-center gap-1">
            <PenLine className="h-3 w-3" aria-hidden="true" />
            {t("discussion.addCard")}
          </span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              showAddCard && "rotate-180"
            )}
            aria-hidden="true"
          />
        </Button>
        {showAddCard && (
          <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <select
              value={addCardCategoryId}
              onChange={(e) => setAddCardCategoryId(e.target.value)}
              className="w-full text-sm bg-transparent border border-input rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={t("discussion.selectCategory")}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            <CardInput
              retroId={retro.id}
              categoryId={addCardCategoryId}
              currentUser={currentUser}
              onCardAdded={(card) => {
                onCardsChange([...cards, card]);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
