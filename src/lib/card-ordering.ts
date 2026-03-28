/**
 * Interleave cards by author for fair discussion order.
 * Algorithm:
 * 1. Group cards by author
 * 2. Sort groups by card count (descending)
 * 3. Round-robin pick one card from each group
 * 4. Within each author's cards, order by vote count (descending)
 */
export function interleaveCards<
  T extends { author_id: string; id: string }
>(
  cards: T[],
  voteCountMap: Map<string, number>
): T[] {
  // Group by author
  const groups = new Map<string, T[]>();
  for (const card of cards) {
    const group = groups.get(card.author_id) ?? [];
    group.push(card);
    groups.set(card.author_id, group);
  }

  // Sort each group by vote count descending
  for (const group of groups.values()) {
    group.sort(
      (a, b) => (voteCountMap.get(b.id) ?? 0) - (voteCountMap.get(a.id) ?? 0)
    );
  }

  // Sort groups by size descending
  const sortedGroups = [...groups.values()].sort(
    (a, b) => b.length - a.length
  );

  // Round-robin interleave
  const result: T[] = [];
  const indices = sortedGroups.map(() => 0);
  let remaining = cards.length;

  while (remaining > 0) {
    for (let g = 0; g < sortedGroups.length; g++) {
      if (indices[g] < sortedGroups[g].length) {
        result.push(sortedGroups[g][indices[g]]);
        indices[g]++;
        remaining--;
      }
    }
  }

  return result;
}
