# Rekapka — Build Plan

## What Is Rekapka

A real-time retrospective app for small teams (~5 users). One shared group, three card categories (Mad/Sad/Glad), real-time collaboration via SSE + Server Actions, AI-assisted card grouping and stats, six visual themes, and full Czech/English localization.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| **UI** | shadcn/ui (base-nova style, uses `@base-ui/react`), Tailwind CSS 4, next-themes |
| **Database** | PostgreSQL 16 + Drizzle ORM |
| **Auth** | NextAuth v5 (Google OAuth) + static invite token links (no email service) |
| **Real-time** | Server-Sent Events (SSE) for server→client push + Server Actions for client→server mutations |
| **AI** | OpenAI API (gpt-4o-mini) for card grouping and retro stats |
| **Storage** | MinIO (S3-compatible) for retro photos |
| **i18n** | next-intl v4, cookie-based locale (no URL prefix), CS + EN |
| **Testing** | Vitest 3 + React Testing Library |
| **Deploy** | Docker Compose (app + postgres + minio), deployable anywhere (VPS, Vercel, etc.) |

---

## Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| email | text, unique | |
| name | text | |
| emailVerified | timestamptz | Auth.js |
| image | text | Google avatar URL |
| color | text, default `#3B82F6` | Unique card border color |
| locale | text, default `cs` | `cs` or `en` |
| uiTheme | text, default `default` | One of 6 theme names |
| createdAt, updatedAt | timestamptz | |

### `accounts` (Auth.js adapter)
Standard NextAuth accounts table: userId FK, provider, providerAccountId, tokens.

### `verificationTokens` (Auth.js adapter)
Standard NextAuth verification tokens: identifier, token, expires.

### `appSettings` (singleton)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| icsToken | uuid, unique | Token for ICS calendar feed URL |
| groupName | text, default `Rekapka` | Display name for the group |
| createdAt, updatedAt | timestamptz | |

### `inviteTokens`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| token | uuid, unique | The shareable invite token |
| createdBy | uuid FK → users | |
| expiresAt | timestamptz, nullable | Null = never expires |
| isReusable | boolean, default true | Multiple people can use same link |
| createdAt | timestamptz | |

### `retros`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| title | text | |
| status | text, default `writing` | `writing`, `discussing`, `completed` |
| location | text, nullable | Venue / room name |
| photoUrl | text, nullable | S3 URL of retro team photo |
| date | date | Day of retro |
| createdBy | uuid FK → users | |
| statsCache | text, nullable | JSON string of LLM-generated stats |
| startedAt | timestamptz, nullable | Set when retro is created (starts in writing) |
| completedAt | timestamptz, nullable | Set when completing |
| totalDurationSec | integer, nullable | Computed on completion |
| createdAt, updatedAt | timestamptz | |

### `categories` (always 3 per retro)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| retroId | uuid FK → retros (cascade) | |
| name | text | `Mad`, `Sad`, or `Glad` |
| icon | text, nullable | Optional emoji icon |
| sortOrder | integer, default 0 | 0=Mad, 1=Sad, 2=Glad |
| color | text, nullable | Category accent color |

### `cards`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| retroId | uuid FK → retros (cascade) | |
| categoryId | uuid FK → categories (cascade) | |
| authorId | uuid FK → users (restrict) | |
| text | text | Card content, emoji shortcodes replaced on save |
| sortOrder | integer, default 0 | |
| groupLabel | text, nullable | AI-assigned group name |
| isDiscussed | boolean, default false | |
| isSkipped | boolean, default false | |
| discussionNotes | text, nullable | Notes taken during discussion |
| discussionStartedAt | timestamptz, nullable | When discussion of this card began |
| discussionEndedAt | timestamptz, nullable | When discussion ended |
| discussionDurationSec | integer, nullable | Computed duration |
| carriedFromRetroId | uuid FK → retros (set null), nullable | If carried from previous retro |
| createdAt, updatedAt | timestamptz | |

### `tags` (global)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text, unique | Lowercase, trimmed |
| usageCount | integer, default 0 | |

### `cardTags` (junction)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| cardId | uuid FK → cards (cascade) | |
| tagId | uuid FK → tags (cascade) | |
| Unique index on (cardId, tagId) | |

### `actionItems`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| retroId | uuid FK → retros (cascade) | |
| cardId | uuid FK → cards (set null), nullable | Which card this action came from |
| text | text | |
| assigneeId | uuid FK → users (set null), nullable | |
| dueDate | date, nullable | |
| status | text, default `open` | `open`, `in_progress`, `done` |
| createdAt, updatedAt | timestamptz | |

---

## Retro Phase Flow

```
Writing → Discussing → Completed
```

Only 3 phases. No draft gate, no grouping gate. Simple and fast.

- **Writing**: Retro starts here immediately after creation. `startedAt` set on creation. Users add cards to Mad/Sad/Glad categories. Privacy: you see your own text; others show as card count only. Cards are editable/deletable. Emoji `:shortcode:` syntax auto-replaces. Retro metadata (title, date, location, photo) editable anytime via an edit button in the header. AI grouping available as an optional button — not a separate phase. When ready, advance to Discussing.
- **Discussing**: Cards shown one at a time in fair round-robin order. Card text is blurred until clicked. Per-card count-up timer. Buttons: "Mark Discussed" (removes from queue) and "Skip" (moves to end). Action items can be created inline during discussion. AI grouping button still available here if not used during writing.
- **Completed**: Confetti animation. Instant stats shown immediately. Form to create next retro. Undiscussed cards automatically carry over to the new retro. "View Full Stats" link for detailed + AI analysis page.

