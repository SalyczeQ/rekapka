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

