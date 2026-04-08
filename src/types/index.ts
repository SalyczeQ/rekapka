import type { InferSelectModel } from "drizzle-orm";
import type {
  users,
  retros,
  categories,
  cards,
  tags,
  actionItems,
  appSettings,
  inviteTokens,
} from "@/lib/db/schema";

// ─── Database model types ─────────────────────────────────────────────────────

export type User = InferSelectModel<typeof users>;
export type Retro = InferSelectModel<typeof retros>;
export type Category = InferSelectModel<typeof categories>;
export type Card = InferSelectModel<typeof cards>;
export type Tag = InferSelectModel<typeof tags>;
export type ActionItem = InferSelectModel<typeof actionItems>;
export type AppSettings = InferSelectModel<typeof appSettings>;
export type InviteToken = InferSelectModel<typeof inviteTokens>;

// ─── Retro status ─────────────────────────────────────────────────────────────

export const RETRO_STATUSES = [
  "writing",
  "discussing",
  "completed",
] as const;

export type RetroStatus = (typeof RETRO_STATUSES)[number];

// ─── Action item status ───────────────────────────────────────────────────────

export const ACTION_ITEM_STATUSES = ["open", "in_progress", "done"] as const;
export type ActionItemStatus = (typeof ACTION_ITEM_STATUSES)[number];

// ─── Category names ───────────────────────────────────────────────────────────

export const CATEGORY_NAMES = ["Mad", "Sad", "Glad"] as const;
export type CategoryName = (typeof CATEGORY_NAMES)[number];

// ─── Card with relations ──────────────────────────────────────────────────────

export type CardWithAuthor = Card & {
  author: Pick<User, "id" | "name" | "color" | "image">;
};

export type CardWithTags = Card & {
  tags: Tag[];
};

export type RetroWithCategories = Retro & {
  categories: Category[];
};
