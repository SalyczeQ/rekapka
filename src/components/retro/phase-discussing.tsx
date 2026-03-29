"use client";

import { useMemo, useState, useCallback } from "react";
import { CardItem } from "./card-item";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface PhaseDiscussingProps {
  categories: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    sort_order: number;
  }[];
  cards: {
    id: string;
    category_id: string;
    author_id: string;
    text: string;
    group_label: string | null;
    is_discussed: boolean;
    discussion_notes?: string | null;
    created_at: string;
  }[];
  votes: {
    id: string;
    card_id: string;
    user_id: string;
  }[];
  currentUserId: string;
  showVoting: boolean;
  showDiscussed?: boolean;
  showNotes?: boolean;
  onToggleVote: (cardId: string) => Promise<void>;
  onToggleDiscussed?: (cardId: string) => Promise<void>;
  onEditNotes?: (cardId: string, notes: string) => Promise<void>;
  onEditGroupLabel?: (cardId: string, label: string) => Promise<void>;
  maxVotes: number;
  isFacilitator?: boolean;
  retroId?: string;
  isGroupingPhase?: boolean;
  onCardsRefresh?: () => void;
}

export function PhaseDiscussing({
  categories,
  cards,
  votes,
  currentUserId,
  showVoting,
  showDiscussed,
  showNotes,
  onToggleVote,
  onToggleDiscussed,
  onEditNotes,
  onEditGroupLabel,
  maxVotes,
  isFacilitator,
  retroId,
  isGroupingPhase,
  onCardsRefresh,
}: PhaseDiscussingProps) {
  const userVoteCount = votes.filter(
    (v) => v.user_id === currentUserId
  ).length;

  const [aiGrouping, setAiGrouping] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const handleAiGroup = useCallback(async () => {
    if (!retroId) return;
    setAiGrouping(true);
    try {
      const res = await fetch(`/api/ai/group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retro_id: retroId }),
      });
      if (!res.ok) {
        toast.error("AI grouping failed");
        return;
      }
      toast.success("Cards grouped!");
      onCardsRefresh?.();
    } catch {
      toast.error("AI grouping failed");
    } finally {
      setAiGrouping(false);
    }
  }, [retroId, onCardsRefresh]);

  const toggleGroupCollapse = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Sort cards: undiscussed first, then by vote count descending
  const sortedCardsByCategory = useMemo(() => {
    const result: Record<string, (typeof cards[number] & { voteCount: number })[]> = {};
    for (const category of categories) {
      const catCards = cards
        .filter((c) => c.category_id === category.id)
        .map((card) => ({
          ...card,
          voteCount: votes.filter((v) => v.card_id === card.id).length,
        }))
        .sort((a, b) => {
          if (a.is_discussed !== b.is_discussed)
            return a.is_discussed ? 1 : -1;
          return b.voteCount - a.voteCount;
        });
      result[category.id] = catCards;
    }
    return result;
  }, [categories, cards, votes]);

  // Group cards by group_label when in grouping phase
  const hasGroupLabels = cards.some((c) => c.group_label);

  return (
    <div className="space-y-4">
      {showVoting && (
        <div className="text-center text-sm text-muted-foreground">
          Votes used: {userVoteCount}/{maxVotes}
        </div>
      )}

      {isGroupingPhase && isFacilitator && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAiGroup}
            disabled={aiGrouping}
          >
            {aiGrouping ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Sparkles className="h-3 w-3 mr-1" />
            )}
            AI Group
          </Button>
        </div>
      )}

      {categories.map((category) => {
        const catCards = sortedCardsByCategory[category.id] ?? [];

        // Sub-group by group_label if any labels exist
        const grouped = isGroupingPhase && hasGroupLabels
          ? Object.entries(
              catCards.reduce<Record<string, typeof catCards>>((acc, card) => {
                const key = card.group_label || "Ungrouped";
                if (!acc[key]) acc[key] = [];
                acc[key].push(card);
                return acc;
              }, {})
            )
          : null;

        return (
          <div key={category.id} className="space-y-2">
            <h3
              className="text-sm font-medium flex items-center gap-1"
              style={{ color: category.color ?? undefined }}
            >
              <span>{category.icon}</span>
              {category.name}
              <span className="text-muted-foreground font-normal ml-1">
                ({catCards.length})
              </span>
            </h3>

            {grouped ? (
              <div className="space-y-3">
                {grouped.map(([label, groupCards]) => {
                  const groupKey = `${category.id}-${label}`;
                  const isCollapsed = collapsedGroups.has(groupKey);
                  return (
                    <div key={groupKey} className="space-y-1">
                      <button
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => toggleGroupCollapse(groupKey)}
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        {label}
                        <span className="font-normal">({groupCards.length})</span>
                      </button>
                      {!isCollapsed && (
                        <div className="space-y-2 ml-4">
                          {groupCards.map((card) => renderCard(card, category))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {catCards.map((card) => renderCard(card, category))}
                {catCards.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No cards in this category.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  function renderCard(
    card: (typeof cards)[number] & { voteCount: number },
    category: { color: string | null }
  ) {
    const voteCount = votes.filter((v) => v.card_id === card.id).length;
    const hasVoted = votes.some(
      (v) => v.card_id === card.id && v.user_id === currentUserId
    );
    return (
      <CardItem
        key={card.id}
        card={card}
        showContent
        categoryColor={category.color ?? undefined}
        voteCount={voteCount}
        hasVoted={hasVoted}
        showVoting={showVoting}
        showDiscussed={showDiscussed}
        showNotes={showNotes}
        isGroupingPhase={isGroupingPhase}
        onVote={() => onToggleVote(card.id)}
        onToggleDiscussed={
          onToggleDiscussed
            ? () => onToggleDiscussed(card.id)
            : undefined
        }
        onEditNotes={
          onEditNotes
            ? (notes: string) => onEditNotes(card.id, notes)
            : undefined
        }
        onEditGroupLabel={
          onEditGroupLabel
            ? (label: string) => onEditGroupLabel(card.id, label)
            : undefined
        }
      />
    );
  }
}