### Fair Card Sorting (Round-Robin)
Group cards by author. Sort authors by card count descending (most cards first). Interleave one card per author per round. Within each author, order by `createdAt` ascending.

Example: Authors A(3 cards), B(2), C(4) → C1, A1, B1, C2, A2, B2, C3, A3, C4

### Stats Page (generated on completion, cached in `statsCache`)

**Time & Duration**
- Total retro duration (startedAt → completedAt)
- Time spent writing vs discussing
- Average discussion time per card
- Longest discussed card (which card + how long)
- Median discussion time

**Cards**
- Total cards written
- Cards per category (Mad / Sad / Glad breakdown — bar or pie chart)
- Cards discussed vs skipped vs carried over
- Most popular category (which got the most cards)
- Average card length (words)
- Longest card text (which card)

**People**
- Most cards written (who + count)
- Most verbose author (who wrote the most total text)
- Most discussed author (whose cards took the longest total discussion time)
- Cards per person breakdown
- Who created the most action items

**Discussion**
- Number of cards skipped
- Discussion time distribution (how many cards took <1min, 1-3min, 3-5min, 5min+)

**AI / Content (LLM-generated)**
- Theme summary (what topics came up)
- Sentiment breakdown (positive/negative/neutral ratio across categories)
- AI group names and sizes (if grouping was used)
- Key takeaways

**Action Items**
- Total action items created

**Trends** (shown after 2+ retros exist)
- Card count trend over last N retros
- Duration trend
- Mad/Sad/Glad ratio trend (are things getting better?)
- Action item completion rate from previous retros

### Team Stats Page (`/stats`)

A separate page accessible to all users showing aggregated metrics across all retros. Available from the sidebar navigation. Has a **time range filter** at the top: "Last 5 retros", "Last 3 months", "Last 6 months", "All time" (default).

**Team Health Trends**
- Mad/Sad/Glad ratio over time (line chart) — more Glad over time = healthier team
- Total cards per retro trend (line chart) — is engagement growing or declining?
- Cards per person per retro (line chart per user) — individual engagement over time
- Carry-over card count per retro — how many cards never get discussed?

**Participation**
- Participation rate per user (how many retros each person joined, based on cards written)
- Most active contributor overall (total cards across all retros)
- Average cards per person per retro
- Who gets discussed the most (total discussion time spent on their cards)

**Action Items**
- Completion rate overall (done / total, as percentage)
- Open action items right now (across all retros, not yet done) — list with assignees
- Average action items per retro
- Most assigned person
- Overdue action items (past due date, still open)

**Discussion**
- Average discussion time per card over retros (trend line)
- Skip rate trend (% skipped per retro)
- Most skipped category (does one category always get skipped?)

**Timing**
- Average retro duration
- Duration trend (line chart)
- Longest and shortest retro (with links)
- Average time between retros (cadence — e.g., "every 2.1 weeks")
- Day of week distribution (bar chart — when do you usually retro?)

**Content / Tags**
- Most used tags (ranked list or tag cloud)

**AI Analysis (on-demand, cached)**
- "Generate AI Analysis" button — calls `POST /api/ai/team-stats` with retro IDs in selected time range
- Shows loading state while OpenAI processes
- Once generated, displays:
  - Most recurring themes across retros (what keeps coming up?)
  - Sentiment trend over time (is the team mood improving?)
  - Topics that keep coming back unresolved (patterns the team should address)
  - Summary of progress and recommendations
- Cached in `appSettings` or a dedicated cache field. Invalidated when time range changes or new retro is completed. Subsequent visits with same range are instant.

---

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

---

## File Structure

