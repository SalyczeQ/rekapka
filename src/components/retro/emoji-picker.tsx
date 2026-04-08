"use client";

import { useState, useRef, useEffect } from "react";
import { EMOJI_MAP, searchEmoji } from "@/lib/emoji";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const emojis = search
    ? searchEmoji(search)
    : Object.entries(EMOJI_MAP).map(([code, emoji]) => ({ code, emoji }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Open emoji picker" />}
      >
        <Smile className="h-4 w-4" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <Input
          ref={inputRef}
          placeholder="Search emoji…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 h-8 text-sm"
        />
        <div className="grid grid-cols-8 gap-1 max-h-40 overflow-auto">
          {emojis.map(({ code, emoji }) => (
            <button
              key={code}
              type="button"
              className="text-lg hover:bg-accent rounded p-1 text-center leading-none"
              title={`:${code}:`}
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
                setSearch("");
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
