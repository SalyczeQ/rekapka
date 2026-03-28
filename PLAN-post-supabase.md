# Rekapka migration plan: remove Supabase, keep PostgreSQL

## Goal
Replace Supabase (auth, SSR helpers, realtime, storage, REST gateway, Studio coupling) with a simpler architecture based on:
- Next.js app
- plain PostgreSQL
- app-owned auth/session layer
- app-owned SQL access layer
- optional app-owned realtime mechanism only where actually needed
- optional local file/object storage for uploaded images

## Why this change
Current stack complexity is high for the product stage:
- many containers and moving parts
- runtime instability already visible (`realtime` restarting, `studio` unhealthy)
- app is tightly coupled to Supabase APIs even though most domain logic is app-specific
- persistence requirement can be satisfied by PostgreSQL alone

## Constraints from current product
From PLAN.md and repo state, the app currently depends on Supabase for:
1. authentication/session retrieval
2. database CRUD from both server and client components
3. realtime card/vote/presence/timer sync
4. storage for retro photos
5. row-level access assumptions baked into client-side direct DB usage

## Recommended target architecture

### 1) Database
- Keep PostgreSQL
- Keep SQL migrations in-repo
- Stop using Supabase-specific bootstrap/RLS assumptions
- Move to app-managed schema and permissions

### 2) Auth
Recommended:
- NextAuth/Auth.js with:
  - Google OAuth
  - credentials/email-password only if still required
- Store app users in PostgreSQL
- Use secure cookie sessions or DB-backed sessions

Alternative:
- Lucia or custom auth

Recommendation: use **Auth.js** because it fits Next.js best and reduces custom auth footguns.

### 3) Data access
Recommended:
- Drizzle ORM + drizzle-kit migrations
or
- Kysely + raw SQL migrations

Recommendation: use **Drizzle** for schema clarity and incremental migration speed.

### 4) Realtime
Do **not** rebuild everything at once.
Phase it:
- Phase A: remove Supabase first, temporarily degrade realtime to polling/server refresh where acceptable
- Phase B: add focused realtime only for:
  - presence
  - live card updates
  - vote counts
  - timer sync

Recommended implementation options:
- Postgres `LISTEN/NOTIFY` + WebSocket/SSE bridge in app
- or a small Socket.IO/WebSocket layer backed by DB writes

Recommendation: start with **SSE or polling**, then add **LISTEN/NOTIFY + WS/SSE** only where needed.

### 5) File storage
For retro photos:
- simplest: local filesystem volume mounted into app container
- better later: S3-compatible object storage

Recommendation now: **local disk storage** under mounted volume, with clear abstraction to swap later.

## Best execution strategy
Do this in **three main deliveries**, not one giant rewrite.

### Delivery 1 — create parallel app-owned backend foundations
Goal: introduce non-Supabase plumbing while app still runs.

Tasks:
- add DB layer (Drizzle)
- model current schema in app-owned form
- add Auth.js setup
- add user/team/session helpers
- add internal server-side repositories/services
- add app API routes for core operations currently performed directly via Supabase client
- create storage abstraction for photos

Output:
- new backend foundation exists in parallel
- no full cutover yet

### Delivery 2 — migrate reads/writes off Supabase client APIs
Goal: stop using `@supabase/supabase-js` and `@supabase/ssr` in app code.

Tasks:
- replace `src/lib/supabase/*`
- replace server auth lookups with Auth.js session helpers
- replace client-side direct DB calls with API actions / server actions / route handlers
- migrate these flows first:
  1. login/signup/session
  2. team selector
  3. create retro
  4. retro read page
  5. actions page
  6. settings/team membership

Output:
- all core CRUD handled by app layer
- Supabase SDK no longer needed for core app use

### Delivery 3 — remove Supabase infrastructure and finish parity
Goal: app runs on Next.js + PostgreSQL only.

Tasks:
- replace photo uploads with local storage implementation
- replace realtime with minimal polling or SSE
- remove Supabase services from docker-compose
- update env vars and deployment docs
- run schema/data migration if needed
- test end-to-end flows
- redeploy simplified stack

Output:
- `docker-compose.yml` reduced to app + db (+ optional reverse proxy/tooling)

## First bigger task: remove Supabase — concrete implementation plan

### Step 1: inventory all Supabase coupling
Identify and replace:
- package deps: `@supabase/ssr`, `@supabase/supabase-js`
- lib helpers: `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`, `types.ts`
- middleware auth coupling
- client components calling `.from(...)`
- server components calling `.auth.getUser()` and `.from(...)`
- any storage and realtime hooks depending on Supabase semantics

### Step 2: choose replacement stack
Decision:
- Auth.js for auth
- Drizzle for DB access
- local file storage for uploads
- temporary polling/SSE for realtime-sensitive pages

### Step 3: preserve current data model, not current implementation
Port entities from PLAN.md into app-owned schema:
- users
- teams
- team_members
- retros
- categories
- cards
- tags
- card_tags
- votes
- action_items

Avoid porting Supabase-specific auth tables or RLS logic.

### Step 4: move all trust boundaries server-side
Important change:
- client should stop talking directly to DB-equivalent APIs
- client calls app routes/server actions
- authorization happens in app service layer

This is the biggest architectural improvement.

### Step 5: define migration order by user-visible risk
Best order:
1. auth/session
2. team and membership lookup
3. retro creation/read
4. cards CRUD
5. votes
6. actions
7. uploads
8. realtime parity
9. stats/grouping endpoints cleanup

## Immediate repo work — progress tracker

### A. Create migration branch
- [x] branch: `feat/remove-supabase-foundation`

### B. Add planning docs
- [x] this file (`PLAN-post-supabase.md`)
- [x] Supabase coupling inventory (`docs/supabase-coupling-inventory.md`)