```
src/
  app/
    layout.tsx                      — root: NextIntlClientProvider, ThemeProvider, fonts
    page.tsx                        — landing page (unauthenticated → "Get Started")
    globals.css                     — Tailwind + theme CSS imports
    (auth)/
      login/page.tsx                — Google OAuth "Sign in" button
      invite/[token]/page.tsx       — accept invite link → register → redirect
    (app)/
      layout.tsx                    — auth guard (redirect to /login), AppShell wrapper
      retros/page.tsx               — dashboard: retro list sorted by date
      retros/new/page.tsx           — create retro form (title, date, location)
      retros/[id]/page.tsx          — retro session page (main orchestrator)
      retros/[id]/stats/page.tsx    — LLM-generated stats display
      retros/[id]/loading.tsx       — loading spinner
      retros/loading.tsx            — loading spinner
      stats/page.tsx                — team stats dashboard (all retros, time range filter)
      settings/page.tsx             — user settings (name, theme, locale)
      admin/page.tsx                — app settings, invite management, ICS token, user list
    api/
      auth/[...nextauth]/route.ts   — NextAuth handler
      ai/team-stats/route.ts        — POST generate AI analysis across retros (cached)
      retros/[id]/stream/route.ts   — SSE endpoint (ReadableStream of real-time events)
      retros/[id]/cards/route.ts    — GET cards, POST new card
      retros/[id]/phase/route.ts    — POST advance phase
      retros/[id]/export/route.ts   — GET CSV export
      retros/[id]/import/route.ts   — POST CSV import
      retros/[id]/photo/route.ts    — POST upload retro photo to S3
      retros/[id]/complete/route.ts — POST complete retro (validate, carry-over, stats)
      ai/group/route.ts             — POST AI card grouping
      ai/read-aloud/route.ts         — POST text → OpenAI TTS mp3 audio stream
      ai/read-cards/route.ts        — POST AI read & analyze cards (summary, themes, mood, focus points)
      ai/stats/route.ts             — POST generate LLM stats
      ai/team-stats/route.ts        — POST generate team-wide AI analysis across retros
      tags/search/route.ts          — GET tag autocomplete
      ics/[token]/route.ts          — GET iCalendar feed
      invite/route.ts               — POST create invite token

  components/
    ui/                             — shadcn/ui base components (32+)
    layout/
      app-shell.tsx                 — sidebar (desktop) + hamburger sheet (mobile) + content
      bottom-nav.tsx                — mobile bottom navigation bar
      theme-toggle.tsx              — light/dark/system dropdown
      locale-toggle.tsx             — CS/EN language switcher dropdown
    retro/
      retro-session.tsx             — main orchestrator, manages phase + card state
      phase-bar.tsx                 — phase stepper (Writing → Discussing → Done) with "Next" button
      phase-writing.tsx             — writing phase: category columns/tabs, card input, AI group button
      phase-discussing.tsx          — discussion phase: single card view, timer, skip/done
      ai-group-button.tsx           — "AI Group Cards" button with loading state (used in writing + discussing)
      card-input.tsx                — textarea with emoji picker + send button
      card-item.tsx                 — card display with author color border, blur, delete
      emoji-picker.tsx              — popover grid of emoji with search
      participant-bar.tsx           — avatar row showing online users
      retro-metadata.tsx            — title, date, location, photo status
      completion-modal.tsx          — completed state with next-retro form
    shared/
      theme-provider.tsx            — next-themes ThemeProvider wrapper
      sign-out-button.tsx           — sign out form button
      confetti.tsx                  — canvas-confetti burst on retro completion
      error-boundary.tsx            — React error boundary with retry
      loading-spinner.tsx           — centered spinner with optional text
    stats/
      stats-dashboard.tsx           — display cached LLM stats as metric cards

  hooks/
    use-retro-stream.ts             — SSE connection to /api/retros/[id]/stream, auto-reconnect
    use-presence.ts                 — online user tracking via heartbeat + SSE presence events
    use-discussion-timer.ts         — per-card + total count-up timer, resets on SSE events
    use-swipe.ts                    — touch swipe detection for mobile tab switching

  lib/
    db/index.ts                     — Drizzle client (postgres.js driver)
    db/schema.ts                    — full Drizzle schema (all tables above)
    db/seed.ts                      — seed appSettings singleton row
    auth/index.ts                   — NextAuth config (Google, DrizzleAdapter, JWT sessions)
    auth/session.ts                 — requireAuth() helper, getSession()
    realtime/event-bus.ts           — in-memory EventEmitter keyed by retroId
    realtime/stream.ts              — SSE ReadableStream factory, subscribes to event bus
    ai/group-cards.ts               — OpenAI gpt-4o-mini card clustering (lazy client init)
    ai/generate-stats.ts            — OpenAI gpt-4o-mini retro stats (lazy client init)
    actions/retro.ts                — createRetro (auto-creates 3 categories), updateRetro, deleteRetro
    actions/retro-session.ts        — createCard, updateCard, deleteCard, advancePhase, tag ops
    actions/action-items.ts         — CRUD for action items
    actions/settings.ts             — update user settings, app settings
    actions/invite.ts               — create/revoke invite tokens
    csv/export.ts                   — cards → CSV string
    csv/import.ts                   — CSV string → card objects
    ics/generate-ics.ts             — retro events → iCalendar string
    s3/client.ts                    — @aws-sdk/client-s3 configured for MinIO
    s3/upload.ts                    — presigned upload URL generation
    emoji.ts                        — :shortcode: → emoji mapping (60+), search, replace
    colors.ts                       — user color palette, contrast utilities
    validators.ts                   — Zod schemas for all inputs
    sorting.ts                      — fair round-robin card sorting algorithm
    utils.ts                        — cn() class merge helper
    i18n/request.ts                 — next-intl getRequestConfig (cookie-based locale)
    i18n/messages/en.json           — English translations
    i18n/messages/cs.json           — Czech translations

  styles/themes/
    default.css                     — neutral grayscale theme
    cli.css                         — green terminal theme
    msdos.css                       — blue DOS theme
    material3.css                   — purple Material 3 theme
    windows.css                     — gray Windows 95 theme
    ios26.css                       — translucent iOS glass theme

  types/
    index.ts                        — DB model types, status enums, category names
    serialized.ts                   — SerializedRetro/Card/Category (string dates for client)
    realtime.ts                     — SSE event type definitions
```

---

## Implementation Phases

### Phase 0: Scaffolding
- `pnpm create next-app` with TypeScript, ESLint, Tailwind CSS 4, App Router
- Install all dependencies (see Tech Stack)
- Initialize shadcn/ui (base-nova style) and generate UI components
- Create `docker-compose.yml` with postgres:16-alpine + minio + app services
- Create `.env.example`, `vitest.config.ts`, `drizzle.config.ts`
- Create `globals.css` with Tailwind directives and theme CSS imports

### Phase 1: Database & Auth
- Write Drizzle schema for all 11 tables in `src/lib/db/schema.ts`
- Create DB client, seed script (appSettings singleton)
- Configure NextAuth v5: Google provider, DrizzleAdapter, JWT session strategy
- Create auth API route, login page, invite token accept page
- Create `requireAuth()` session helper

