"use client";

import { useState } from "react";
import { createCard } from "@/lib/actions/retro-session";
import { vibrate } from "@/lib/haptics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { EmojiPicker } from "./emoji-picker";

import type { SerializedCard } from "@/types/serialized";

interface CardInputProps {
  retroId: string;
  categoryId: string;
  currentUser: { id: string; name: string; color: string; image: string | null };
  onCardAdded?: (card: SerializedCard) => void;
}

export function CardInput({ retroId, categoryId, currentUser, onCardAdded }: CardInputProps) {
  const t = useTranslations("card");
  const tErr = useTranslations("error");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("retroId", retroId);
      formData.set("categoryId", categoryId);
      formData.set("text", text);

      const card = await createCard(formData);
      if (card) {
        vibrate(20);
        setText("");
        onCardAdded?.({
          id: card.id,
          retroId: card.retroId,
          categoryId: card.categoryId,
          authorId: card.authorId,
          text: card.text,
          sortOrder: card.sortOrder,
          groupLabel: card.groupLabel,
          isDiscussed: card.isDiscussed,
          isSkipped: card.isSkipped,
          discussionNotes: card.discussionNotes,
          discussionStartedAt: card.discussionStartedAt ? String(card.discussionStartedAt) : null,
          discussionEndedAt: card.discussionEndedAt ? String(card.discussionEndedAt) : null,
          discussionDurationSec: card.discussionDurationSec,
          carriedFromRetroId: card.carriedFromRetroId,
          createdAt: String(card.createdAt),
          updatedAt: String(card.updatedAt),
          authorName: currentUser.name,
          authorColor: currentUser.color,
          authorImage: currentUser.image,
        });
      }
    } catch {
      toast.error(tErr("failedAddCard"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Textarea
          placeholder={t("addCard")}
          aria-label={t("addCard")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="min-h-[60px] resize-none pr-10"
        />
        <div className="absolute right-1 bottom-1">
          <EmojiPicker onSelect={(emoji) => setText((t) => t + emoji)} />
        </div>
      </div>
      <Button
        size="icon"
        onClick={handleSubmit}
        disabled={!text.trim() || isSubmitting}
        className="self-end"
        aria-label="Send card"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
