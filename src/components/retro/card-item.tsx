"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, ArrowRight, Pencil, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { colorFromUserId } from "@/lib/colors";

interface CardItemProps {
  card: {
    id: string;
    text: string;
    author_id: string;
    group_label: string | null;
    is_discussed: boolean;
    discussion_notes?: string | null;
    carried_from_retro_id?: string | null;
  };
  isOwn?: boolean;
  showContent?: boolean;
  categoryColor?: string;
  voteCount?: number;
  hasVoted?: boolean;
  showVoting?: boolean;
  showDiscussed?: boolean;
  showNotes?: boolean;
  isGroupingPhase?: boolean;
  tags?: string[];
  onDelete?: () => void;
  onEdit?: (text: string) => Promise<void>;
  onVote?: () => void;
  onToggleDiscussed?: () => void;
  onEditNotes?: (notes: string) => Promise<void>;
  onEditGroupLabel?: (label: string) => Promise<void>;
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
  showNotes,
  isGroupingPhase,
  tags,
  onDelete,
  onEdit,
  onVote,
  onToggleDiscussed,
  onEditNotes,
  onEditGroupLabel,
}: CardItemProps) {
  const authorColor = colorFromUserId(card.author_id);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(card.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [votePending, startVoteTransition] = useTransition();
  const [discussedPending, startDiscussedTransition] = useTransition();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [notesText, setNotesText] = useState(card.discussion_notes ?? "");
  const [editingGroupLabel, setEditingGroupLabel] = useState(false);
  const [groupLabelText, setGroupLabelText] = useState(card.group_label ?? "");
  const notesTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [editing]);

  const handleEditSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === card.text) {
      setEditText(card.text);
      setEditing(false);
      return;
    }
    await onEdit?.(trimmed);
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === "Escape") {
      setEditText(card.text);
      setEditing(false);
    }
  };

  const handleNotesChange = (value: string) => {
    setNotesText(value);
    if (notesTimeoutRef.current) clearTimeout(notesTimeoutRef.current);
    notesTimeoutRef.current = setTimeout(() => {
      onEditNotes?.(value);
    }, 800);
  };

  const handleGroupLabelSave = () => {
    setEditingGroupLabel(false);
    onEditGroupLabel?.(groupLabelText.trim());
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-150 hover:shadow-md",
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
          <div
            className={cn("flex-1 min-w-0", showNotes && onEditNotes && "cursor-pointer")}
            onClick={() => {
              if (showNotes && onEditNotes && !editing) {
                setNotesExpanded((prev) => !prev);
              }
            }}
          >
            {showContent && editing ? (
              <textarea
                ref={textareaRef}
                className="w-full text-sm bg-transparent resize-none outline-none border-b border-primary"
                value={editText}
                rows={2}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleEditSave}
              />
            ) : showContent ? (
              <p
                className={cn("text-sm whitespace-pre-wrap break-words", onEdit && "cursor-text")}
                onClick={(e) => {
                  if (onEdit) {
                    e.stopPropagation();
                    setEditing(true);
                  }
                }}
              >
                {card.text}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Hidden card
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1 mt-1">
              {card.group_label && !editingGroupLabel && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] h-4 px-1",
                    isGroupingPhase && onEditGroupLabel && "cursor-pointer hover:bg-secondary/80"
                  )}
                  onClick={(e) => {
                    if (isGroupingPhase && onEditGroupLabel) {
                      e.stopPropagation();
                      setEditingGroupLabel(true);
                    }
                  }}
                >
                  {card.group_label}
                </Badge>
              )}
              {editingGroupLabel && (
                <input
                  className="text-[10px] h-4 px-1 bg-secondary rounded border border-input outline-none w-24"
                  value={groupLabelText}
                  onChange={(e) => setGroupLabelText(e.target.value)}
                  onBlur={handleGroupLabelSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGroupLabelSave();
                    if (e.key === "Escape") setEditingGroupLabel(false);
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
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
                className="h-9 min-w-[48px] text-sm"
                disabled={votePending}
                onClick={() => startVoteTransition(() => { onVote?.() })}
              >
                {votePending ? <Loader2 className="h-4 w-4 animate-spin" /> : voteCount}
              </Button>
            )}
            {showDiscussed && onToggleDiscussed && (
              <Button
                variant={card.is_discussed ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                disabled={discussedPending}
                onClick={() => startDiscussedTransition(() => { onToggleDiscussed?.() })}
              >
                {discussedPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
            )}
            {isOwn && onEdit && !editing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-3 w-3" />
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

        {/* Discussion notes expandable area */}
        {showNotes && onEditNotes && notesExpanded && (
          <div className="mt-2 pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
            <textarea
              className="w-full text-xs bg-muted/50 rounded p-2 resize-none outline-none placeholder:text-muted-foreground/60"
              placeholder="Add discussion notes..."
              rows={2}
              value={notesText}
              onChange={(e) => handleNotesChange(e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
