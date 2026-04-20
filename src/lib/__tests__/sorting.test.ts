import { describe, it, expect } from "vitest";
import { fairSort, groupAwareSort, getGroupBoundaries } from "@/lib/sorting";

function makeCard(id: string, authorId: string, createdAt: Date) {
  return { id, authorId, createdAt };
}

function makeGroupCard(
  id: string,
  authorId: string,
  createdAt: Date,
  groupLabel: string | null
) {
  return { id, authorId, createdAt, groupLabel };
}

describe("fairSort", () => {
  it("returns empty array for empty input", () => {
    expect(fairSort([])).toEqual([]);
  });

  it("returns single card unchanged", () => {
    const cards = [makeCard("1", "a", new Date("2024-01-01"))];
    expect(fairSort(cards)).toEqual(cards);
  });

  it("interleaves cards from two authors", () => {
    const cards = [
      makeCard("a1", "a", new Date("2024-01-01")),
      makeCard("a2", "a", new Date("2024-01-02")),
      makeCard("b1", "b", new Date("2024-01-01")),
    ];
    const sorted = fairSort(cards);
    // a has 2 cards, b has 1 → a first in round-robin
    expect(sorted.map((c) => c.id)).toEqual(["a1", "b1", "a2"]);
  });

  it("interleaves cards from three authors", () => {
    const cards = [
      makeCard("a1", "a", new Date("2024-01-01")),
      makeCard("a2", "a", new Date("2024-01-02")),
      makeCard("a3", "a", new Date("2024-01-03")),
      makeCard("b1", "b", new Date("2024-01-01")),
      makeCard("b2", "b", new Date("2024-01-02")),
      makeCard("c1", "c", new Date("2024-01-01")),
      makeCard("c2", "c", new Date("2024-01-02")),
      makeCard("c3", "c", new Date("2024-01-03")),
      makeCard("c4", "c", new Date("2024-01-04")),
    ];
    const sorted = fairSort(cards);

    // c has 4, a has 3, b has 2 → round-robin: c, a, b, c, a, b, c, a, c
    expect(sorted.map((c) => c.id)).toEqual([
      "c1", "a1", "b1",
      "c2", "a2", "b2",
      "c3", "a3",
      "c4",
    ]);
  });

  it("sorts within author by createdAt", () => {
    const cards = [
      makeCard("a2", "a", new Date("2024-01-03")),
      makeCard("a1", "a", new Date("2024-01-01")),
      makeCard("b1", "b", new Date("2024-01-02")),
    ];
    const sorted = fairSort(cards);
    // a has 2 cards, b has 1
    expect(sorted.map((c) => c.id)).toEqual(["a1", "b1", "a2"]);
  });

  it("handles all cards from same author", () => {
    const cards = [
      makeCard("1", "a", new Date("2024-01-01")),
      makeCard("2", "a", new Date("2024-01-02")),
      makeCard("3", "a", new Date("2024-01-03")),
    ];
    const sorted = fairSort(cards);
    expect(sorted.map((c) => c.id)).toEqual(["1", "2", "3"]);
  });
});