### C. Add backend foundation without breaking UI
- [x] install Drizzle + postgres.js packages
- [x] add `src/lib/db/index.ts` (connection pool)
- [x] add `src/lib/db/schema.ts` (full Drizzle schema — all 12 tables)
- [x] add `drizzle.config.ts`
- [x] generate Drizzle init migration (`drizzle/0000_init.sql`)
- [x] add health route using Drizzle (`src/app/api/health/route.ts`)
- [x] install Auth.js v5 (next-auth@beta) + @auth/drizzle-adapter + bcryptjs
- [x] add `src/lib/auth/index.ts` (Auth.js config: Google OAuth + credentials)
- [x] add `src/app/api/auth/[...nextauth]/route.ts`
- [x] add `docker-compose.clean.yml` (plain postgres:15 + app only)
- [x] update `.env.example` with new vars (DATABASE_URL, AUTH_SECRET, AUTH_URL)
- [x] add db:* scripts to package.json
- [x] create `src/lib/auth/session.ts` — `getSessionUser()` server helper
- [x] add signup server action (hash password, create user) — `src/lib/actions/auth.ts`
- [x] add sign-in, sign-out, Google OAuth actions — `src/lib/actions/auth.ts`
- [x] add create-team server action — `src/lib/actions/team.ts`

### D. Do first functional cutover
- [x] convert team selector to use Drizzle queries (server component)
- [x] wire new auth into proxy (replaces Supabase middleware, uses `getToken`)
- [x] convert login/signup pages to use Auth.js actions
- [x] convert app layout + team layout to use Auth.js `auth()`
- [x] convert team dashboard (`/app/[team-slug]/page.tsx`) to Drizzle
- [x] convert retro list page (`/app/[team-slug]/retros/page.tsx`) to Drizzle
- [x] migrate `middleware.ts` → `proxy.ts` (Next 16 convention)
- [x] convert retro creation path to Drizzle + server action (`src/lib/actions/retro.ts`)
- [x] convert retro detail page to Drizzle (maps to snake_case for RetroSession compat)
- [x] convert actions page to Drizzle (server component + client component split)
- [x] convert settings page to Drizzle (server component + client component split)
- [x] convert retro stats page to Drizzle (server component + client component split)
- [x] convert all 5 retro API routes (cards, votes, phase, complete, export) to Drizzle
- [x] convert AI API routes (group, stats) to Drizzle
- [x] convert ICS API route to Drizzle
- [x] convert member-list and invite-modal components to server actions + API
- [x] create `/api/teams/[id]/members` route
- [x] remove dead `src/app/auth/callback/route.ts`

### E. Client components migrated off Supabase
- [x] `retro-session.tsx` — uses polling via hooks + API routes
- [x] `phase-actions.tsx` — uses server actions
- [x] `participant-bar.tsx` — simplified (current user only, pending WS)
- [x] `timer-display.tsx` — local timer (pending WS sync)
- [x] `retro-metadata.tsx` — uses `/api/uploads/retro-photo`
- [x] `tag-input.tsx` — uses `/api/tags/search`
- [x] hooks: `use-realtime-cards`, `use-retro-phase`, `use-realtime-presence`, `use-timer` — polling-based
- [x] remove `src/lib/supabase/` directory
- [x] remove `@supabase/*` packages from package.json

### F. Cleanup pass (simplification)
- [x] removed `src/lib/auth/api.ts` (unused exports)
- [x] removed `src/lib/card-ordering.ts` (unused)
- [x] removed `supabase/migrations/` directory (ported to Drizzle)
- [x] removed legacy `docker-compose.yml`, promoted `docker-compose.clean.yml`
- [x] removed `docker/kong/` (only used by Supabase gateway)
- [x] removed `docs/supabase-coupling-inventory.md` (completed)
- [x] removed Supabase image patterns from `next.config.ts`
- [x] removed legacy Supabase env vars from `.env`, `.env.example`, `.env.local`

## Risks
- realtime feature regression if done too aggressively
- auth migration complexity if existing users/data matter
- direct-client DB assumptions currently spread through UI code
- file upload replacement needs care around serving URLs and volume mounts

## Mitigations
- keep first cutover server-rendered and simple
- use feature-by-feature migration, not big bang
- preserve schema names where useful to reduce rewrite scope
- accept temporary polling before perfect realtime

## Suggested agent/team setup
Best team for this task is not many parallel coders stomping each other. Use a small focused team:

1. **Planner / architect**
   - owns migration plan
   - tracks cutover order
   - reviews every change for simplification

2. **Backend migration agent**
   - Auth.js + Drizzle + API layer
   - schema and service code

3. **Frontend adaptation agent**
   - replaces Supabase client usage in pages/components
   - moves flows to server actions/routes

4. **Deployment / ops agent**
   - simplifies compose
   - redeploy plan
   - backups and runtime checks

If only one agent should code first, pick the **backend migration agent**. That unlocks everything else.

## Definition of done for the Supabase-removal epic
- app runs without `@supabase/*` packages
- no Supabase services required in docker-compose
- auth works
- core retro flows work against PostgreSQL
- photo persistence works
- at least acceptable non-broken collaborative behavior exists
- docs and deployment updated

## Practical next action (updated 2026-03-28)
All Supabase code, packages, infrastructure, and env vars have been removed.
Auth.js + Drizzle are the sole backend. Realtime uses polling (3s) as a temporary measure.

**Remaining work (enhancement, not migration):**
1. Replace polling hooks with SSE or WebSocket for lower latency
2. Add multi-user presence tracking (currently shows only current user)
3. Add cross-client timer sync via SSE/WS
