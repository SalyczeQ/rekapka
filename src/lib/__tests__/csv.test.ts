import { describe, it, expect } from "vitest";
import { exportCardsToCsv } from "@/lib/csv/export";
import { importCardsFromCsv } from "@/lib/csv/import";

describe("exportCardsToCsv", () => {
  it("exports cards with headers", () => {
    const cards = [
      {
        text: "Great teamwork",
        categoryName: "Glad",
        authorName: "Alice",
        groupLabel: "Team",
        isDiscussed: true,
        discussionDurationSec: 120,
        tags: ["team", "good"],
      },
    ];

    const csv = exportCardsToCsv(cards);
    const lines = csv.split("\n");

    expect(lines[0]).toBe(
      "Category,Text,Author,Group,Discussed,Discussion Time (sec),Tags"
    );
    expect(lines[1]).toContain("Glad");
    expect(lines[1]).toContain("Great teamwork");
    expect(lines[1]).toContain("Alice");
    expect(lines[1]).toContain("Yes");
    expect(lines[1]).toContain("120");
  });

  it("escapes commas in text", () => {
    const cards = [
      {
        text: "Hello, world",
        categoryName: "Mad",
        authorName: "Bob",
        groupLabel: null,
        isDiscussed: false,
        discussionDurationSec: null,
        tags: [],
      },
    ];

    const csv = exportCardsToCsv(cards);
    expect(csv).toContain('"Hello, world"');
  });

  it("handles empty array", () => {
    const csv = exportCardsToCsv([]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(1); // headers only
  });
});

describe("importCardsFromCsv", () => {
  it("imports cards from CSV", () => {
    const csv = `Category,Text,Author
Glad,Great teamwork,Alice
Mad,Too many meetings,Bob`;

    const cards = importCardsFromCsv(csv);
    expect(cards).toHaveLength(2);
    expect(cards[0]).toEqual({ category: "Glad", text: "Great teamwork" });
    expect(cards[1]).toEqual({ category: "Mad", text: "Too many meetings" });
  });

  it("handles quoted fields with commas", () => {
    const csv = `Category,Text
Mad,"Hello, world"`;

    const cards = importCardsFromCsv(csv);
    expect(cards[0].text).toBe("Hello, world");
  });

  it("returns empty for header-only CSV", () => {
    expect(importCardsFromCsv("Category,Text")).toEqual([]);
  });

  it("returns empty for empty string", () => {
    expect(importCardsFromCsv("")).toEqual([]);
  });
});
