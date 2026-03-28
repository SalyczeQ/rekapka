"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardItem } from "./card-item";
import { CardInput } from "./card-input";
import { Plus } from "lucide-react";

interface PhaseWritingProps {
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
  currentUserId: string;
  status: string;
  onAddCard: (categoryId: string, text: string) => Promise<void>;
  onDeleteCard: (cardId: string) => Promise<void>;
}

export function PhaseWriting({
  categories,
  cards,
  currentUserId,
  status,
  onAddCard,
  onDeleteCard,
}: PhaseWritingProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const categoryCards = cards.filter(
          (c) => c.category_id === category.id
        );
        const myCards = categoryCards.filter(
          (c) => c.author_id === currentUserId
        );
        const othersCardCount = categoryCards.length - myCards.length;

        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3
                className="text-sm font-medium flex items-center gap-1"
                style={{ color: category.color ?? undefined }}
              >
                <span>{category.icon}</span>
                {category.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                {myCards.length} yours
                {othersCardCount > 0 && ` + ${othersCardCount} others`}
              </span>
            </div>

            <div className="space-y-2">
              {myCards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  isOwn
                  showContent
                  onDelete={() => onDeleteCard(card.id)}
                  categoryColor={category.color ?? undefined}
                />
              ))}
            </div>

            {status === "writing" && (
              <>
                {activeCategory === category.id ? (
                  <CardInput
                    placeholder={`Add a ${category.name.toLowerCase()} card...`}
                    onSubmit={(text) => onAddCard(category.id, text)}
                    onCancel={() => setActiveCategory(null)}
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add card
                  </Button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
