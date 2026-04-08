// Common emoji shortcodes mapping
const EMOJI_MAP: Record<string, string> = {
  smile: "😊",
  laugh: "😂",
  wink: "😉",
  heart: "❤️",
  thumbsup: "👍",
  thumbsdown: "👎",
  fire: "🔥",
  star: "⭐",
  check: "✅",
  x: "❌",
  warning: "⚠️",
  bulb: "💡",
  rocket: "🚀",
  thinking: "🤔",
  clap: "👏",
  pray: "🙏",
  muscle: "💪",
  eyes: "👀",
  cry: "😢",
  angry: "😡",
  sad: "😢",
  happy: "😃",
  cool: "😎",
  party: "🎉",
  tada: "🎉",
  bug: "🐛",
  hammer: "🔨",
  wrench: "🔧",
  lock: "🔒",
  key: "🔑",
  question: "❓",
  exclamation: "❗",
  plus: "➕",
  minus: "➖",
  wave: "👋",
  coffee: "☕",
  beer: "🍺",
  pizza: "🍕",
  hundred: "💯",
  trophy: "🏆",
  gem: "💎",
  clock: "⏰",
  calendar: "📅",
  chart: "📊",
  memo: "📝",
  pin: "📌",
  link: "🔗",
  flag: "🚩",
  target: "🎯",
  zap: "⚡",
  sparkles: "✨",
  boom: "💥",
  ghost: "👻",
  skull: "💀",
  poop: "💩",
  rainbow: "🌈",
  sun: "☀️",
  moon: "🌙",
  cloud: "☁️",
  rain: "🌧️",
  snow: "❄️",
};

/**
 * Replace :shortcode: patterns with actual emoji
 * e.g., ":smile: hello" → "😊 hello"
 */
export function replaceEmojiShortcodes(text: string): string {
  return text.replace(/:([a-z0-9_]+):/g, (match, code) => {
    return EMOJI_MAP[code] ?? match;
  });
}

/**
 * Get matching emoji shortcodes for autocomplete
 */
export function searchEmoji(query: string): Array<{ code: string; emoji: string }> {
  const lower = query.toLowerCase();
  return Object.entries(EMOJI_MAP)
    .filter(([code]) => code.includes(lower))
    .map(([code, emoji]) => ({ code, emoji }))
    .slice(0, 10);
}

export { EMOJI_MAP };
