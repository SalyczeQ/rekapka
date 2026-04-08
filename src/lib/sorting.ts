interface SortableCard {
  id: string;
  authorId: string;
  createdAt: Date | string;
}

/**
 * Fair round-robin card sorting algorithm.
 * Interleaves cards by author so no one reads all theirs at once.
 *
 * Example: Authors A(3 cards), B(2 cards), C(4 cards)
 * Result:  C1, A1, B1, C2, A2, B2, C3, A3, C4
 */
export function fairSort<T extends SortableCard>(cards: T[]): T[] {
  // Group by author
  const byAuthor = new Map<string, T[]>();
  for (const card of cards) {
    const list = byAuthor.get(card.authorId) ?? [];
    list.push(card);
    byAuthor.set(card.authorId, list);
  }

  // Sort each author's cards by creation time
  for (const list of byAuthor.values()) {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Sort authors by card count descending (most cards first)
  const authors = [...byAuthor.entries()].sort((a, b) => b[1].length - a[1].length);

  // Round-robin interleave
  const result: T[] = [];
  let round = 0;
  let placed = true;

  while (placed) {
    placed = false;
    for (const [, authorCards] of authors) {
      if (round < authorCards.length) {
        result.push(authorCards[round]);
        placed = true;
      }
    }
    round++;
  }

  return result;
}
