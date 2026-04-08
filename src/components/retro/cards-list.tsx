"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface CardData {
  id: string;
  text: string;
  categoryId: string;
  authorId: string;
  isDiscussed: boolean;
  isSkipped: boolean;
  discussionDurationSec: number | null;
  discussionNotes: string | null;
  groupLabel: string | null;
  authorName: string;
  authorColor: string;
  authorImage: string | null;
}

interface CategoryData {
  id: string;
  name: string;
  icon: string | null;
}

interface CardsListProps {
  cards: CardData[];
  categories: CategoryData[];
  authors: { id: string; name: string; color: string; image: string | null }[];
}

export function CardsList({ cards, categories, authors }: CardsListProps) {
  const t = useTranslations("cards");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const filteredCards = selectedAuthor
    ? cards.filter((c) => c.authorId === selectedAuthor)
    : cards;

  const formatDuration = (sec: number | null) => {
    if (!sec) return null;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Author filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setSelectedAuthor(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedAuthor === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          {t("all")}
          <Badge variant="secondary" className="tabular-nums text-[10px] px-1.5 py-0">
            {cards.length}
          </Badge>
        </button>
        {authors.map((author) => {
          const count = cards.filter((c) => c.authorId === author.id).length;
          if (count === 0) return null;
          const isActive = selectedAuthor === author.id;
          return (
            <button
              key={author.id}
              type="button"
              onClick={() => setSelectedAuthor(isActive ? null : author.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.image}
                  alt=""
                  width={18}
                  height={18}
                  className="rounded-full"
                />
              ) : (
                <span
                  className="w-[18px] h-[18px] rounded-full shrink-0 inline-flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: author.color }}
                >
                  {author.name.charAt(0)}
                </span>
              )}
              {author.name}
              <Badge variant="secondary" className="tabular-nums text-[10px] px-1.5 py-0">
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Cards grouped by category */}
      {categories.map((category) => {
        const catCards = filteredCards.filter((c) => c.categoryId === category.id);
        if (catCards.length === 0) return null;

        return (
          <section key={category.id} className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              {category.icon && <span>{category.icon}</span>}
              {category.name}
              <Badge variant="secondary" className="tabular-nums">{catCards.length}</Badge>
            </h2>
            <div className="space-y-2">
              {catCards.map((card) => {
                const duration = formatDuration(card.discussionDurationSec);
                return (
                  <Card
                    key={card.id}
                    className={`relative overflow-hidden ${card.isSkipped ? "opacity-60 border-dashed" : ""}`}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: card.authorColor }}
                    />
                    <CardContent className="pl-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0 space-y-1">
                          {card.groupLabel && (
                            <Badge variant="outline" className="text-xs">
                              {card.groupLabel}
                            </Badge>
                          )}
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {card.text}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {card.authorImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={card.authorImage}
                                alt=""
                                width={16}
                                height={16}
                                className="rounded-full"
                              />
                            ) : (
                              <span
                                className="w-4 h-4 rounded-full shrink-0 inline-flex items-center justify-center text-[8px] font-bold text-white"
                                style={{ backgroundColor: card.authorColor }}
                              >
                                {card.authorName.charAt(0)}
                              </span>
                            )}
                            <span>{card.authorName}</span>
                            {card.isDiscussed && (
                              <Badge variant="secondary" className="text-[10px] py-0">
                                {t("discussed")}
                              </Badge>
                            )}
                            {card.isSkipped && (
                              <Badge variant="secondary" className="text-[10px] py-0">
                                {t("skipped")}
                              </Badge>
                            )}
                            {duration && <span className="tabular-nums">{duration}</span>}
                          </div>
                          {card.discussionNotes && (
                            <p className="text-xs text-muted-foreground italic mt-1 border-l-2 border-muted pl-2">
                              {card.discussionNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

      {filteredCards.length === 0 && (
        <p className="text-center text-muted-foreground py-8">{t("noCards")}</p>
      )}
    </div>
  );
}
