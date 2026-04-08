## Real-time Architecture: SSE + Server Actions

No custom server needed. Uses standard Next.js App Router features only.

**Server → Client (SSE):** A Route Handler at `GET /api/retros/[id]/stream` returns a `ReadableStream` that pushes events to all connected clients. When any user makes a change, the SSE stream notifies all other connected clients.

**Client → Server (Server Actions):** All mutations (create card, advance phase, mark discussed, etc.) go through Server Actions in `src/lib/actions/`. After each mutation, the action pushes an event to the SSE stream so other clients receive the update.

**Event coordination:** A lightweight in-memory event bus (`src/lib/realtime/event-bus.ts`) connects Server Actions to SSE streams. When a Server Action completes a mutation, it emits an event on the bus. All active SSE stream handlers for that retro pick up the event and push it to their connected clients.

```
src/lib/realtime/
  event-bus.ts              — in-memory EventEmitter keyed by retroId
  stream.ts                 — SSE ReadableStream factory, subscribes to event bus
```

**API route:**
```
GET /api/retros/[id]/stream  — SSE endpoint, returns ReadableStream
```

**Event types pushed via SSE:**
- `card_added`, `card_updated`, `card_deleted` — card CRUD by other users
- `phase_changed` — retro phase advanced (writing → discussing → completed)
- `group_updated` — AI grouping completed (can happen during writing or discussing)
- `discussion_update` — current card changed, marked discussed, skipped
- `presence` — user joined/left the retro

**Client hooks:**
- `useRetroStream(retroId)` — connects to SSE endpoint, parses events, auto-reconnect (browser handles this natively for SSE)
- `usePresence(retroId)` — tracks online users via periodic heartbeat Server Action + SSE presence events
- `useDiscussionTimer` — local count-up timer per card, resets on `discussion_update` events from SSE

**Why SSE + Server Actions over WebSockets:**
- No custom server — standard `next dev` / `next start` works
- Deployable anywhere (Vercel, VPS, Docker, etc.)
- Browser natively handles SSE reconnection
- Server Actions already exist for all mutations — just need to add event emission
- Sufficient for ~5 concurrent users

---

## Themes

Six visual themes, each with light and dark mode variants. Implemented as CSS custom property overrides using `[data-ui-theme="name"]` selectors. All use oklch color space. Each theme sets `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--ring`, `--destructive`, `--radius`, sidebar variants, and chart colors.

### 1. Default
Clean, neutral grayscale. Standard shadcn/ui appearance. `--radius: 0.625rem`. No custom font.

### 2. CLI (Terminal)
Green-on-black terminal aesthetic. Monospace font (`JetBrains Mono`). `--radius: 0` (sharp corners). Light mode: green-tinted paper look. Dark mode: classic green phosphor terminal (oklch hue 145).

### 3. MS-DOS
Nostalgic Norton Commander / DOS feel. Monospace font (`Courier New`). `--radius: 0`. Light mode: gray CRT look. Dark mode: classic blue VGA background with white/yellow text (oklch hue 260).

### 4. Material 3
Google Material Design 3 "Expressive" style. Large radius (`1rem`). Purple-toned tonal surfaces (oklch hue 270). Soft layered cards with subtle purple tints in both modes.

### 5. Windows 95/98
Classic Windows system gray with beveled look. Font: `Tahoma`. `--radius: 0`. Blue title bars (oklch hue 260). Light mode: system gray (#C0C0C0 feel). Dark mode: darker charcoal Windows NT style.

### 6. iOS 26 Liquid Glass
Apple's translucent glass effect. System font (`-apple-system, SF Pro`). `--radius: 1.25rem`. Semi-transparent cards using oklch with alpha (e.g., `oklch(1 0 0 / 0.72)`). Blue-tinted (oklch hue 240). Frosted glass borders. Dark mode: dark glass with low-opacity white overlays.

**Theme switching**: `next-themes` library. User preference stored in `users.uiTheme`. `data-ui-theme` attribute set on `<html>`. ThemeToggle component in sidebar (light/dark/system).

