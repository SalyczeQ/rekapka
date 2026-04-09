# Rekapka — Build Plan

A real-time retrospective app for small teams (~5 users). One shared group, three card categories (Mad/Sad/Glad), real-time collaboration via SSE + Server Actions, AI-assisted card grouping and stats, six visual themes, and full Czech/English localization.

## Plan Documents

Detailed plans are split into focused files in the `plan/` folder:

| File | Contents |
|------|----------|
| [01-tech-stack-and-schema.md](plan/01-tech-stack-and-schema.md) | Tech stack, database schema (11 tables) |
| [02-retro-phases-and-stats.md](plan/02-retro-phases-and-stats.md) | Retro phase flow (Writing → Discussing → Completed), fair card sorting, stats page spec |
| [03-realtime-and-themes.md](plan/03-realtime-and-themes.md) | SSE + Server Actions architecture, 6 visual themes |
| [04-file-structure.md](plan/04-file-structure.md) | Full file structure with all routes, components, hooks, libs |
| [05-implementation-phases.md](plan/05-implementation-phases.md) | Phase 0-11 implementation plan, AI features, legacy data import, completion polish |
| [06-frontend-design.md](plan/06-frontend-design.md) | Design philosophy, typography, color, animations, spatial composition |
| [07-web-interface-guidelines.md](plan/07-web-interface-guidelines.md) | Accessibility, forms, focus states, touch, dark mode, i18n, anti-patterns |
| [08-haptics-dictation-docker.md](plan/08-haptics-dictation-docker.md) | Haptic feedback patterns, voice dictation, Docker Compose services |
| [09-decisions-and-checklist.md](plan/09-decisions-and-checklist.md) | Key technical decisions, verification checklist |

## Recent Additions (not yet in plan files)

- **Card color picker** in user settings — 10 predefined colors from `CARD_COLORS` palette
- **Cards list page** (`/retros/[id]/cards`) — all cards grouped by category with author filter pills, profile pics, confirm/change/delete for anonymous cards with 5s undo
- **Admin card management** — delete anonymous cards, change author on any card (salay14@gmail.com only)
- **Show All Cards** button on completion page (Cards by Author section)
- **Mobile-first audit** — Pixel 9, iPhone 17 Pro/Pro Max viewport testing, overflow fixes, touch-action, tap-highlight, overscroll-behavior, icon-only buttons on mobile
- **AI Guess Authors** — admin recalculate button on /admin, uses confirmed assignments as training data
- **Legacy imports** — 25 retros (#2-#30) via SQL migrations with AI-guessed anonymous authors
