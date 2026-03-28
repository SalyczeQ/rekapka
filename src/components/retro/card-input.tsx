"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./emoji-picker";
import { replaceEmojiShortcodes } from "@/lib/emoji";
import { Send } from "lucide-react";

interface CardInputProps {
  placeholder?: string;
  onSubmit: (text: string) => Promise<void>;
  onCancel: () => void;
}

export function CardInput({ placeholder, onSubmit, onCancel }: CardInputProps) {
  const [text, setText] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    const processed = replaceEmojiShortcodes(text.trim());
    if (!processed) return;
    setSubmitting(true);
    await onSubmit(processed);
    setText("");
    setSubmitting(false);
    textareaRef.current?.focus();
  }

  function handleEmojiSelect(emoji: string, start: number, end: number) {
    const before = text.slice(0, start);
    const after = text.slice(end);
    const newText = before + emoji + after;
    setText(newText);
    const newPos = start + emoji.length;
    setCursorPos(newPos);
    setTimeout(() => {
      textareaRef.current?.setSelectionRange(newPos, newPos);
      textareaRef.current?.focus();
    }, 0);
  }

  return (
    <div className="relative">
      <EmojiPicker
        text={text}
        cursorPosition={cursorPos}
        onSelect={handleEmojiSelect}
      />
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setCursorPos(e.target.selectionStart ?? 0);
          }}
          onSelect={(e) =>
            setCursorPos((e.target as HTMLTextAreaElement).selectionStart ?? 0)
          }
          placeholder={placeholder}
          className="min-h-[60px] text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          autoFocus
        />
        <div className="flex flex-col gap-1">
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="h-8 w-8"
          >
            <Send className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onCancel}
            className="h-8 w-8 text-xs"
          >
            ✕
          </Button>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">
        Type :emoji: for shortcodes. Shift+Enter for new line.
      </p>
    </div>
  );
}
