import { describe, it, expect } from "vitest";
import { replaceEmojiShortcodes, searchEmoji, EMOJI_MAP } from "@/lib/emoji";

describe("emoji picker integration", () => {
  it("EMOJI_MAP has entries for search", () => {
    expect(Object.keys(EMOJI_MAP).length).toBeGreaterThan(50);
  });

  it("searchEmoji returns max 10 results", () => {
    // 'a' should match many codes
    const results = searchEmoji("a");
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("searchEmoji returns code and emoji", () => {
    const results = searchEmoji("fire");
    expect(results).toContainEqual({ code: "fire", emoji: "🔥" });
  });

  it("replaceEmojiShortcodes handles multiple in one string", () => {
    const result = replaceEmojiShortcodes(":fire: this is :rocket: great");
    expect(result).toBe("🔥 this is 🚀 great");
  });

  it("replaceEmojiShortcodes preserves unknown codes", () => {
    const result = replaceEmojiShortcodes(":unknown: text");
    expect(result).toBe(":unknown: text");
  });
});
