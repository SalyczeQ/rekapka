interface SortableCard {
  id: string;
  authorId: string;
  createdAt: Date | string;
}

interface GroupableSortableCard extends SortableCard {
  groupLabel: string | null;
}

export interface GroupBoundary {
  groupLabel: string | null;
  startIndex: number;
  endIndex: number; // exclusive
  count: number;
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

/**
 * Group-aware card sorting for the discussion phase.
 * Cards with the same groupLabel are discussed consecutively.
 * Within each group, fairSort() maintains author fairness.
 * Ungrouped cards (null groupLabel) come after all grouped cards.
 * Falls back to plain fairSort() when no cards have groups.
 */
export function groupAwareSort<T extends GroupableSortableCard>(cards: T[]): T[] {
  if (cards.length === 0) return [];

  // Fall back to fairSort when no grouping exists
  const hasGroups = cards.some((c) => c.groupLabel);
  if (!hasGroups) return fairSort(cards);

  // Partition by groupLabel
  const byGroup = new Map<string, T[]>();
  const ungrouped: T[] = [];

  for (const card of cards) {
    if (card.groupLabel) {
      const list = byGroup.get(card.groupLabel) ?? [];
      list.push(card);
      byGroup.set(card.groupLabel, list);
    } else {
      ungrouped.push(card);
    }
  }

  // Sort groups: largest first, alphabetical tiebreaker
  const sortedGroups = [...byGroup.entries()].sort((a, b) => {
    if (b[1].length !== a[1].length) return b[1].length - a[1].length;
    return a[0].localeCompare(b[0]);
  });

  // fairSort within each group, then concatenate
  const result: T[] = [];
  for (const [, groupCards] of sortedGroups) {
    result.push(...fairSort(groupCards));
  }
  result.push(...fairSort(ungrouped));

  return result;
}

/**
 * Computes group boundaries from a sorted card array.
 * Returns the index range and count for each contiguous group.
 */
export function getGroupBoundaries<T extends GroupableSortableCard>(
  sortedCards: T[]
): GroupBoundary[] {
  if (sortedCards.length === 0) return [];

  const boundaries: GroupBoundary[] = [];
  let currentLabel = sortedCards[0].groupLabel;
  let startIndex = 0;

  for (let i = 1; i <= sortedCards.length; i++) {
    const label = i < sortedCards.length ? sortedCards[i].groupLabel : undefined;
    if (label !== currentLabel) {
      boundaries.push({
        groupLabel: currentLabel,
        startIndex,
        endIndex: i,
        count: i - startIndex,
      });
      currentLabel = label ?? null;
      startIndex = i;
    }
  }

  return boundaries;
}
