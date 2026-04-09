"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { assignCardAuthor, deleteCard } from "@/lib/actions/retro-session";
import { Check, Pencil, Bot, Undo2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ANONYMOUS_ID = "00000000-0000-4000-8000-000000000000";

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
  guessedAuthor: string | null;
  sortOrder: number;
  authorName: string;
  authorColor: string;
  authorImage: string | null;
}

interface CategoryData {
  id: string;
  name: string;
  icon: string | null;
}

interface UserData {
  id: string;
  name: string;
  color: string;
  image: string | null;
}

interface CardsListProps {
  cards: CardData[];
  categories: CategoryData[];
  authors: UserData[];
  allUsers?: UserData[];
  currentUserEmail?: string;
}

export function CardsList({ cards: initialCards, categories, authors, allUsers = [], currentUserEmail }: CardsListProps) {
  const t = useTranslations("cards");
  const [cards, setCards] = useState(initialCards);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [changingCard, setChangingCard] = useState<string | null>(null);
  const pendingTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

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

  const assignWithUndo = useCallback((cardId: string, userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;

    // Save old state for undo
    const oldCard = cards.find((c) => c.id === cardId);
    if (!oldCard) return;

    // Cancel any pending timer for this card
    const existing = pendingTimers.current.get(cardId);
    if (existing) clearTimeout(existing);

    // Optimistic update
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, authorId: user.id, authorName: user.name, authorColor: user.color, authorImage: user.image }
          : c
      )
    );
    setChangingCard(null);

    // Schedule server call after 5s
    const timer = setTimeout(async () => {
      pendingTimers.current.delete(cardId);
      try {
        await assignCardAuthor(cardId, userId);
      } catch {
        // Revert on server error
        setCards((prev) =>
          prev.map((c) =>
            c.id === cardId
              ? { ...c, authorId: oldCard.authorId, authorName: oldCard.authorName, authorColor: oldCard.authorColor, authorImage: oldCard.authorImage }
              : c
          )
        );
        toast.error(t("assignFailed"));
      }
    }, 5000);
    pendingTimers.current.set(cardId, timer);

    // Show undo toast
    toast(
      `${user.name}`,
      {
        description: t("assigned"),
        duration: 5000,
        action: {
          label: t("undo"),
          onClick: () => {
            clearTimeout(timer);
            pendingTimers.current.delete(cardId);
            setCards((prev) =>
              prev.map((c) =>
                c.id === cardId
                  ? { ...c, authorId: oldCard.authorId, authorName: oldCard.authorName, authorColor: oldCard.authorColor, authorImage: oldCard.authorImage }
                  : c
              )
            );
          },
        },
      }
    );
  }, [cards, allUsers, t]);

  function handleConfirmGuess(card: CardData) {
    const matchedUser = allUsers.find((u) => u.name === card.guessedAuthor);
    if (!matchedUser) return;
    assignWithUndo(card.id, matchedUser.id);
  }

  function handleAssign(cardId: string, userId: string) {
    assignWithUndo(cardId, userId);
  }

  const isAdmin = currentUserEmail === "salay14@gmail.com";

  const deleteWithUndo = useCallback((card: CardData) => {
    // Optimistic remove
    setCards((prev) => prev.filter((c) => c.id !== card.id));

    const timer = setTimeout(async () => {
      pendingTimers.current.delete(`del-${card.id}`);
      try {
        await deleteCard(card.id);
      } catch {
        setCards((prev) => [...prev, card]);
        toast.error(t("deleteFailed"));
      }
    }, 5000);
    pendingTimers.current.set(`del-${card.id}`, timer);

    toast(t("cardDeleted"), {
      duration: 5000,
      action: {
        label: t("undo"),
        onClick: () => {
          clearTimeout(timer);
          pendingTimers.current.delete(`del-${card.id}`);
          setCards((prev) => [...prev, card].sort((a, b) => a.sortOrder - b.sortOrder));
        },
      },
    });
  }, [t]);

  const isAnonymous = (card: CardData) => card.authorId === ANONYMOUS_ID;

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
                <img src={author.image} alt="" width={18} height={18} className="rounded-full" />
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
                const anonymous = isAnonymous(card);
                const hasGuess = anonymous && card.guessedAuthor;
                const guessMatchesUser = hasGuess && allUsers.some((u) => u.name === card.guessedAuthor);

                return (
                  <Card
                    key={card.id}
                    className={`relative overflow-hidden ${card.isSkipped ? "opacity-60 border-dashed" : ""}`}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: anonymous ? "#9CA3AF" : card.authorColor }}
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

                          {/* Author line */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            {anonymous ? (
                              <>
                                {hasGuess ? (
                                  <>
                                    <span className="flex items-center gap-1 text-amber-500">
                                      <Bot className="h-3 w-3" aria-hidden="true" />
                                      {card.guessedAuthor}?
                                    </span>
                                    {guessMatchesUser && (
                                      <button
                                        type="button"
                                        onClick={() => handleConfirmGuess(card)}
                                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                                      >
                                        <Check className="h-3 w-3" aria-hidden="true" />
                                        {t("confirm")}
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">Anonymous</span>
                                )}
                                {changingCard === card.id ? (
                                  <select
                                    className="text-[10px] bg-transparent border border-input rounded px-1 py-0.5"
                                    defaultValue=""
                                    onChange={(e) => {
                                      if (e.target.value) handleAssign(card.id, e.target.value);
                                    }}
                                    onBlur={() => setChangingCard(null)}
                                  >
                                    <option value="" disabled>{t("assign")}…</option>
                                    {allUsers.map((u) => (
                                      <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setChangingCard(card.id)}
                                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted hover:bg-accent transition-colors"
                                  >
                                    <Pencil className="h-2.5 w-2.5" aria-hidden="true" />
                                    {hasGuess ? t("change") : t("assign")}
                                  </button>
                                )}
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => deleteWithUndo(card)}
                                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                  >
                                    <Trash2 className="h-2.5 w-2.5" aria-hidden="true" />
                                  </button>
                                )}
                              </>
                            ) : (
                              <>
                                {card.authorImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={card.authorImage} alt="" width={16} height={16} className="rounded-full" />
                                ) : (
                                  <span
                                    className="w-4 h-4 rounded-full shrink-0 inline-flex items-center justify-center text-[8px] font-bold text-white"
                                    style={{ backgroundColor: card.authorColor }}
                                  >
                                    {card.authorName.charAt(0)}
                                  </span>
                                )}
                                <span>{card.authorName}</span>
                                {isAdmin && (
                                  changingCard === card.id ? (
                                    <select
                                      autoFocus
                                      className="text-[10px] bg-transparent border border-input rounded px-1 py-0.5"
                                      defaultValue=""
                                      onChange={(e) => {
                                        if (e.target.value) handleAssign(card.id, e.target.value);
                                      }}
                                      onBlur={() => setChangingCard(null)}
                                    >
                                      <option value="" disabled>{t("change")}…</option>
                                      {allUsers.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setChangingCard(card.id)}
                                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted hover:bg-accent transition-colors"
                                    >
                                      <Pencil className="h-2.5 w-2.5" aria-hidden="true" />
                                    </button>
                                  )
                                )}
                              </>
                            )}

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
