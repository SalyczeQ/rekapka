import { headers } from "next/headers";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";

export const AUDIT_ACTIONS = {
  // Auth
  SIGN_IN: "auth.sign_in",
  SIGN_OUT: "auth.sign_out",
  INVITE_REDEEM: "auth.invite_redeem",

  // Retro
  RETRO_CREATE: "retro.create",
  RETRO_UPDATE: "retro.update",
  RETRO_DELETE: "retro.delete",
  RETRO_PHASE_CHANGE: "retro.phase_change",
  RETRO_COMPLETE: "retro.complete",
  RETRO_PHOTO_UPLOAD: "retro.photo_upload",
  RETRO_CARD_IMPORT: "retro.card_import",

  // Card
  CARD_CREATE: "card.create",
  CARD_UPDATE: "card.update",
  CARD_DELETE: "card.delete",
  CARD_PHOTO_UPLOAD: "card.photo_upload",
  CARD_DISCUSS_START: "card.discuss_start",
  CARD_DISCUSS_DONE: "card.discuss_done",
  CARD_SKIP: "card.skip",
  CARD_UNSKIP: "card.unskip",
  CARD_ASSIGN_AUTHOR: "card.assign_author",
  CARD_TAG_ADD: "card.tag_add",
  CARD_TAG_REMOVE: "card.tag_remove",

  // Reactions
  REACTION_TOGGLE: "reaction.toggle",

  // Action items
  ACTION_ITEM_CREATE: "action_item.create",
  ACTION_ITEM_UPDATE: "action_item.update",
  ACTION_ITEM_DELETE: "action_item.delete",

  // Predictions
  PREDICTION_CREATE: "prediction.create",
  PREDICTION_RESOLVE: "prediction.resolve",

  // Settings / Admin
  SETTINGS_UPDATE_USER: "settings.update_user",
  SETTINGS_UPDATE_APP: "settings.update_app",
  INVITE_CREATE: "invite.create",
  INVITE_DELETE: "invite.delete",

  // AI
  AI_GROUP: "ai.group",
  AI_READ_ALOUD: "ai.read_aloud",
  AI_STATS: "ai.stats",
  AI_TEAM_STATS: "ai.team_stats",
  AI_GUESS_AUTHORS: "ai.guess_authors",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export interface AuditActor {
  id?: string | null;
  email?: string | null;
  name?: string | null;
}

export interface LogAuditInput {
  actor?: AuditActor | null;
  action: AuditAction | string;
  entityType?: string | null;
  entityId?: string | null;
  retroId?: string | null;
  metadata?: Record<string, unknown> | null;
}

async function readRequestContext(): Promise<{ ipAddress: string | null; userAgent: string | null }> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0]!.trim() : h.get("x-real-ip");
    const userAgent = h.get("user-agent");
    return { ipAddress: ipAddress ?? null, userAgent: userAgent ?? null };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    const { ipAddress, userAgent } = await readRequestContext();
    await db.insert(auditLogs).values({
      userId: input.actor?.id ?? null,
      userEmail: input.actor?.email ?? null,
      userName: input.actor?.name ?? null,
      action: input.action,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      retroId: input.retroId ?? null,
      metadata: input.metadata ?? null,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error("[audit] failed to log event", input.action, err);
  }
}
