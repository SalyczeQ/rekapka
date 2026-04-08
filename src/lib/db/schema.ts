import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ─── Auth.js adapter tables ───────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date", withTimezone: true }),
    image: text("image"),
    color: text("color").notNull().default("#3B82F6"),
    locale: text("locale").notNull().default("cs"),
    uiTheme: text("ui_theme").notNull().default("default"),
    dictationEnabled: boolean("dictation_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    {
      pk: { columns: [table.provider, table.providerAccountId] },
    },
  ]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (table) => [
    {
      pk: { columns: [table.identifier, table.token] },
    },
  ]
);

// ─── App settings (singleton) ─────────────────────────────────────────────────

export const appSettings = pgTable("app_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  icsToken: uuid("ics_token").defaultRandom().notNull().unique(),
  groupName: text("group_name").notNull().default("Rekapka"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

// ─── Invite tokens ────────────────────────────────────────────────────────────

export const inviteTokens = pgTable(
  "invite_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    token: uuid("token").defaultRandom().notNull().unique(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }),
    isReusable: boolean("is_reusable").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("invite_tokens_token_idx").on(table.token),
  ]
);

// ─── Retros ───────────────────────────────────────────────────────────────────

export const retros = pgTable(
  "retros",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    status: text("status").notNull().default("writing"),
    location: text("location"),
    photoUrl: text("photo_url"),
    date: date("date", { mode: "date" }).notNull().defaultNow(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    statsCache: text("stats_cache"),
    startedAt: timestamp("started_at", { mode: "date", withTimezone: true }),
    completedAt: timestamp("completed_at", { mode: "date", withTimezone: true }),
    totalDurationSec: integer("total_duration_sec"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("retros_status_idx").on(table.status),
    index("retros_date_idx").on(table.date),
    index("retros_created_by_idx").on(table.createdBy),
  ]
);

// ─── Categories (always 3 per retro: Mad, Sad, Glad) ─────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    retroId: uuid("retro_id")
      .notNull()
      .references(() => retros.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    icon: text("icon"),
    sortOrder: integer("sort_order").notNull().default(0),
    color: text("color"),
  },
  (table) => [
    index("categories_retro_id_idx").on(table.retroId),
  ]
);

// ─── Cards ────────────────────────────────────────────────────────────────────

export const cards = pgTable(
  "cards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    retroId: uuid("retro_id")
      .notNull()
      .references(() => retros.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    text: text("text").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    groupLabel: text("group_label"),
    isDiscussed: boolean("is_discussed").notNull().default(false),
    isSkipped: boolean("is_skipped").notNull().default(false),
    discussionNotes: text("discussion_notes"),
    discussionStartedAt: timestamp("discussion_started_at", { mode: "date", withTimezone: true }),
    discussionEndedAt: timestamp("discussion_ended_at", { mode: "date", withTimezone: true }),
    discussionDurationSec: integer("discussion_duration_sec"),
    carriedFromRetroId: uuid("carried_from_retro_id").references(() => retros.id, {
      onDelete: "set null",
    }),
    guessedAuthor: text("guessed_author"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("cards_retro_id_idx").on(table.retroId),
    index("cards_category_id_idx").on(table.categoryId),
    index("cards_author_id_idx").on(table.authorId),
  ]
);

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    usageCount: integer("usage_count").notNull().default(0),
  },
  (table) => [
    index("tags_name_idx").on(table.name),
  ]
);

export const cardTags = pgTable(
  "card_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("card_tags_card_tag_idx").on(table.cardId, table.tagId),
  ]
);

// ─── Action Items ─────────────────────────────────────────────────────────────

export const actionItems = pgTable(
  "action_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    retroId: uuid("retro_id")
      .notNull()
      .references(() => retros.id, { onDelete: "cascade" }),
    cardId: uuid("card_id").references(() => cards.id, { onDelete: "set null" }),
    text: text("text").notNull(),
    assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
    dueDate: date("due_date", { mode: "date" }),
    status: text("status").notNull().default("open"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("action_items_retro_id_idx").on(table.retroId),
    index("action_items_assignee_id_idx").on(table.assigneeId),
    index("action_items_status_idx").on(table.status),
  ]
);
