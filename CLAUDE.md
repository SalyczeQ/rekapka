# Rekapka

Retrospective app for small teams (~5 users). Single-group, real-time, with AI-powered stats.

## Tech Stack

- **Frontend**: Next.js 16.2.1 (App Router), React 19, TypeScript 5
- **UI**: shadcn/ui (base-nova style), Tailwind CSS 4, next-themes, 6 themes
- **Backend**: Standard Next.js server (no custom server)
- **Database**: PostgreSQL 16 + Drizzle ORM
- **Auth**: NextAuth v5 (Google OAuth + invite token links)
- **Real-time**: SSE (Server-Sent Events) for server→client push + Server Actions for client→server mutations
- **AI**: OpenAI API (gpt-4o-mini) for card grouping and stats
- **Storage**: MinIO (S3-compatible) for retro photos
- **Testing**: Vitest + React Testing Library
- **i18n**: CS/EN translation files (next-intl ready)
- **Deployment**: Docker Compose (app + postgres + minio)

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
Draft → Writing → Grouping (optional) → Discussing → Completed
```

### Database Schema
Tables: `users`, `accounts`, `verification_tokens`, `app_settings`, `invite_tokens`, `retros`, `categories`, `cards`, `tags`, `card_tags`, `action_items`

Schema defined in `src/lib/db/schema.ts`

### Real-time (SSE + Server Actions)
- **Event bus**: `src/lib/realtime/event-bus.ts` — in-memory EventEmitter keyed by retroId
- **Stream factory**: `src/lib/realtime/stream.ts` — creates ReadableStream subscribed to event bus
- **SSE endpoint**: `GET /api/retros/[id]/stream` — returns SSE stream, authenticated via session
- **Client hook**: `src/hooks/use-retro-stream.ts` — EventSource with auto-reconnect
- Server Actions in `src/lib/actions/` emit events on the bus after each mutation

### Key Patterns
- **shadcn/ui base-nova**: Uses `@base-ui/react` — use `render` prop instead of `asChild` for composition
- **Server Actions**: In `src/lib/actions/` — used for form submissions and mutations, emit SSE events
- **API Routes**: In `src/app/api/` — used for data fetching and external integrations
- **AI modules**: Lazy-init OpenAI client (no top-level instantiation to avoid build errors)

## File Structure

```
src/app/          — Next.js App Router pages
src/components/   — React components (ui/, layout/, retro/, shared/, stats/)
src/hooks/        — Client-side hooks (SSE stream, presence, timer, swipe)
src/lib/          — Server-side logic (db, auth, ai, actions, realtime, csv, ics, s3)
src/lib/realtime/ — SSE event bus and stream factory
src/styles/       — Theme CSS files
src/types/        — TypeScript types (including realtime.ts for SSE events)
```
