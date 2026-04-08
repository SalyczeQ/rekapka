"use client";

import { cn } from "@/lib/utils";
import { deleteCard, updateCard } from "@/lib/actions/retro-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Eye, EyeOff, Pencil, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { vibrate } from "@/lib/haptics";
import { ReadAloudButton } from "./read-aloud-button";

interface CardItemProps {
  card: {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    authorColor: string;
    groupLabel: string | null;
    isDiscussed: boolean;
    isSkipped?: boolean;
  };
  isOwn: boolean;
  showContent: boolean;
  blurred?: boolean;
  editable?: boolean;
  onDelete?: (cardId: string) => void;
  onUpdate?: (cardId: string, changes: { text: string }) => void;
  onReveal?: () => void;
}

export function CardItem({
  card,
  isOwn,
  showContent,
  blurred = false,
  editable = false,
  onDelete,
  onUpdate,
  onReveal,
}: CardItemProps) {
  const t = useTranslations();
  const [revealed, setRevealed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(card.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isBlurred = blurred && !revealed;

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [editing]);

  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCard(card.id);
      vibrate([40, 30, 40]);
      onDelete?.(card.id);
    } catch {
      toast.error(t("error.failedDeleteCard"));
      setDeleting(false);
    }
  }

  async function handleSaveEdit() {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === card.text) {
      setEditing(false);
      setEditText(card.text);
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("text", trimmed);
      await updateCard(card.id, formData);
      onUpdate?.(card.id, { text: trimmed });
      setEditing(false);
    } catch {
      toast.error(t("error.failedSaveCard"));
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditing(false);
    setEditText(card.text);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200",
        card.isDiscussed && "opacity-60",
        card.isSkipped && "opacity-50 border-dashed"
      )}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: card.authorColor }}
      />
      <CardContent className="pl-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {card.groupLabel && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded mb-1 inline-block">
                {card.groupLabel}
              </span>
            )}
            {card.isSkipped && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded mb-1 inline-block ml-1">
                {t("card.skipped")}
              </span>
            )}

            {editing ? (
              <div className="space-y-2">
                <textarea
                  ref={textareaRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="w-full text-sm bg-transparent border border-input rounded-md px-2 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleSaveEdit}
                    aria-label="Save edit"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCancelEdit}
                    aria-label="Cancel edit"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className={cn(
                    "text-sm whitespace-pre-wrap leading-relaxed transition-[filter] duration-300",
                    isBlurred && "blur-md select-none cursor-pointer"
                  )}
                  onClick={() => {
                    if (isBlurred) {
                      setRevealed(true);
                      onReveal?.();
                    }
                  }}
                >
                  {showContent || revealed ? card.text : t("card.hiddenCard")}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {card.authorName}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {(showContent || revealed) && !editing && (
              <ReadAloudButton text={card.text} className="h-7 w-7" />
            )}
            {blurred && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setRevealed(!revealed)}
                aria-label={revealed ? "Hide card text" : "Reveal card text"}
              >
                {revealed ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </Button>
            )}
            {isOwn && editable && !editing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setEditText(card.text);
                  setEditing(true);
                }}
                aria-label="Edit card"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            )}
            {isOwn && onDelete && !editing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={handleDelete}
                disabled={deleting}
                aria-label="Delete card"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
