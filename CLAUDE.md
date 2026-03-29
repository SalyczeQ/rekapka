# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Rekapka is a mobile-first retrospective tool for agile teams with real-time collaboration, AI-powered card grouping, and team management. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and PostgreSQL via Drizzle ORM.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (standalone output for Docker)
npm run lint         # ESLint
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Run migrations against DATABASE_URL
npm run db:push      # Push schema directly (no migration files)
npm run db:studio    # Open Drizzle Studio GUI
```

Deployment uses Docker multi-stage build via `Dockerfile` + `docker-compose.yml` (PostgreSQL 15 + Next.js).

## Architecture

### Database & ORM
- **Schema**: `src/lib/db/schema.ts` — 12+ tables (users, teams, retros, cards, votes, action items, tags, etc.) using UUIDs, with Drizzle ORM type-safe queries
- **Connection**: `src/lib/db/index.ts` — single postgres.js pool (`max: 10`)
- **Migrations**: `drizzle/` directory, configured in `drizzle.config.ts`
- Enum-like patterns use `as const` string union arrays (e.g., `retroStatuses`, `retroTemplates`, `teamRoles`)

### Authentication
- NextAuth.js v5 beta (`src/lib/auth/index.ts`) with JWT sessions, DrizzleAdapter
- Providers: Google OAuth + email/password (bcrypt)
- Session helper: `src/lib/auth/session.ts`
- Custom sign-in page at `/login`

### Server Actions & Validation
- Server actions in `src/lib/actions/` (auth, retro, retro-session, team, settings, action-items)
- Zod schemas in `src/lib/validators.ts` for input validation
- All mutations go through server actions, not direct API calls

### API Routes (`src/app/api/`)
- `/api/auth/[...nextauth]` — Auth.js handler
- `/api/retros/[id]/{cards,votes,phase,complete,status,export}` — retro operations
- `/api/ai/{group,stats}` — OpenAI GPT-4o-mini integration for card grouping and stats
- `/api/teams/[id]/members` — team management
- `/api/uploads/retro-photo` — file uploads (local filesystem)
- `/api/tags/search`, `/api/ics/[token]`, `/api/health`

### Frontend
- **Pages**: `src/app/` — App Router with layouts for `/app/*` (authenticated), `/login`, `/signup`
- **Components**: `src/components/` organized by feature (cards, retro, team, actions, layout, shared, ui)
- **UI**: shadcn/ui + Base UI React, Lucide icons, Sonner toasts
- **Themes**: 5 themes (default, cli, msdos, material3, windows) via CSS variables in `src/styles/themes/`
- **Hooks**: `src/hooks/` — `use-realtime-cards`, `use-realtime-presence`, `use-retro-phase`, `use-theme`, `use-timer`

### Real-time
Currently polling-based (hooks poll API endpoints). Retro phases: draft → writing → grouping → voting → discussing → actions → completed.

### Path alias
`@/*` maps to `./src/*` (tsconfig paths).

## Environment Variables

Key env vars (see `docker-compose.yml`): `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`.
