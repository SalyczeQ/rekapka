// ─── SSE event types for real-time retro updates ─────────────────────────────

import type { SerializedCard } from "./serialized";

export type SSEEvent =
  | { type: "card_added"; card: SerializedCard }
  | { type: "card_updated"; cardId: string; changes: Partial<SerializedCard> }
  | { type: "card_deleted"; cardId: string }
  | { type: "phase_changed"; phase: string }
  | { type: "group_updated"; cards: { cardId: string; groupLabel: string }[] }
  | { type: "discussion_update"; action: "start" | "done" | "skip" | "unskip"; cardId: string }
  | { type: "action_item_added"; item: SSEActionItemData }
  | { type: "action_item_updated"; itemId: string; changes: Partial<SSEActionItemData> }
  | { type: "action_item_deleted"; itemId: string }
  | { type: "retro_updated"; changes: Record<string, unknown> }
  | { type: "presence"; users: SSEPresenceUser[] }
  | { type: "heartbeat" };

export interface SSEActionItemData {
  id: string;
  retroId: string;
  cardId: string | null;
  text: string;
  assigneeId: string | null;
  status: string;
}

export interface SSEPresenceUser {
  id: string;
  name: string;
  color: string;
  image: string | null;
}
