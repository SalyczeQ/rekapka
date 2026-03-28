# Supabase coupling inventory

Generated 2026-03-28. Tracks every touchpoint that must change to remove Supabase.

## Package dependencies

| Package | Used for | Location |
|---------|----------|----------|
| `@supabase/ssr` | Browser & server client creation, middleware session refresh | `src/lib/supabase/*`, `src/middleware.ts`, `src/app/api/ics/[token]/route.ts` |
| `@supabase/supabase-js` | Transitive dep of `@supabase/ssr` | `package.json` |

## Lib helpers (`src/lib/supabase/`)

| File | Purpose | Replacement |
|------|---------|-------------|
| `client.ts` | `createBrowserClient` for client components | Remove — client components will call API routes / server actions |
| `server.ts` | `createServerClient` for server components & route handlers | Replace with Drizzle queries + app-owned auth session |
| `middleware.ts` | `updateSession` — refreshes Supabase auth cookies in middleware | Replace with app-owned session middleware (Auth.js) |
| `types.ts` | Generated `Database` type + helper generics (`Tables`, `TablesInsert`, etc.) | Replace with Drizzle schema inference (`typeof users.$inferSelect`) |

## Middleware (`src/middleware.ts`)

- Imports `updateSession` from `@/lib/supabase/middleware`
- Creates its own `createServerClient` to call `supabase.auth.getUser()`
- **Auth coupling**: session refresh + auth guard for protected routes

## Auth flow files

| File | Supabase usage |
|------|----------------|
| `src/app/login/page.tsx` | `signInWithPassword`, `signInWithOAuth` (Google) |
| `src/app/signup/page.tsx` | `signUp`, `signInWithOAuth` (Google) |
| `src/app/auth/callback/route.ts` | `exchangeCodeForSession`, `getUser`, upserts `users` row |
| `src/components/shared/sign-out-button.tsx` | `supabase.auth.signOut()` |

## Server-side data access (server components & route handlers)

These use `createClient()` from `@/lib/supabase/server`:

| File | Tables touched | Operations |
|------|---------------|------------|
| `src/app/app/page.tsx` | `team_members` | Read memberships for team selector |
| `src/app/app/layout.tsx` | auth only | `getUser()` |
| `src/app/app/[team-slug]/page.tsx` | `teams`, `retros`, `action_items` | Dashboard read |
| `src/app/app/[team-slug]/layout.tsx` | `teams`, `team_members` | Auth + team access guard |
| `src/app/app/[team-slug]/retros/page.tsx` | `teams`, `retros` | Retro list |
| `src/app/app/[team-slug]/retros/[id]/page.tsx` | `teams`, `retros`, `categories`, `cards`, `votes`, `team_members` | Full retro read |
| `src/app/api/retros/[id]/cards/route.ts` | `retros`, `team_members`, `cards`, `categories` | GET + POST cards |
| `src/app/api/retros/[id]/votes/route.ts` | `retros`, `team_members`, `cards`, `votes` | POST + DELETE votes |
| `src/app/api/retros/[id]/phase/route.ts` | `retros`, `team_members` | PATCH retro status |
| `src/app/api/retros/[id]/complete/route.ts` | `retros`, `team_members`, `cards`, `categories` | Complete retro + carry-over |
| `src/app/api/retros/[id]/export/route.ts` | `retros`, `team_members`, `cards`, `categories`, `users`, `votes`, `card_tags`, `tags` | CSV export |
| `src/app/api/ai/group/route.ts` | `retros`, `team_members`, `cards` | AI grouping |
| `src/app/api/ai/stats/route.ts` | `retros`, `team_members`, `categories`, `cards`, `votes` | AI stats |
| `src/app/api/ics/[token]/route.ts` | `teams`, `retros` | ICS feed (creates own `createServerClient`) |

## Client-side direct DB access (browser → Supabase REST)

These use `createClient()` from `@/lib/supabase/client` — **highest migration risk** because they bypass app server:

| File | Tables touched | Operations |
|------|---------------|------------|
| `src/components/team/create-team-dialog.tsx` | `teams`, `team_members` | Insert team + membership |
| `src/components/team/invite-modal.tsx` | `users`, `team_members` | Lookup user, insert membership |
| `src/components/team/member-list.tsx` | `team_members`, `users` | Read members |
| `src/components/cards/tag-input.tsx` | `tags` | Autocomplete search |
| `src/components/retro/retro-metadata.tsx` | `retros` | Update title/location, upload photo |
| `src/components/retro/retro-session.tsx` | `cards`, `votes`, `retros` | Insert/update/delete cards & votes, update status |
| `src/components/retro/phase-actions.tsx` | `action_items` | CRUD action items |
| `src/app/app/[team-slug]/retros/new/page.tsx` | `teams`, `retros`, `categories` | Create retro |
| `src/app/app/[team-slug]/retros/[id]/stats/page.tsx` | `cards` | Read card stats |
| `src/app/app/[team-slug]/actions/page.tsx` | `teams`, `retros`, `action_items` | Read/update actions |
| `src/app/app/[team-slug]/settings/page.tsx` | `teams` | Read/update team settings |

## Realtime subscriptions (Supabase Realtime channels)

| File | Channel / pattern | Purpose |
|------|-------------------|---------|
| `src/components/retro/retro-session.tsx` | `postgres_changes` on `cards`, broadcast `retro-phase-*` | Live card sync, phase broadcast |
| `src/components/retro/participant-bar.tsx` | `presence` channel | Who is viewing the retro |
| `src/components/retro/timer-display.tsx` | `broadcast` channel `timer-*` | Timer sync |
| `src/components/retro/phase-actions.tsx` | `postgres_changes` on `action_items` | Live action item sync |
| `src/hooks/use-realtime-cards.ts` | `postgres_changes` on `cards` | Card list refresh |
| `src/hooks/use-timer.ts` | `broadcast` channel `timer:*` | Timer events |
| `src/hooks/use-retro-phase.ts` | `broadcast` channel `phase:*` | Phase change events |

## Storage (Supabase Storage)

| File | Bucket | Operations |
|------|--------|------------|
| `src/components/retro/retro-metadata.tsx` | `photos` | Upload photo, get public URL |

## Infrastructure (docker-compose.yml)

Services that will be removed: `auth`, `realtime`, `rest`, `storage`, `imgproxy`, `meta`, `kong`, `studio`
Services that stay: `db` (swap image to plain postgres), `app`

## Environment variables to retire

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `SECRET_KEY_BASE`
- `PGRST_*`
- `GOTRUE_*`

## Environment variables to add

- `DATABASE_URL` — direct postgres connection string
- Auth.js variables (when auth migration happens)
