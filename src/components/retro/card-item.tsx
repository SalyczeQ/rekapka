"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { colorFromUserId } from "@/lib/colors";

interface CardItemProps {
  card: {
    id: string;
    text: string;
    author_id: string;
    group_label: string | null;
    is_discussed: boolean;
    carried_from_retro_id?: string | null;
  };
  isOwn?: boolean;
  showContent?: boolean;
  categoryColor?: string;
  voteCount?: number;
  hasVoted?: boolean;
  showVoting?: boolean;
  showDiscussed?: boolean;
  tags?: string[];
  onDelete?: () => void;
  onVote?: () => void;
  onToggleDiscussed?: () => void;
}

export function CardItem({
  card,
  isOwn,
  showContent = true,
  categoryColor,
  voteCount = 0,
  hasVoted,
  showVoting,
  showDiscussed,
  tags,
  onDelete,
  onVote,
  onToggleDiscussed,
}: CardItemProps) {
  const authorColor = colorFromUserId(card.author_id);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        card.is_discussed && "opacity-60",
        card.carried_from_retro_id && "ring-1 ring-amber-400/40"
      )}
    >
      {/* Author color left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: showContent ? authorColor : categoryColor }}
      />
      <CardContent className="py-2 px-3 pl-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {showContent ? (
              <p className="text-sm whitespace-pre-wrap break-words">
                {card.text}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Hidden card
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1 mt-1">
              {card.group_label && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1">
                  {card.group_label}
                </Badge>
              )}
              {tags &&
                tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px] h-4 px-1"
                  >
                    {tag}
                  </Badge>
                ))}
              {card.carried_from_retro_id && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600">
                  <ArrowRight className="h-2.5 w-2.5" />
                  carried over
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {showVoting && (
              <Button
                variant={hasVoted ? "default" : "outline"}
                size="sm"
                className="h-7 min-w-[40px] text-xs"
                onClick={onVote}
              >
                {voteCount}
              </Button>
            )}
            {showDiscussed && onToggleDiscussed && (
              <Button
                variant={card.is_discussed ? "default" : "outline"}
                size="icon"
                className="h-7 w-7"
                onClick={onToggleDiscussed}
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            {isOwn && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
