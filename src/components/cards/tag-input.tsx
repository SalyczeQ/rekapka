"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  teamId: string;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

interface TagSuggestion {
  id: string;
  name: string;
  usage_count: number;
}

export function TagInput({ teamId, selectedTags, onTagsChange }: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const supabase = createClient();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("tags")
        .select("id, name, usage_count")
        .eq("team_id", teamId)
        .ilike("name", `%${input}%`)
        .order("usage_count", { ascending: false })
        .limit(5);
      setSuggestions(data ?? []);
    }, 200);

    return () => clearTimeout(timer);
  }, [input, teamId, supabase]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addTag(tag: string) {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !selectedTags.includes(normalized)) {
      onTagsChange([...selectedTags, normalized]);
    }
    setInput("");
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-wrap gap-1 mb-1">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            e.preventDefault();
            addTag(input);
          }
        }}
        placeholder="Add tag..."
        className="h-7 text-xs"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md p-1 z-50">
          {suggestions
            .filter((s) => !selectedTags.includes(s.name.toLowerCase()))
            .map((s) => (
              <button
                key={s.id}
                type="button"
                className="flex items-center justify-between w-full px-2 py-1 text-xs rounded hover:bg-accent text-left"
                onClick={() => addTag(s.name)}
              >
                <span>{s.name}</span>
                <span className="text-muted-foreground">
                  {s.usage_count} uses
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
