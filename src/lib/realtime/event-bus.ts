import { EventEmitter } from "events";
import type { SSEEvent, SSEPresenceUser } from "@/types/realtime";

// In-memory event bus keyed by retroId.
// Sufficient for single-instance deployment with ~5 concurrent users.
//
// IMPORTANT: All state is stored on globalThis and accessed via getters
// at call time — never via module-level const. Next.js (Turbopack) can
// bundle Server Actions and Route Handlers as separate modules, each with
// their own module-level variables. globalThis is the only reliable way
// to share mutable state across all server-side contexts.

interface PresenceEntry {
  user: SSEPresenceUser;
  lastSeen: number;
}

function getEmitter(): EventEmitter {
  const g = globalThis as Record<string, unknown>;
  if (!g.__rekapka_emitter) {
    const em = new EventEmitter();
    em.setMaxListeners(100);
    g.__rekapka_emitter = em;
  }
  return g.__rekapka_emitter as EventEmitter;
}

function getPresenceMap(): Map<string, Map<string, PresenceEntry>> {
  const g = globalThis as Record<string, unknown>;
  if (!g.__rekapka_presence) {
    g.__rekapka_presence = new Map();
  }
  return g.__rekapka_presence as Map<string, Map<string, PresenceEntry>>;
}

export function emit(retroId: string, event: SSEEvent) {
  const emitter = getEmitter();
  const key = `retro:${retroId}`;
  console.log(`[SSE-BUS] emit "${event.type}" on "${key}" → ${emitter.listenerCount(key)} listener(s)`);
  emitter.emit(key, event);
}

export function subscribe(
  retroId: string,
  callback: (event: SSEEvent) => void
): () => void {
  const emitter = getEmitter();
  const key = `retro:${retroId}`;
  emitter.on(key, callback);
  console.log(`[SSE-BUS] subscribe "${key}" → now ${emitter.listenerCount(key)} listener(s)`);
  return () => {
    emitter.off(key, callback);
    console.log(`[SSE-BUS] unsubscribe "${key}" → now ${emitter.listenerCount(key)} listener(s)`);
  };
}

// ─── Presence tracking ───────────────────────────────────────────────────────

const PRESENCE_TIMEOUT_MS = 45_000; // 45s (heartbeat is every 30s)

export function trackPresence(retroId: string, user: SSEPresenceUser): boolean {
  const presenceMap = getPresenceMap();
  let retroPresence = presenceMap.get(retroId);
  if (!retroPresence) {
    retroPresence = new Map();
    presenceMap.set(retroId, retroPresence);
  }

  const isNew = !retroPresence.has(user.id);
  retroPresence.set(user.id, { user, lastSeen: Date.now() });

  if (isNew) {
    broadcastPresence(retroId);
  }
  return isNew;
}

export function removePresence(retroId: string, userId: string) {
  const presenceMap = getPresenceMap();
  const retroPresence = presenceMap.get(retroId);
  if (!retroPresence) return;

  retroPresence.delete(userId);
  if (retroPresence.size === 0) {
    presenceMap.delete(retroId);
  }
  broadcastPresence(retroId);
}

export function getPresenceUsers(retroId: string): SSEPresenceUser[] {
  const presenceMap = getPresenceMap();
  const retroPresence = presenceMap.get(retroId);
  if (!retroPresence) return [];

  const now = Date.now();
  const activeUsers: SSEPresenceUser[] = [];
  let pruned = false;

  for (const [userId, entry] of retroPresence) {
    if (now - entry.lastSeen > PRESENCE_TIMEOUT_MS) {
      retroPresence.delete(userId);
      pruned = true;
    } else {
      activeUsers.push(entry.user);
    }
  }

  if (pruned) {
    emit(retroId, { type: "presence", users: activeUsers });
  }

  return activeUsers;
}

function broadcastPresence(retroId: string) {
  const users = getPresenceUsers(retroId);
  emit(retroId, { type: "presence", users });
}
