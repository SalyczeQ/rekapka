/**
 * Card author color palette - 10 high-contrast colors for both light/dark modes.
 */
export const AUTHOR_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#6366F1", // indigo
  "#14B8A6", // teal
] as const;

/**
 * Get a color from the palette for a given index.
 * Wraps around if index exceeds palette size.
 */
export function getAuthorColor(index: number): string {
  return AUTHOR_COLORS[index % AUTHOR_COLORS.length];
}

/**
 * Assign a color to a user based on their position in the team.
 * Uses a simple hash of the user ID to pick a consistent color.
 */
export function colorFromUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  return AUTHOR_COLORS[Math.abs(hash) % AUTHOR_COLORS.length];
}
