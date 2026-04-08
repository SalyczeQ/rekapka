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

