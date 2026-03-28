import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  date,
  unique,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

// --- Enums as string unions (matching current CHECK constraints) ---

export const retroStatuses = [
  'draft',
  'writing',
  'grouping',
  'voting',
  'discussing',
  'actions',
  'completed',
] as const
export type RetroStatus = (typeof retroStatuses)[number]

export const retroTemplates = [
  'went_well_improve',
  'mad_sad_glad',
  'start_stop_continue',
  'four_ls',
  'custom',
] as const
export type RetroTemplate = (typeof retroTemplates)[number]

export const teamRoles = ['owner', 'facilitator', 'member'] as const
export type TeamRole = (typeof teamRoles)[number]

export const actionStatuses = ['open', 'in_progress', 'done'] as const
export type ActionStatus = (typeof actionStatuses)[number]

export const uiThemes = ['default', 'cli', 'msdos', 'material3', 'windows'] as const
export type UiTheme = (typeof uiThemes)[number]

// --- Tables ---

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    emailVerified: timestamp('email_verified', { withTimezone: true }),
    image: text('image'), // Auth.js adapter column; also serves as avatar URL
    passwordHash: text('password_hash'),
    color: text('color').notNull().default('#3B82F6'),
    uiTheme: text('ui_theme').notNull().default('default'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_users_email').on(t.email)]
)

// --- Auth.js adapter tables ---

export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index('idx_accounts_user_id').on(t.userId),
  ]
)

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
)

export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    icsToken: uuid('ics_token').notNull().unique().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_teams_slug').on(t.slug),
    index('idx_teams_created_by').on(t.createdBy),
  ]
)

export const teamMembers = pgTable(
  'team_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('member'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.teamId, t.userId),
    index('idx_team_members_team_id').on(t.teamId),
    index('idx_team_members_user_id').on(t.userId),
  ]
)

export const retros = pgTable(
  'retros',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    status: text('status').notNull().default('draft'),
    template: text('template').notNull().default('went_well_improve'),
    location: text('location'),
    photoUrl: text('photo_url'),
    date: date('date').notNull().defaultNow(),
    phaseTimerSeconds: integer('phase_timer_seconds'),
    maxVotes: integer('max_votes').notNull().default(5),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_retros_team_id').on(t.teamId),
    index('idx_retros_created_by').on(t.createdBy),
    index('idx_retros_status').on(t.status),
    index('idx_retros_date').on(t.date),
  ]
)

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    retroId: uuid('retro_id')
      .notNull()
      .references(() => retros.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    icon: text('icon'),
    sortOrder: integer('sort_order').notNull().default(0),
    color: text('color'),
  },
  (t) => [index('idx_categories_retro_id').on(t.retroId)]
)

export const cards = pgTable(
  'cards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    retroId: uuid('retro_id')
      .notNull()
      .references(() => retros.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    text: text('text').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    groupLabel: text('group_label'),
    isDiscussed: boolean('is_discussed').notNull().default(false),
    carriedFromRetroId: uuid('carried_from_retro_id').references(() => retros.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_cards_retro_id').on(t.retroId),
    index('idx_cards_category_id').on(t.categoryId),
    index('idx_cards_author_id').on(t.authorId),
  ]
)

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    usageCount: integer('usage_count').notNull().default(0),
  },
  (t) => [index('idx_tags_team_id').on(t.teamId)]
)

export const cardTags = pgTable(
  'card_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [
    unique().on(t.cardId, t.tagId),
    index('idx_card_tags_card_id').on(t.cardId),
    index('idx_card_tags_tag_id').on(t.tagId),
  ]
)

export const votes = pgTable(
  'votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.cardId, t.userId),
    index('idx_votes_card_id').on(t.cardId),
    index('idx_votes_user_id').on(t.userId),
  ]
)

export const actionItems = pgTable(
  'action_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    retroId: uuid('retro_id')
      .notNull()
      .references(() => retros.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    assigneeId: uuid('assignee_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    dueDate: date('due_date'),
    status: text('status').notNull().default('open'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_action_items_retro_id').on(t.retroId),
    index('idx_action_items_assignee_id').on(t.assigneeId),
    index('idx_action_items_status').on(t.status),
  ]
)
