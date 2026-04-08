import { describe, it, expect } from "vitest";
import { fairSort } from "@/lib/sorting";

function makeCard(id: string, authorId: string, createdAt: Date) {
  return { id, authorId, createdAt };
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
