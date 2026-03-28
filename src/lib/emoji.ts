const EMOJI_MAP: Record<string, string> = {
  smile: "\u{1F604}",
  laugh: "\u{1F602}",
  heart: "\u{2764}\u{FE0F}",
  thumbsup: "\u{1F44D}",
  thumbsdown: "\u{1F44E}",
  fire: "\u{1F525}",
  rocket: "\u{1F680}",
  star: "\u{2B50}",
  check: "\u{2705}",
  x: "\u{274C}",
  warning: "\u{26A0}\u{FE0F}",
  bulb: "\u{1F4A1}",
  bug: "\u{1F41B}",
  tada: "\u{1F389}",
  thinking: "\u{1F914}",
  eyes: "\u{1F440}",
  pray: "\u{1F64F}",
  muscle: "\u{1F4AA}",
  clap: "\u{1F44F}",
  wave: "\u{1F44B}",
  100: "\u{1F4AF}",
  sparkles: "\u{2728}",
  boom: "\u{1F4A5}",
  sad: "\u{1F622}",
  angry: "\u{1F621}",
  cool: "\u{1F60E}",
  party: "\u{1F973}",
  shrug: "\u{1F937}",
  facepalm: "\u{1F926}",
  plus1: "\u{1F44D}",
  minus1: "\u{1F44E}",
};

/**
 * Replace :shortcode: patterns with emoji characters.
 */
export function replaceEmojiShortcodes(text: string): string {
  return text.replace(/:([a-z0-9_]+):/g, (match, code: string) => {
    return EMOJI_MAP[code] ?? match;
  });
}

/**
 * Get available emoji shortcodes for autocomplete.
 */
export function getEmojiSuggestions(query: string): { code: string; emoji: string }[] {
  const lower = query.toLowerCase();
  return Object.entries(EMOJI_MAP)
    .filter(([code]) => code.includes(lower))
    .slice(0, 8)
    .map(([code, emoji]) => ({ code, emoji }));
}