describe("groupAwareSort", () => {
  it("returns empty array for empty input", () => {
    expect(groupAwareSort([])).toEqual([]);
  });

  it("falls back to fairSort when no cards have groups", () => {
    const cards = [
      makeGroupCard("a1", "a", new Date("2024-01-01"), null),
      makeGroupCard("a2", "a", new Date("2024-01-02"), null),
      makeGroupCard("b1", "b", new Date("2024-01-01"), null),
    ];
    const sorted = groupAwareSort(cards);
    const fairSorted = fairSort(cards);
    expect(sorted.map((c) => c.id)).toEqual(fairSorted.map((c) => c.id));
  });

  it("groups cards by label, fairSort within each group", () => {
    const cards = [
      makeGroupCard("a1", "a", new Date("2024-01-01"), "Tech Debt"),
      makeGroupCard("b1", "b", new Date("2024-01-01"), "Tech Debt"),
      makeGroupCard("a2", "a", new Date("2024-01-02"), "Communication"),
      makeGroupCard("b2", "b", new Date("2024-01-02"), "Communication"),
      makeGroupCard("c1", "c", new Date("2024-01-01"), "Communication"),
    ];
    const sorted = groupAwareSort(cards);
    // Communication has 3 cards (larger), Tech Debt has 2
    // Communication: fairSort → c1, a2, b2  (c has 1, a has 1, b has 1 — sorted by count desc then alphabetical)
    // Tech Debt: fairSort → a1, b1
    expect(sorted.map((c) => c.id)).toEqual(["a2", "b2", "c1", "a1", "b1"]);
  });

  it("puts ungrouped cards after grouped ones", () => {
    const cards = [
      makeGroupCard("g1", "a", new Date("2024-01-01"), "Theme A"),
      makeGroupCard("g2", "b", new Date("2024-01-01"), "Theme A"),
      makeGroupCard("u1", "a", new Date("2024-01-02"), null),
      makeGroupCard("u2", "c", new Date("2024-01-01"), null),
    ];
    const sorted = groupAwareSort(cards);
    // Grouped first (Theme A: g1, g2), then ungrouped (u1, u2)
    expect(sorted.map((c) => c.id)).toEqual(["g1", "g2", "u1", "u2"]);
  });

  it("sorts groups by size descending, alphabetical tiebreaker", () => {
    const cards = [
      makeGroupCard("z1", "a", new Date("2024-01-01"), "Zebra"),
      makeGroupCard("z2", "b", new Date("2024-01-01"), "Zebra"),
      makeGroupCard("a1", "a", new Date("2024-01-02"), "Alpha"),
      makeGroupCard("a2", "b", new Date("2024-01-02"), "Alpha"),
    ];
    const sorted = groupAwareSort(cards);
    // Same size (2 each) → alphabetical: Alpha first, then Zebra
    expect(sorted.map((c) => c.id)).toEqual(["a1", "a2", "z1", "z2"]);
  });

  it("handles single-card groups", () => {
    const cards = [
      makeGroupCard("1", "a", new Date("2024-01-01"), "Solo"),
      makeGroupCard("2", "b", new Date("2024-01-01"), "Pair"),
      makeGroupCard("3", "c", new Date("2024-01-01"), "Pair"),
    ];
    const sorted = groupAwareSort(cards);
    // Pair (2 cards) first, then Solo (1 card)
    expect(sorted.map((c) => c.id)).toEqual(["2", "3", "1"]);
  });
});

describe("getGroupBoundaries", () => {
  it("returns empty for empty input", () => {
    expect(getGroupBoundaries([])).toEqual([]);
  });

  it("returns correct boundaries for grouped cards", () => {
    const cards = [
      makeGroupCard("1", "a", new Date("2024-01-01"), "Group A"),
      makeGroupCard("2", "b", new Date("2024-01-01"), "Group A"),
      makeGroupCard("3", "a", new Date("2024-01-02"), "Group A"),
      makeGroupCard("4", "a", new Date("2024-01-03"), "Group B"),
      makeGroupCard("5", "b", new Date("2024-01-02"), "Group B"),
    ];
    const boundaries = getGroupBoundaries(cards);
    expect(boundaries).toEqual([
      { groupLabel: "Group A", startIndex: 0, endIndex: 3, count: 3 },
      { groupLabel: "Group B", startIndex: 3, endIndex: 5, count: 2 },
    ]);
  });

  it("handles ungrouped cards at the end", () => {
    const cards = [
      makeGroupCard("1", "a", new Date("2024-01-01"), "Theme"),
      makeGroupCard("2", "b", new Date("2024-01-01"), null),
      makeGroupCard("3", "c", new Date("2024-01-01"), null),
    ];
    const boundaries = getGroupBoundaries(cards);
    expect(boundaries).toEqual([
      { groupLabel: "Theme", startIndex: 0, endIndex: 1, count: 1 },
      { groupLabel: null, startIndex: 1, endIndex: 3, count: 2 },
    ]);
  });
});
