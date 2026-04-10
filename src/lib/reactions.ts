export const REACTION_EMOJIS = [
  { key: "fire", display: "\u{1F525}" },
  { key: "laugh", display: "\u{1F602}" },
  { key: "skull", display: "\u{1F480}" },
  { key: "clap", display: "\u{1F44F}" },
  { key: "beer", display: "\u{1F37A}" },
  { key: "thumbsdown", display: "\u{1F44E}" },
  { key: "love", display: "\u{2764}\u{FE0F}" },
  { key: "sleep", display: "\u{1F634}" },
] as const;

export type ReactionKey = (typeof REACTION_EMOJIS)[number]["key"];

export const EMOJI_MAP: Record<ReactionKey, string> = Object.fromEntries(
  REACTION_EMOJIS.map((e) => [e.key, e.display])
) as Record<ReactionKey, string>;

export type ReactionCounts = Partial<Record<ReactionKey, number>>;
