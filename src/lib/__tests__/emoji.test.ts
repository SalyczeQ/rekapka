import { describe, it, expect } from "vitest";
import { replaceEmojiShortcodes, searchEmoji } from "@/lib/emoji";

describe("replaceEmojiShortcodes", () => {
  it("replaces known shortcodes", () => {
    expect(replaceEmojiShortcodes(":smile:")).toBe("😊");
    expect(replaceEmojiShortcodes(":fire:")).toBe("🔥");
    expect(replaceEmojiShortcodes(":rocket:")).toBe("🚀");
  });

  it("replaces multiple shortcodes in text", () => {
    expect(replaceEmojiShortcodes("Hello :smile: world :fire:")).toBe(
      "Hello 😊 world 🔥"
    );
  });

  it("leaves unknown shortcodes unchanged", () => {
    expect(replaceEmojiShortcodes(":unknown:")).toBe(":unknown:");
  });

  it("handles text without shortcodes", () => {
    expect(replaceEmojiShortcodes("Hello world")).toBe("Hello world");
  });

  it("handles empty string", () => {
    expect(replaceEmojiShortcodes("")).toBe("");
  });

  it("handles shortcodes at boundaries", () => {
    expect(replaceEmojiShortcodes(":heart:text:star:")).toBe("❤️text⭐");
  });
});

describe("searchEmoji", () => {
  it("returns matching emoji", () => {
    const results = searchEmoji("smi");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe("smile");
    expect(results[0].emoji).toBe("😊");
  });

  it("returns empty for no match", () => {
    expect(searchEmoji("zzzzz")).toEqual([]);
  });

  it("limits results to 10", () => {
    const results = searchEmoji("a");
    expect(results.length).toBeLessThanOrEqual(10);
  });
});