### Phase 2: Core UI Shell
- Root layout: Geist fonts, `NextIntlClientProvider`, `ThemeProvider`, `Toaster`
- App shell: desktop sidebar + mobile bottom nav + mobile hamburger sheet menu
- Generate all shadcn/ui components needed (32+)
- Create 6 theme CSS files with light + dark variants:
  - **Default**: Neutral grayscale, `--radius: 0.625rem`, no custom font
  - **CLI**: Green terminal (`JetBrains Mono`, `--radius: 0`, oklch hue 145). Light: green-tinted paper. Dark: black background, green phosphor text
  - **MS-DOS**: Norton Commander (`Courier New`, `--radius: 0`, oklch hue 260). Light: gray CRT. Dark: blue VGA background, white/yellow text
  - **Material 3**: Google M3 Expressive (`--radius: 1rem`, oklch hue 270). Purple-toned tonal surfaces, soft layered cards
  - **Windows 95**: System gray (`Tahoma`, `--radius: 0`, oklch hue 260). Light: classic silver gray. Dark: charcoal Windows NT
  - **iOS 26 Liquid Glass**: Translucent glass (`-apple-system`, `--radius: 1.25rem`, oklch hue 240). Semi-transparent cards with alpha (e.g., `oklch(1 0 0 / 0.72)`), frosted borders
- Build theme toggle (light/dark/system) and locale toggle (CS/EN)
- PWA manifest.json + sw.js service worker

### Phase 3: Retro CRUD & Dashboard
- Dashboard page: retro list sorted by date, status badges
- New retro form: title (required), date (required), location (optional)
- Server actions: `createRetro` (auto-creates 3 Mad/Sad/Glad categories), `deleteRetro`
- Retro metadata component (title, date, location, photo status)
- S3 client for MinIO, photo upload API route

### Phase 4: Real-time (SSE + Server Actions)
- `src/lib/realtime/event-bus.ts`: in-memory EventEmitter, `emit(retroId, event)` and `subscribe(retroId, callback)`
- `src/lib/realtime/stream.ts`: factory that creates a `ReadableStream` subscribed to the event bus for a given retroId
- `GET /api/retros/[id]/stream` Route Handler: returns SSE stream, authenticates via session, cleans up on disconnect
- Update all Server Actions in `actions/retro-session.ts` to emit events on the bus after each mutation (card_added, card_updated, card_deleted, phase_changed, etc.)
- Client hooks:
  - `useRetroStream(retroId)` — connects to SSE endpoint via `EventSource`, parses events, calls callbacks for card/phase/presence updates. Browser handles auto-reconnect natively.
  - `usePresence(retroId)` — sends periodic heartbeat via Server Action (every 30s), listens for presence events on SSE stream, returns list of online users
  - `useDiscussionTimer` — local 1-second count-up timer, resets when SSE delivers `discussion_update` event (new card started, card marked discussed/skipped)

### Phase 5: Writing Phase

**Layout**:
- Phase bar sticky at top (3 phase pills: Writing → Discussing → Done, current highlighted, "Next: Discussing" button right-aligned)
- Participant bar below phase bar (avatar row, right-aligned)
- Edit retro metadata button in header (opens inline form for title, date, location, photo)
- Main content area: scrollable, centered, max-width container

**Desktop (md+)**: Three columns side by side — one for each category (Mad, Sad, Glad). Each column has a header with category name and card count, a card input area at the top, and a vertical list of cards below. All three categories visible simultaneously.

**Mobile**: Single column view. Three tabs at top (Mad / Sad / Glad) with card counts. Only the active category is visible. Switch between categories by tapping a tab or swiping left/right (`useSwipe` hook). Card input and card list below the active tab.

**Components**:
- **Retro session orchestrator** (`retro-session.tsx`): top-level client component holding `currentPhase` and `currentCards` state, renders the correct phase component
- **Phase bar**: horizontal phase stepper (Writing → Discussing → Done) with chevrons. Current = primary pill, completed = faded, future = muted. "Next: Phase" as `<form action={}>` for progressive enhancement
- **Card input**: textarea ("Add a card… use :emoji: for emoji") with emoji picker popover (grid + search) at bottom-right corner, send icon button to the right. Enter submits, Shift+Enter for newline
- **Card item**: card with 4px left border in author's color. Author name in muted small text below. Group label badge above text if present. Own cards show edit button (pencil icon) and delete button (trash icon). Clicking edit turns the card text into an inline textarea for editing, with save/cancel. Cards are editable during Writing phase, locked during Discussion and after
- **Privacy**: you see full text of your own cards. Other users' cards show as a card shape with "Hidden card" text and author name — you know how many cards others wrote but can't read them
- **AI Group button**: optional "AI Group Cards" button (available in writing phase). Calls `POST /api/ai/group` (OpenAI gpt-4o-mini). Loading state while AI processes. After grouping, cards show group label badges. "Re-group" button to re-run. Grouped cards can be displayed in collapsible group sections. This is a tool, not a phase gate — users can group, ungroup, or ignore it entirely.
- **AI Voice Read**: Speaker button (🔊) on each card and on the current discussion card. Calls `POST /api/ai/read-aloud` which uses OpenAI TTS (`tts-1`, `nova` voice) to generate speech from card text. Audio plays in the browser. Click again to stop. Loading spinner while generating. Useful for accessibility and for reading cards aloud during team discussion.
- **AI Read Cards button**: "AI Read Cards" button available in writing and discussing phases. Calls `POST /api/ai/read-cards` (OpenAI gpt-4o-mini). Returns a structured analysis of all cards: quick summary of what the team wrote, key themes identified, overall mood/sentiment, and suggested discussion focus points. Displayed in a dismissable panel below the button. Helps facilitators quickly understand the retro landscape before/during discussion. Can be re-triggered after more cards are added.

