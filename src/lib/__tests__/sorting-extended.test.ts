import { describe, it, expect } from "vitest";
import { fairSort } from "@/lib/sorting";

describe("fairSort with string dates", () => {
  it("handles ISO string dates", () => {
    const cards = [
      { id: "1", authorId: "a", createdAt: "2024-01-01T00:00:00Z" },
      { id: "2", authorId: "b", createdAt: "2024-01-02T00:00:00Z" },
      { id: "3", authorId: "a", createdAt: "2024-01-03T00:00:00Z" },
    ];
    const sorted = fairSort(cards);
    expect(sorted).toHaveLength(3);
    // Author a has 2 cards, b has 1 → a goes first
    expect(sorted[0].authorId).toBe("a");
    expect(sorted[1].authorId).toBe("b");
    expect(sorted[2].authorId).toBe("a");
  });

  it("handles mixed Date and string dates", () => {
    const cards = [
      { id: "1", authorId: "a", createdAt: new Date("2024-01-01") },
      { id: "2", authorId: "a", createdAt: "2024-01-02T00:00:00Z" },
    ];
    const sorted = fairSort(cards);
    expect(sorted).toHaveLength(2);
    expect(sorted[0].id).toBe("1");
    expect(sorted[1].id).toBe("2");
  });
});
