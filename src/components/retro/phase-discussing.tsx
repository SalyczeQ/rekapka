"use client";

import { useMemo } from "react";
import { CardItem } from "./card-item";

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
  onToggleVote: (cardId: string) => Promise<void>;
  onToggleDiscussed?: (cardId: string) => Promise<void>;
  maxVotes: number;
}

export function PhaseDiscussing({
  categories,
  cards,
  votes,
  currentUserId,
  showVoting,
  showDiscussed,
  onToggleVote,
  onToggleDiscussed,
  maxVotes,
}: PhaseDiscussingProps) {
  const userVoteCount = votes.filter(
    (v) => v.user_id === currentUserId
  ).length;

  // Sort cards: undiscussed first, then by vote count descending
  const sortedCardsByCategory = useMemo(() => {
    const result: Record<string, typeof cards> = {};
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

  return (
    <div className="space-y-4">
      {showVoting && (
        <div className="text-center text-sm text-muted-foreground">
          Votes used: {userVoteCount}/{maxVotes}
        </div>
      )}

      {categories.map((category) => {
        const catCards = sortedCardsByCategory[category.id] ?? [];

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

            <div className="space-y-2">
              {catCards.map((card) => {
                const voteCount = votes.filter(
                  (v) => v.card_id === card.id
                ).length;
                const hasVoted = votes.some(
                  (v) =>
                    v.card_id === card.id && v.user_id === currentUserId
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
                    onVote={() => onToggleVote(card.id)}
                    onToggleDiscussed={
                      onToggleDiscussed
                        ? () => onToggleDiscussed(card.id)
                        : undefined
                    }
                  />
                );
              })}
              {catCards.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No cards in this category.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