**Other**:
- Tag input with autocomplete (search API)
- CSV import/export API routes
- Wire card CRUD through Server Actions + SSE broadcasts

### Phase 6: Discussion Phase
- Fair round-robin sorting algorithm
- Single card view: category label, author badge, blurred text (click to reveal)
- Per-card count-up timer (1-second local interval, resets on SSE `discussion_update` events)
- "Mark Discussed" button (Server Action → sets `isDiscussed=true`, records `discussionDurationSec`, emits event). Persisted in DB — survives page refresh
- "Skip" button (Server Action → sets `isSkipped=true` on the card, emits event). Persisted in DB — skipped cards appear at the end of the queue after refresh. Skipped cards are visually distinct: muted/faded style with a "Skipped" badge, so it's clear the card was already skipped once. Skipped cards can be unskipped by clicking them again in the queue
- Inline action item creation during discussion
- AI Group button still available here if not used during writing
- Participant bar showing online users (from `usePresence`)

### Phase 7: Completion

**Completion screen (inline, immediate)**:
- Confetti animation on entering completed phase
- Validate retro has location, date, and photo
- Show **instant stats** immediately (no LLM needed, computed from DB data):
  - Total retro duration
  - Total cards written (with Mad/Sad/Glad breakdown)
  - Cards discussed vs skipped
  - Most cards by user
  - Longest discussed card (by time)
  - Average discussion time per card
  - Total action items created
- "View Full Stats" link → navigates to `/retros/[id]/stats` for detailed + AI analysis
- "Create Next Retro" form below stats (title required, date required, location optional)
- Undiscussed cards auto carry-over to new retro (set `carriedFromRetroId`)
- Compute `totalDurationSec` from `startedAt` to `completedAt`

**Stats detail page** (`/retros/[id]/stats`):
- Shows all instant stats from completion screen (always available, no loading)
- Below that, an "AI Analysis" section that:
  - Calls OpenAI on first visit (or uses cached result from `statsCache`)
  - Shows loading spinner while generating ("AI is analyzing your retro…")
  - Once generated, displays: theme summary, sentiment breakdown, key takeaways, AI group names/sizes, recurring themes
  - Cached in `statsCache` so subsequent visits are instant
- Trends section (only shown after 2+ retros): card count trend, duration trend, Mad/Sad/Glad ratio trend, action item completion rate from previous retros

### Phase 8: ICS, Settings & Team Stats
- ICS calendar feed: `GET /api/ics/[token]` returns iCalendar with retro events
- Admin page: edit group name, view/rotate ICS token, manage invite links, list all registered users (name, email, avatar, color, join date). No user deletion — just a read-only member list so you know who has access.
- User settings page: edit name, select theme, toggle dark mode, switch locale
- Team stats page (`/stats`): aggregated metrics across all retros with time range filter. Instant stats computed from DB (trends, participation, action items, timing, tags). "Generate AI Analysis" button for on-demand LLM insights (recurring themes, sentiment trend, unresolved patterns). Cached per time range.
- `POST /api/ai/team-stats` route: accepts retroIds + time range, calls OpenAI, returns and caches analysis
- Add "Stats" link to sidebar navigation

### Phase 9: i18n
- `next-intl` setup: `i18n/request.ts` reads locale from cookie, loads messages
- `NextIntlClientProvider` in root layout
- `en.json` + `cs.json` message files covering all UI strings
- Locale toggle component (sets cookie, reloads page)
- Wrap component strings with `useTranslations()`

### Phase 10: Themes & Polish
- Fine-tune all 6 theme CSS files (light + dark variants each)
- PWA install prompt
- Responsive testing across breakpoints
- Loading states (loading.tsx files, spinner component)
- Error boundaries with retry button
- Accessibility: ARIA labels, focus management, keyboard navigation

### Phase 11: Testing & Docker
- Unit tests: sorting, emoji, CSV, ICS, validators, colors
- Integration tests: API routes (cards, phase, stream, import, invite)
- Component tests: card-item, retro-session phases
- Finalize Dockerfile (multi-stage: deps → build → runtime)
- Finalize docker-compose.yml (postgres + minio + app)
- E2E smoke test

---

## Frontend Design Philosophy

Rekapka must feel intentionally designed, not like generic AI-generated UI. Each theme is a distinct aesthetic commitment, not just a color swap. The app should be memorable — something people enjoy using, not just tolerate.

### Design Thinking
- **Purpose**: Team retrospective — reflective, collaborative, slightly playful. People use it after a sprint to be honest about what went wrong and celebrate what went well.
- **Audience**: Small dev teams (~5 people) who appreciate craft and personality in their tools.
- **Differentiator**: The 6 wildly different themes. Switching from iOS Liquid Glass to MS-DOS should feel like entering a completely different world, not just changing colors.

