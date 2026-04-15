"use client";

import { useState, useRef } from "react";
import { createCard } from "@/lib/actions/retro-session";
import { vibrate } from "@/lib/haptics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { EmojiPicker } from "./emoji-picker";
import { DictationButton } from "./dictation-button";

import type { SerializedCard } from "@/types/serialized";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

interface CardInputProps {
  retroId: string;
  categoryId: string;
  currentUser: { id: string; name: string; color: string; image: string | null };
  onCardAdded?: (card: SerializedCard) => void;
  onImageUploaded?: (cardId: string, url: string) => void;
  dictationEnabled?: boolean;
}

export function CardInput({ retroId, categoryId, currentUser, onCardAdded, onImageUploaded, dictationEnabled = true }: CardInputProps) {
  const t = useTranslations("card");
  const tErr = useTranslations("error");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreview, setStagedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("photoTooLarge"));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("photoTooLarge"));
      return;
    }

    setStagedFile(file);
    setStagedPreview(URL.createObjectURL(file));

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearStagedFile() {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);
    setStagedFile(null);
    setStagedPreview(null);
  }

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

        // Upload photo if staged
        if (stagedFile) {
          const previewUrl = stagedPreview;
          const photoFd = new FormData();
          photoFd.set("file", stagedFile);
          try {
            const res = await fetch(`/api/cards/${card.id}/photo`, { method: "POST", body: photoFd });
            if (res.ok && previewUrl) {
              onImageUploaded?.(card.id, previewUrl);
            }
          } catch {
            toast.error(tErr("failedAddCard"));
          }
          // Don't revoke the preview URL yet — it's being used as thumbnail
          setStagedFile(null);
          setStagedPreview(null);
        }

        onCardAdded?.({
          id: card.id,
          retroId: card.retroId,
          categoryId: card.categoryId,
          authorId: card.authorId,
          text: card.text,
          imageKey: card.imageKey,
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
    <div className="space-y-2">
      <div className="relative">
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
          className="min-h-[60px] resize-none pr-24"
        />
        <div className="absolute right-1 bottom-1 flex items-center gap-0.5">
          <DictationButton enabled={dictationEnabled} onTranscript={(t) => setText((prev) => prev + (prev ? " " : "") + t)} />
          <EmojiPicker onSelect={(emoji) => setText((t) => t + emoji)} />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => fileInputRef.current?.click()}
            aria-label={t("attachPhoto")}
          >
            <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {stagedPreview && (
        <div className="relative inline-block">
          <img
            src={stagedPreview}
            alt="Staged photo"
            className="h-16 w-auto rounded-md border border-border object-cover"
          />
          <button
            type="button"
            className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive text-destructive-foreground p-0.5"
            onClick={clearStagedFile}
            aria-label={t("removePhoto")}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!text.trim() || isSubmitting}
        className="w-full"
        aria-label="Send card"
      >
        <Send className="h-4 w-4 mr-2" aria-hidden="true" />
        {t("sendCard")}
      </Button>
    </div>
  );
}
