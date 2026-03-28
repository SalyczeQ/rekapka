"use client";

import { useMemo } from "react";
import { getEmojiSuggestions } from "@/lib/emoji";

interface EmojiPickerProps {
  text: string;
  cursorPosition: number;
  onSelect: (emoji: string, startPos: number, endPos: number) => void;
}

export function EmojiPicker({
  text,
  cursorPosition,
  onSelect,
}: EmojiPickerProps) {
  const { suggestions, colonStart } = useMemo(() => {
    const before = text.slice(0, cursorPosition);
    const lastColon = before.lastIndexOf(":");
    if (lastColon === -1 || before.includes(" ", lastColon)) {
      return { suggestions: [] as { code: string; emoji: string }[], colonStart: -1 };
    }
    const query = before.slice(lastColon + 1);
    if (query.length < 1) {
      return { suggestions: [] as { code: string; emoji: string }[], colonStart: -1 };
    }
    return { suggestions: getEmojiSuggestions(query), colonStart: lastColon };
  }, [text, cursorPosition]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-1 bg-popover border rounded-md shadow-md p-1 z-50">
      {suggestions.map((s) => (
        <button
          key={s.code}
          type="button"
          className="flex items-center gap-2 w-full px-2 py-1 text-sm rounded hover:bg-accent text-left"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(s.emoji, colonStart, cursorPosition);
          }}
        >
          <span>{s.emoji}</span>
          <span className="text-muted-foreground">:{s.code}:</span>
        </button>
      ))}
    </div>
  );
}
