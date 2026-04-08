# Rekapka

Retrospective app for small teams (~5 users). Single-group, real-time, with AI-powered stats.

## Tech Stack

- **Frontend**: Next.js 16.2.1 (App Router), React 19, TypeScript 5
- **UI**: shadcn/ui (base-nova style), Tailwind CSS 4, next-themes, 6 themes
- **Backend**: Standard Next.js server (no custom server)
- **Database**: PostgreSQL 16 + Drizzle ORM
- **Auth**: NextAuth v5 (Google OAuth + invite token links)
- **Real-time**: SSE (Server-Sent Events) for server→client push + Server Actions for client→server mutations
- **AI**: OpenAI API (gpt-4o-mini) for card grouping, stats, read cards analysis, voice TTS, author guessing
- **Storage**: MinIO (S3-compatible) for retro photos
- **Testing**: Vitest + React Testing Library
- **i18n**: CS/EN translation files (next-intl, cookie-based locale)
- **Deployment**: Docker Compose (app + postgres + minio), auto-migration on startup

## Commands

```bash
pnpm dev              # Dev server
pnpm build            # Next.js production build
pnpm start            # Production server
pnpm lint             # ESLint
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report
pnpm db:generate      # Generate Drizzle migration
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to DB
pnpm db:seed          # Seed app settings
pnpm db:studio        # Drizzle Studio
docker compose up     # Start full stack (db + minio + app)
```

## Architecture

### Retro Phase Flow
```
Writing → Discussing → Completed
```
Admin can revert from Discussing back to Writing (resets timer and card discussion data).

### Database Schema
Tables: `users`, `accounts`, `verification_tokens`, `app_settings`, `invite_tokens`, `retros`, `categories`, `cards`, `tags`, `card_tags`, `action_items`

Key columns on `cards`: `guessed_author` (AI-guessed name for anonymous imports), `author_id` (FK to users, nullable for Anonymous system user `00000000-...`)

Schema defined in `src/lib/db/schema.ts`

### Real-time (SSE + Server Actions)
- **Event bus**: `src/lib/realtime/event-bus.ts` — in-memory EventEmitter on `globalThis` (must use `getEmitter()` getter, NOT module-level const — Next.js bundles Server Actions separately)
- **Stream factory**: `src/lib/realtime/stream.ts` — creates ReadableStream subscribed to event bus
- **SSE endpoint**: `GET /api/retros/[id]/stream` — returns SSE stream, authenticated via session
- **Client hook**: `src/hooks/use-retro-stream.ts` — EventSource with auto-reconnect
- Server Actions in `src/lib/actions/` emit events on the bus after each mutation
- **Event types**: `card_added`, `card_updated`, `card_deleted`, `phase_changed`, `group_updated`, `discussion_update`, `action_item_added`, `action_item_updated`, `action_item_deleted`, `retro_updated`, `presence`

### Key Patterns
- **shadcn/ui base-nova**: Uses `@base-ui/react` — use `render` prop instead of `asChild` for composition
- **Server Actions**: In `src/lib/actions/` — used for form submissions and mutations, emit SSE events
- **API Routes**: In `src/app/api/` — used for data fetching, AI endpoints, and external integrations
- **AI modules**: Lazy-init OpenAI client (no top-level instantiation to avoid build errors)
- **Haptic feedback**: `src/lib/haptics.ts` — `vibrate()` wrapper for mobile (Android only, no-op on iOS)
- **Translations**: Add keys to both `src/lib/i18n/messages/en.json` and `cs.json`. Restart dev server after changes (Turbopack caches translations). Use actual characters, NOT `\u` escapes in JSX strings.
- **Docker migrations**: `docker-entrypoint.sh` runs `migrate.mjs` (drizzle-orm migrator) at startup. Add `---> statement-breakpoint` between SQL statements in migration files.
- **Admin features**: Some features gated to `salay14@gmail.com` (delete retro, revert phase)
- **Brand color**: `#1A6B5A` teal — used in logo, favicon, default theme primary

## AI Features

- **AI Group Cards**: `POST /api/ai/group` — clusters cards by theme
- **AI Read Cards**: `POST /api/ai/read-cards` — analyzes cards for summary, themes, mood, focus points
- **AI Voice Read**: `POST /api/ai/read-aloud` — OpenAI TTS, returns MP3 audio
- **AI Stats**: `POST /api/ai/stats` — generates retro stats with LLM summary, cached in `statsCache`
- **AI Team Stats**: `POST /api/ai/team-stats` — cross-retro analysis with recurring themes
- **AI Guess Authors**: `POST /api/ai/guess-authors` — re-guesses anonymous card authors using confirmed assignments as training data

## File Structure

```
src/app/              — Next.js App Router pages
src/app/(app)/        — Authenticated app pages (retros, settings, admin, stats)
src/app/(app)/retros/[id]/cards/ — Cards list page with author filter
src/app/api/ai/       — AI endpoints (group, read-cards, read-aloud, stats, team-stats, guess-authors)
src/components/       — React components (ui/, layout/, retro/, shared/, stats/, admin/)
src/hooks/            — Client-side hooks (SSE stream, discussion timer, swipe, speech recognition)
src/lib/              — Server-side logic (db, auth, ai, actions, realtime, csv, ics, s3, haptics, colors)
src/lib/realtime/     — SSE event bus and stream factory
src/styles/           — Theme CSS files (default, cli, msdos, material3, windows, ios26)
src/types/            — TypeScript types (index, serialized, realtime)
drizzle/              — SQL migration files (schema + legacy retro imports)
scripts/              — Migration generator script
```

## Legacy Retro Imports

22 retros (#2-#30) imported from a previous system via SQL migrations. Anonymous cards use system user `00000000-0000-4000-8000-000000000000` with AI-guessed authors in `guessed_author` column. Users can confirm/change guesses on the `/retros/[id]/cards` page. Admin can recalculate guesses from `/admin`.