### Typography
- Avoid generic fonts (Inter, Roboto, Arial). Each theme uses a font that reinforces its identity:
  - **Default**: Geist Sans — clean, modern, slightly technical
  - **CLI**: JetBrains Mono — monospace, developer-native
  - **MS-DOS**: Courier New — fixed-width, retro CRT feel
  - **Material 3**: Geist Sans with larger line-height — airy, Google-inspired spacing
  - **Windows 95**: Tahoma — authentic system font from that era
  - **iOS 26**: SF Pro / system font — Apple-native feel
- Use `tabular-nums` for all numeric displays (timers, card counts, stats)
- Card text should have comfortable line-height (1.5+) for readability

### Color & Theme
- Each theme commits fully to its palette. No half-measures:
  - CLI dark mode: pure black background, bright green text — not gray-on-dark-gray
  - MS-DOS dark mode: saturated blue (#0000AA feel via oklch) — not washed-out navy
  - iOS 26: translucent glass with real alpha transparency — not just light gray
- Use CSS variables for every color. One theme file = one complete world
- Dominant color with sharp accent outperforms timid even distribution
- The Mad/Sad/Glad categories should have subtle color differentiation (warm red, muted blue, bright green) that works across all 6 themes

### Motion & Animations

All animations must respect `prefers-reduced-motion` — instant transitions for users who disable motion. Prefer CSS transitions on `transform` and `opacity` for 60fps. Use `animation-delay` for staggered effects.

**Page & Phase Transitions**
- **Phase switch**: Content crossfades (opacity 0→1, 150ms ease) when phase changes. Outgoing phase slides slightly up and fades out, incoming slides up from below and fades in. Not a hard cut.
- **Page load**: Staggered reveal — phase bar appears first (50ms), then participant bar (100ms), then main content (150ms). Subtle `translateY(8px)` → `0` on each.
- **Dashboard retro list**: Cards stagger in on load with 30ms delay between each. New retro slides in at the top when created.

**Card Animations**
- **Card added**: New card slides in from bottom with fade (`translateY(12px)` → `0`, opacity 0→1, 200ms ease-out). Other cards smoothly shift to make room (CSS `gap` transition).
- **Card deleted**: Card shrinks and fades out (`scale(1)→scale(0.95)`, opacity 1→0, 150ms), then list collapses smoothly.
- **Card edited**: Subtle flash/highlight on save — brief border glow (box-shadow pulse) to confirm the edit was saved.
- **Card blur reveal** (discussion phase): `filter: blur(8px)` → `blur(0)` over 300ms with slight scale `1.01` → `1` — feels like focusing a camera lens.
- **Card discussed**: Card slides out to the left with a green checkmark trail before disappearing. Next card slides in from the right.
- **Card skipped**: Card slides out to the right with a muted skip animation. Reappears at the end of the queue with a subtle "Skipped" badge fade-in.

**Interactive Feedback**
- **Button press**: Scale down to `0.97` on `:active` (50ms), back to `1` on release — tactile feel.
- **Send card button**: Brief rotate animation on the send icon (paper plane) when submitting — arrow shoots forward.
- **Phase bar "Next" button**: Gentle pulse glow (box-shadow animation, 2s loop) to draw attention — stops pulsing once clicked.
- **Tab switch** (mobile): Active tab underline slides to the new position (CSS `translateX` transition) rather than jumping. Content crossfades.
- **Emoji picker open**: Popover scales from `0.9` → `1` with fade (100ms ease-out) — bouncy entrance.
- **Delete confirmation**: Card border briefly flashes red before deletion.

**Timer & Progress**
- **Discussion timer**: Digits use `tabular-nums` and crossfade on number change (no layout shift). At 60-second marks, a subtle pulse on the clock icon (scale `1` → `1.15` → `1`, 300ms).
- **Phase bar progress**: When advancing, the completed phase pill background fills with a left-to-right wipe (200ms) before the next phase highlights.

**Celebration & Completion**
- **Confetti**: Full-screen canvas-confetti burst from both bottom corners, 3 seconds of particles. Triggered once on entering completed phase.
- **Stats counter**: Numbers on the completion screen count up from 0 to final value (e.g., "14 cards" counts 0→14 over 800ms, eased). Staggered start per stat card (100ms between each).
- **"View Full Stats" link**: Subtle shimmer/glow effect to invite clicking.

**Presence & Collaboration**
- **User comes online**: Avatar fades in with scale `0.8` → `1` in the participant bar. Green dot pulses once.
- **User goes offline**: Avatar fades to grayscale, green dot fades out.
- **Typing indicator** (if implemented): Three-dot bounce animation in the card input area when another user is typing.

**AI Grouping**
- **AI processing**: Cards scatter slightly (random `translateX/Y` jitter, ±4px) during loading — "thinking" effect. When groups resolve, cards smoothly slide into their group sections with staggered delay.
- **Group collapse/expand**: Chevron rotates 90°, content height animates with `grid-template-rows: 0fr → 1fr` (smooth CSS-only collapse).

**Empty States**
- **No cards yet**: Subtle floating animation on the illustration/icon (gentle `translateY` oscillation, 3s ease-in-out loop) — feels alive, not dead.
- **All cards discussed**: Checkmark draws itself (SVG stroke-dasharray animation) before the "All done!" message fades in.

### Spatial Composition
- **Writing phase (desktop)**: Three equal columns with generous gap — cards breathe, not cramped
- **Discussion phase**: Single card centered with dramatic negative space around it — focus and importance
- **Stats page**: Metric cards in a responsive grid, not a boring vertical stack — allow asymmetry (hero stat larger, secondary stats in 2-3 column grid)
- **Phase bar**: Horizontal stepper with clear visual weight on current phase — not a flat breadcrumb

### Backgrounds & Visual Details
- **Default theme**: Clean white/dark, minimal — the "professional" option
- **CLI theme**: Subtle scanline overlay effect in dark mode (CSS repeating gradient), cursor blink on focused inputs
- **MS-DOS theme**: Hard pixel borders (box-shadow based), no rounded corners anywhere, uppercase text in headers
- **Material 3 theme**: Layered elevation via subtle shadow + tonal surface colors, generous border-radius
- **Windows 95 theme**: Beveled borders (inset/outset box-shadow), classic title bar styling on cards
- **iOS 26 theme**: `backdrop-filter: blur()` on cards for real frosted glass, subtle gradient mesh background

### What to Avoid
- Generic purple-gradient-on-white aesthetic
- Cookie-cutter component layouts with no personality
- Same spacing/sizing for every element (vary to create rhythm)
- Flat, lifeless empty states — make "No cards yet" feel inviting, not dead
- Over-reliance on borders for separation — use spacing and background contrast instead

---

## Web Interface Guidelines

Follow the [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) throughout the entire build. Key rules to apply:

### Accessibility
- Icon-only buttons must have `aria-label` (e.g., theme toggle, emoji picker, delete card, send button)
- All form controls need associated labels (card input, new retro form, settings forms)
- Interactive elements must support keyboard navigation (Tab, Enter, Escape)
- Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<section>`) over generic `<div>` with ARIA roles
- Heading hierarchy must be logical (`h1` → `h2` → `h3`, no skipping)

### Focus States
- All interactive elements need visible focus rings: `focus-visible:ring-*` (Tailwind)
- Never use `outline-none` without a replacement focus style
- Use `:focus-visible` (not `:focus`) so mouse clicks don't show focus rings

### Forms
- Inputs need `autocomplete` attributes (e.g., `autocomplete="name"` on settings name field)
- Use correct input types (`type="email"`, `type="date"`, `type="url"`)
- Never block paste on any input
- Labels must be clickable (wrap input or use `htmlFor`)
- Disable `spellcheck` on email and code inputs

### Animation
- Honor `prefers-reduced-motion`: wrap animations in `@media (prefers-reduced-motion: no-preference)`
- Only animate `transform` and `opacity` for smooth 60fps
- Never use `transition: all` — always specify exact properties
- Confetti and phase transitions must be interruptible

### Typography
- Use ellipsis character (`…`) not three dots
- Use curly quotes (`"` `"`) in user-facing text, not straight quotes
- Use non-breaking spaces (`&nbsp;`) for measurements and brand names
- Use `tabular-nums` font feature for number columns (card counts, timers, stats)

### Content Handling
- All text containers need truncation strategy (`truncate`, `line-clamp-*`, or scroll)
- Handle empty states everywhere (no cards, no retros, no action items, no stats)
- Anticipate long user input (card text, retro titles, user names) — design for overflow

### Images
- Set explicit `width` and `height` on all images (avatars, retro photos)
- Lazy load below-fold images
- Priority load for critical images (user avatar in nav)

### Performance
- Virtualize card lists if they exceed 50 items (unlikely for ~5 users, but guard)
- Avoid layout reads during render
- Prefer uncontrolled inputs where possible (card input can be controlled for emoji insertion)
- Preconnect to CDNs if using external fonts

### Navigation & State
- URL must reflect application state (retro ID in URL, phase visible on load)
- Use semantic `<a>` / `<Link>` for navigation, `<button>` for actions
- Deep-link stateful UI: refreshing the page at any phase should restore the exact view
- Require confirmation for destructive actions (delete retro, delete card)

### Touch & Interaction
- Set `touch-action: manipulation` on swipeable areas (category tabs)
- Set `overscroll-behavior: contain` on scrollable panels to prevent pull-to-refresh interference
- Handle text selection during drag (disable selection on swipe targets)

### Safe Areas
- Use `env(safe-area-inset-*)` for bottom nav on notched devices
- Manage scrollbar appearance across platforms
- Use flex/grid layouts (not absolute positioning)

### Dark Mode
- Apply `color-scheme: dark` when in dark mode
- Set `<meta name="theme-color">` dynamically per theme
- Explicitly style native select elements in dark mode

### Locale & i18n
- Use `Intl.DateTimeFormat` for all dates (retro date, due dates) — never manual formatting
- Use `Intl.NumberFormat` for number display (stats, durations)
- Detect language from cookie, not browser `navigator.language`

### Hydration Safety
- Controlled inputs must have `onChange` handlers
- Guard date/time rendering that differs between server and client (use serialized strings)
- Minimize `suppressHydrationWarning` — only on `<html>` for theme class

### Content & Copy
- Use active voice in UI text ("Create a retro" not "A retro can be created")
- Title Case for headings, sentence case for descriptions
- Specific button labels ("Create Retro" not "Submit", "Mark Discussed" not "Done")
- Error messages must suggest a fix ("No cards yet. Add one above." not just "Empty")

### Anti-patterns to Avoid
- Never disable zoom in viewport meta (`maximum-scale=1` is acceptable, `user-scalable=no` is not)
- Never `preventDefault` on paste events
- Never use `transition: all`
- Never leave form inputs without labels

---

## Haptic Feedback

Use `navigator.vibrate()` for tactile feedback on mobile devices. Android only — iOS Safari does not support this API, so all calls are wrapped in a no-op guard. The app works identically on iOS, just without vibration.

**Helper** (`src/lib/haptics.ts`):
```typescript
function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
```

**Interactions with haptic feedback:**
| Action | Pattern | Feel |
|--------|---------|------|
| Card added | `vibrate(30)` | Light tap — quick confirmation |
| Card deleted | `vibrate([40, 30, 40])` | Double pulse — warning feel |
| Card discussed | `vibrate(50)` | Medium tap — satisfying completion |
| Card skipped | `vibrate([20, 20, 20])` | Triple light — skip rhythm |
| Phase advanced | `vibrate(80)` | Strong tap — significant action |
| Retro completed | `vibrate([50, 50, 50, 50, 100])` | Celebration pattern |
| AI grouping done | `vibrate([30, 40, 30])` | Processing complete |
| Error action | `vibrate([100, 50, 100])` | Alert pattern |
| Timer 60-second mark | `vibrate(15)` | Subtle tick |
| Send card button press | `vibrate(20)` | Light tap on submit |

**Implementation**: Call `vibrate()` inside the existing event handlers (Server Action callbacks, SSE event handlers). No separate hook needed — just import and call at the right moments.

---

## Voice Dictation

Voice-to-text input using the browser's Web Speech API (`SpeechRecognition`). Users tap a mic button, speak, and transcribed text is appended to the input field. Locale-aware — recognizes Czech or English based on the app locale.

**Where it appears:**
- Card input (writing phase) — next to the emoji picker button
- Discussion notes textarea (discussing phase)
- Action item input (discussing phase)

**Hook** (`src/hooks/use-speech-recognition.ts`):
- Maps app locale to speech locale (`"cs"` → `"cs-CZ"`, `"en"` → `"en-US"`)
- Uses `webkitSpeechRecognition` (Chrome) with `SpeechRecognition` fallback (Safari)
- `continuous: false`, `interimResults: true` — single utterance, shows interim text
- Returns `{ isListening, isSupported, transcript, start, stop, toggle }`

**Component** (`src/components/retro/dictation-button.tsx`):
- Mic icon (idle) or MicOff icon with pulsing red ring (listening)
- Hidden if browser doesn't support Speech API (graceful degradation)
- Haptic feedback: `vibrate(20)` on start, `vibrate(30)` on transcript received

**Browser support**: Chrome (desktop + Android), Safari (iOS 14.5+ / macOS). Not supported on Firefox — button hidden.

---

## Docker Compose Services

```yaml
services:
  db:
    image: postgres:16-alpine
    ports: ["127.0.0.1:${DB_PORT:-5433}:5432"]
    volumes: [./data/postgres:/var/lib/postgresql/data]
    environment: { POSTGRES_DB: rekapka, POSTGRES_USER: rekapka, POSTGRES_PASSWORD: ${DB_PASSWORD} }
    healthcheck: pg_isready

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports: ["127.0.0.1:9000:9000", "127.0.0.1:9001:9001"]
    volumes: [./data/minio:/data]
    environment: { MINIO_ROOT_USER: ${S3_ACCESS_KEY}, MINIO_ROOT_PASSWORD: ${S3_SECRET_KEY} }

  minio-init:
    image: minio/mc:latest
    depends_on: { minio: { condition: service_healthy } }
    # Creates bucket and sets public read on photos/

  app:
    build: { context: ., dockerfile: Dockerfile }
    ports: ["127.0.0.1:3000:3000"]
    depends_on: { db: service_healthy, minio: service_healthy }
    environment: { DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, OPENAI_API_KEY, S3_ENDPOINT, ... }
```

---

## Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Real-time | SSE + Server Actions | No custom server needed. Standard Next.js. Deployable anywhere. Browser handles SSE reconnect. Sufficient for ~5 users |
| i18n | next-intl, cookie-based locale | Clean URLs, App Router native, only 2 locales |
| S3 storage | MinIO + @aws-sdk/client-s3 | S3-compatible, self-hosted, standard SDK |
| Auth | NextAuth v5 + Google + invite tokens | No email service needed, static invite URLs |
| DB | Drizzle ORM + PostgreSQL 16 | Type-safe, lightweight, migration support |
| Themes | 6 CSS variable themes + next-themes | Each theme = one CSS file overriding custom properties |
| shadcn/ui style | base-nova (`@base-ui/react`) | Uses `render` prop for composition (not `asChild`) |
| AI client | Lazy initialization | `new OpenAI()` inside functions, not at module level (avoids build errors when env var missing) |
| Date serialization | `JSON.parse(JSON.stringify())` | Dates can't cross Server→Client component boundary; serialize to ISO strings |
| Event coordination | In-memory EventEmitter | Simple, no external dependencies (Redis/Pub-Sub). Sufficient for single-instance deployment with ~5 users |

---

## Verification Checklist

1. `docker compose up` — all 3 services start healthy
2. Visit localhost:3000 — landing page renders
3. Google OAuth login works
4. Create invite link, open in incognito — new user registered
5. Create retro → write cards in all 3 categories → see real-time updates in second browser
6. Trigger AI grouping → cards get group labels
7. Enter discussion → cards in fair order, blur works, timer counts up
8. Skip card → goes to end, mark discussed → next card
9. Complete retro → confetti, carry-over form, stats generated
10. Switch themes (all 6), dark mode, language (CS/EN) — all work
11. Download ICS, import to calendar
12. `pnpm test` — all tests pass
