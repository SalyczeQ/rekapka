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
