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
- Admin page: edit group name, view/rotate ICS token, manage invite links. AI Author Guessing section with recalculate button and stats.
- User settings page: split into Profile (name, email) and Appearance (theme, card color picker, language, dictation toggle) cards
- Card color picker: 10 predefined colors from `CARD_COLORS` palette, clickable circles with checkmark
- Team stats page (`/stats`): aggregated metrics across all retros with time range filter. Instant stats computed from DB (trends, participation, action items, timing, tags). "Generate AI Analysis" button for on-demand LLM insights (recurring themes, sentiment trend, unresolved patterns).
- `POST /api/ai/team-stats` route: accepts retroIds + time range, calls OpenAI, returns analysis
- Add "Stats" link to sidebar navigation

### Phase 8.5: AI Features
- **AI Read Cards**: `POST /api/ai/read-cards` — summary, themes, mood, focus points. Button in writing + discussing phases.
- **AI Voice Read**: `POST /api/ai/read-aloud` — OpenAI TTS. Speaker button on each card and discussion view.
- **AI Guess Authors**: `POST /api/ai/guess-authors` — re-guesses anonymous card authors. Admin recalculate button.
- **Speech Dictation**: Web Speech API mic button on card inputs (toggle in settings). SSR-safe with deferred `isSupported` check.
- **Haptic Feedback**: `navigator.vibrate()` on card actions, phase transitions, AI grouping, timer ticks, errors, completion.

### Phase 8.6: Legacy Data Import
- 22 retros (#2-#30) imported via SQL migrations from CSV exports and pasted data
- Anonymous user system (`00000000-...`) for cards without known author
- `guessed_author` column with GPT-4o-mini guesses based on writing style
- Cards page (`/retros/[id]/cards`): author filter pills, confirm/change/assign with 5-second undo
- Migration generator script: `scripts/generate-migrations.mjs`
- Docker entrypoint runs `migrate.mjs` (drizzle-orm migrator) at startup

### Phase 8.7: Completion & Dashboard Polish
- Completion page: upload photo, edit location, carry over undiscussed+skipped cards, clickable Total Cards → cards list
- Dashboard: active/completed sections, card counts, duration, photo thumbnails, locale-aware dates
- Admin-only: delete retro (2-step confirmation), revert to writing phase (resets timer + card data)
- Favicon: SVG "R" on teal background, apple-touch-icon
- Brand: logo component (mirrored R), teal `#1A6B5A` primary color, matching retro.vtichy.com

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

