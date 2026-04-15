"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { SerializedRetro, SerializedCategory, SerializedCard } from "@/types/serialized";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CardInput } from "./card-input";
import { CardItem } from "./card-item";
import { useSwipe } from "@/hooks/use-swipe";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface PhaseWritingProps {
  retro: SerializedRetro;
  categories: SerializedCategory[];
  cards: SerializedCard[];
  currentUserId: string;
  currentUser: { id: string; name: string; color: string; image: string | null };
  onCardsChange: (cards: SerializedCard[]) => void;
  imageUrls?: Record<string, string>;
  onImageUploaded?: (cardId: string, url: string) => void;
  dictationEnabled?: boolean;
}

function CategoryColumn({
  category,
  cards,
  retroId,
  currentUserId,
  currentUser,
  onCardAdded,
  onCardDeleted,
  onCardUpdated,
  imageUrls,
  onImageUploaded,
  dictationEnabled,
}: {
  category: SerializedCategory;
  cards: SerializedCard[];
  retroId: string;
  currentUserId: string;
  currentUser: { id: string; name: string; color: string; image: string | null };
  dictationEnabled?: boolean;
  imageUrls?: Record<string, string>;
  onImageUploaded?: (cardId: string, url: string) => void;
  onCardAdded: (card: SerializedCard) => void;
  onCardDeleted: (cardId: string) => void;
  onCardUpdated: (cardId: string, changes: Partial<SerializedCard>) => void;
}) {
  const t = useTranslations("card");
  const bgColor = category.color ? hexToRgba(category.color, 0.06) : undefined;
  const borderColor = category.color ? hexToRgba(category.color, 0.15) : undefined;
  const [myCardsExpanded, setMyCardsExpanded] = useState(false);

  const myCards = [...cards.filter((c) => c.authorId === currentUserId)].reverse();
  const othersCards = cards.filter((c) => c.authorId !== currentUserId);

  // Group others' cards by author
  const othersByAuthor = Object.values(
    othersCards.reduce<Record<string, { name: string; color: string; count: number }>>(
      (acc, card) => {
        if (!acc[card.authorId]) {
          acc[card.authorId] = { name: card.authorName, color: card.authorColor, count: 0 };
        }
        acc[card.authorId].count++;
        return acc;
      },
      {}
    )
  );

  return (
    <div
      className="space-y-3 rounded-xl border p-4"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {category.icon && <span>{category.icon}</span>}
          <h3 className="font-medium">{category.name}</h3>
          <span className="text-xs text-muted-foreground tabular-nums">
            ({cards.length})
          </span>
        </div>

        {/* Others' activity — presence badges */}
        {othersByAuthor.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {othersByAuthor.map((author) => (
              <div
                key={author.name}
                className="flex items-center gap-1.5 rounded-full px-2 py-0.5 border"
                style={{
                  borderColor: hexToRgba(author.color, 0.3),
                  backgroundColor: hexToRgba(author.color, 0.08),
                }}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0 animate-pulse"
                  style={{ backgroundColor: author.color }}
                />
                <span className="text-[11px] font-medium" style={{ color: author.color }}>
                  {author.name.split(" ")[0]}
                </span>
                <span className="text-[10px] font-bold tabular-nums bg-background/60 rounded-full px-1">
                  {author.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <CardInput
        retroId={retroId}
        categoryId={category.id}
        currentUser={currentUser}
        onCardAdded={onCardAdded}
        onImageUploaded={onImageUploaded}
        dictationEnabled={dictationEnabled}
      />

      {myCards.length > 0 && (
        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground justify-between"
            onClick={() => setMyCardsExpanded(!myCardsExpanded)}
          >
            <span>{t("myCards", { count: myCards.length })}</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${myCardsExpanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </Button>

          {/* Collapsed: stacked card deck preview */}
          {!myCardsExpanded && (
            <button
              type="button"
              className="relative w-full mt-2 cursor-pointer"
              style={{ height: `${Math.min(myCards.length, 3) * 8 + 40}px` }}
              onClick={() => setMyCardsExpanded(true)}
              aria-label={t("myCards", { count: myCards.length })}
            >
              {myCards.slice(0, 3).map((card, i) => (
                <div
                  key={card.id}
                  className="absolute rounded-lg border bg-card shadow-sm transition-all duration-300"
                  style={{
                    top: `${i * 8}px`,
                    left: `${i * 4}px`,
                    right: `${i * 4}px`,
                    opacity: 1 - i * 0.2,
                    zIndex: 3 - i,
                  }}
                >
                  <div className="flex items-center gap-2 px-3 py-2.5 overflow-hidden">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: card.authorColor }}
                    />
                    <p className="text-xs truncate text-muted-foreground">{card.text}</p>
                  </div>
                </div>
              ))}
            </button>
          )}

          {/* Expanded: full card list with smooth animation */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: myCardsExpanded ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="space-y-2 mt-2">
                {myCards.map((card, i) => (
                  <div
                    key={card.id}
                    className="animate-in fade-in slide-in-from-top-2"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
                  >
                    <CardItem
                      card={card}
                      isOwn
                      showContent
                      editable
                      imageUrl={imageUrls?.[card.id]}
                      onDelete={onCardDeleted}
                      onUpdate={onCardUpdated}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PhaseWriting({
  retro,
  categories,
  cards,
  currentUserId,
  currentUser,
  onCardsChange,
  imageUrls,
  onImageUploaded,
  dictationEnabled = true,
}: PhaseWritingProps) {
  const t = useTranslations("card");
  const [activeTab, setActiveTab] = useState(categories[0]?.id ?? "");

  const currentTabIndex = categories.findIndex((c) => c.id === activeTab);
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (currentTabIndex < categories.length - 1) {
        setActiveTab(categories[currentTabIndex + 1].id);
      }
    },
    onSwipeRight: () => {
      if (currentTabIndex > 0) {
        setActiveTab(categories[currentTabIndex - 1].id);
      }
    },
  });

  const cardsByCategory = (categoryId: string) =>
    cards.filter((c) => c.categoryId === categoryId);

  const handleCardAdded = (card: SerializedCard) => {
    onCardsChange([...cards, card]);
  };

  const handleCardDeleted = (cardId: string) => {
    onCardsChange(cards.filter((c) => c.id !== cardId));
  };

  const handleCardUpdated = (cardId: string, changes: Partial<SerializedCard>) => {
    onCardsChange(cards.map((c) => (c.id === cardId ? { ...c, ...changes } : c)));
  };

  return (
    <div className="space-y-4">
      {/* Desktop: 3-column layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        {categories.map((cat) => (
          <CategoryColumn
            key={cat.id}
            category={cat}
            cards={cardsByCategory(cat.id)}
            retroId={retro.id}
            currentUserId={currentUserId}
            currentUser={currentUser}
            onCardAdded={handleCardAdded}
            onCardDeleted={handleCardDeleted}
            onCardUpdated={handleCardUpdated}
            imageUrls={imageUrls}
            onImageUploaded={onImageUploaded}
            dictationEnabled={dictationEnabled}
          />
        ))}
      </div>

      {/* Mobile: tabs with swipe */}
      <div className="md:hidden" style={{ touchAction: "manipulation" }}>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)} {...swipeHandlers}>
          <TabsList className="w-full">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="flex-1">
                {cat.name} (<span className="tabular-nums">{cardsByCategory(cat.id).length}</span>)
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-4">
              <CategoryColumn
                category={cat}
                cards={cardsByCategory(cat.id)}
                retroId={retro.id}
                currentUserId={currentUserId}
                currentUser={currentUser}
                onCardAdded={handleCardAdded}
                onCardDeleted={handleCardDeleted}
                onCardUpdated={handleCardUpdated}
                imageUrls={imageUrls}
                onImageUploaded={onImageUploaded}
                dictationEnabled={dictationEnabled}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
