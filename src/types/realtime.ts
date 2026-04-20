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
  | { type: "reactions_updated"; cardId: string; reactions: Record<string, number> }
  | { type: "retro_updated"; changes: Record<string, unknown> }
  | { type: "prediction_added"; prediction: SSEPredictionData }
  | { type: "prediction_resolved"; predictionId: string; status: string }
  | { type: "prediction_deleted"; predictionId: string }
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

export interface SSEPredictionData {
  id: string;
  retroId: string;
  authorId: string;
  authorName: string;
  text: string;
  stake: string | null;
  challengedUserId: string | null;
  challengedUserName: string | null;
  status: string;
  deadline: string | null;
  createdAt: string;
}

export interface SSEPresenceUser {
  id: string;
  name: string;
  color: string;
  image: string | null;
}
