"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { SerializedRetro, SerializedCategory, SerializedCard } from "@/types/serialized";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardInput } from "./card-input";
import { CardItem } from "./card-item";
import { AiGroupButton } from "./ai-group-button";
import { AiReadButton } from "./ai-read-button";
import { useSwipe } from "@/hooks/use-swipe";

interface PhaseWritingProps {
  retro: SerializedRetro;
  categories: SerializedCategory[];
  cards: SerializedCard[];
  currentUserId: string;
  currentUser: { id: string; name: string; color: string; image: string | null };
  onCardsChange: (cards: SerializedCard[]) => void;
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
  dictationEnabled,
}: {
  category: SerializedCategory;
  cards: SerializedCard[];
  retroId: string;
  currentUserId: string;
  currentUser: { id: string; name: string; color: string; image: string | null };
  dictationEnabled?: boolean;
  onCardAdded: (card: SerializedCard) => void;
  onCardDeleted: (cardId: string) => void;
  onCardUpdated: (cardId: string, changes: Partial<SerializedCard>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {category.icon && <span>{category.icon}</span>}
        <h3 className="font-medium">{category.name}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          ({cards.length})
        </span>
      </div>

      <CardInput
        retroId={retroId}
        categoryId={category.id}
        currentUser={currentUser}
        onCardAdded={onCardAdded}
        dictationEnabled={dictationEnabled}
      />

      <div className="space-y-2">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isOwn={card.authorId === currentUserId}
            showContent={card.authorId === currentUserId}
            editable={card.authorId === currentUserId}
            onDelete={onCardDeleted}
            onUpdate={onCardUpdated}
          />
        ))}
      </div>
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

  const myCardCount = cards.filter((c) => c.authorId === currentUserId).length;
  const othersCount = cards.filter((c) => c.authorId !== currentUserId).length;

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{t("yourCards", { count: myCardCount })}</span>
          {othersCount > 0 && (
            <span>{t("othersCards", { count: othersCount })}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <AiGroupButton retroId={retro.id} cards={cards} onCardsChange={onCardsChange} />
          <AiReadButton retroId={retro.id} cardCount={cards.length} />
        </div>
      </div>

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
            <TabsContent key={cat.id} value={cat.id} className="space-y-3 mt-4">
              <CardInput
                retroId={retro.id}
                categoryId={cat.id}
                currentUser={currentUser}
                onCardAdded={handleCardAdded}
                dictationEnabled={dictationEnabled}
              />

              <div className="space-y-2">
                {cardsByCategory(cat.id).map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    isOwn={card.authorId === currentUserId}
                    showContent={card.authorId === currentUserId}
                    editable={card.authorId === currentUserId}
                    onDelete={handleCardDeleted}
                    onUpdate={handleCardUpdated}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
