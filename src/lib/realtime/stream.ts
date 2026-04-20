import type { SSEEvent, SSEPresenceUser } from "@/types/realtime";
import { subscribe, trackPresence, removePresence, getPresenceUsers } from "./event-bus";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

/**
 * Creates a ReadableStream that pushes SSE-formatted events for a given retro.
 * Registers the user for presence tracking on connect, removes on disconnect.
 */
export function createSSEStream(
  retroId: string,
  user: SSEPresenceUser,
  retroTitle: string | null
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;

  return new ReadableStream({
    start(controller) {
      // Register presence — only log if this is a fresh join (not a reconnect)
      const isNew = trackPresence(retroId, user);
      if (isNew) {
        void logAudit({
          actor: { id: user.id, name: user.name, email: null },
          action: AUDIT_ACTIONS.RETRO_PRESENCE_JOIN,
          entityType: "retro",
          entityId: retroId,
          retroId,
          metadata: { retroId, retroTitle },
        });
      }

      // Send initial connected event with current presence
      const currentUsers = getPresenceUsers(retroId);
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "connected", users: currentUsers })}\n\n`
        )
      );

      // Subscribe to retro events
      unsubscribe = subscribe(retroId, (event: SSEEvent) => {
        try {
          console.log(`[SSE-STREAM] pushing event "${event.type}" to user ${user.id}`);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          );
        } catch {
          // Stream closed
        }
      });

      // Send heartbeat every 30s to keep the connection alive
      heartbeatInterval = setInterval(() => {
        try {
          // Re-register presence on each heartbeat
          trackPresence(retroId, user);
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          // Stream closed
        }
      }, 30_000);
    },

    cancel() {
      unsubscribe?.();
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      removePresence(retroId, user.id);
      void logAudit({
        actor: { id: user.id, name: user.name, email: null },
        action: AUDIT_ACTIONS.RETRO_PRESENCE_LEAVE,
        entityType: "retro",
        entityId: retroId,
        retroId,
        metadata: { retroId, retroTitle },
      });
    },
  });
}
