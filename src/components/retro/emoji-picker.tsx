"use client";

import { useState, useEffect, useRef } from "react";
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
  const [suggestions, setSuggestions] = useState<
    { code: string; emoji: string }[]
  >([]);
  const [colonStart, setColonStart] = useState(-1);

  useEffect(() => {
    // Find if we're in a :shortcode: context
    const before = text.slice(0, cursorPosition);
    const lastColon = before.lastIndexOf(":");
    if (lastColon === -1 || before.includes(" ", lastColon)) {
      setSuggestions([]);
      setColonStart(-1);
      return;
    }

    const query = before.slice(lastColon + 1);
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    setColonStart(lastColon);
    setSuggestions(getEmojiSuggestions(query));
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
