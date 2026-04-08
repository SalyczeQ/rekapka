CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "action_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"retro_id" uuid NOT NULL,
	"card_id" uuid,
	"text" text NOT NULL,
	"assignee_id" uuid,
	"due_date" date,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ics_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"group_name" text DEFAULT 'Rekapka' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "app_settings_ics_token_unique" UNIQUE("ics_token")
);
--> statement-breakpoint
CREATE TABLE "card_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"retro_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"text" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"group_label" text,
	"is_discussed" boolean DEFAULT false NOT NULL,
	"is_skipped" boolean DEFAULT false NOT NULL,
	"discussion_notes" text,
	"discussion_started_at" timestamp with time zone,
	"discussion_ended_at" timestamp with time zone,
	"discussion_duration_sec" integer,
	"carried_from_retro_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"retro_id" uuid NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"color" text
);
--> statement-breakpoint
CREATE TABLE "invite_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"expires_at" timestamp with time zone,
	"is_reusable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invite_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "retros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'writing' NOT NULL,
	"location" text,
	"photo_url" text,
	"date" date DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"stats_cache" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"total_duration_sec" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"email_verified" timestamp with time zone,
	"image" text,
	"color" text DEFAULT '#3B82F6' NOT NULL,
	"locale" text DEFAULT 'cs' NOT NULL,
	"ui_theme" text DEFAULT 'default' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_retro_id_retros_id_fk" FOREIGN KEY ("retro_id") REFERENCES "public"."retros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_tags" ADD CONSTRAINT "card_tags_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_tags" ADD CONSTRAINT "card_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_retro_id_retros_id_fk" FOREIGN KEY ("retro_id") REFERENCES "public"."retros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_carried_from_retro_id_retros_id_fk" FOREIGN KEY ("carried_from_retro_id") REFERENCES "public"."retros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_retro_id_retros_id_fk" FOREIGN KEY ("retro_id") REFERENCES "public"."retros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retros" ADD CONSTRAINT "retros_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_items_retro_id_idx" ON "action_items" USING btree ("retro_id");--> statement-breakpoint
CREATE INDEX "action_items_assignee_id_idx" ON "action_items" USING btree ("assignee_id");--> statement-breakpoint
CREATE INDEX "action_items_status_idx" ON "action_items" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "card_tags_card_tag_idx" ON "card_tags" USING btree ("card_id","tag_id");--> statement-breakpoint
CREATE INDEX "cards_retro_id_idx" ON "cards" USING btree ("retro_id");--> statement-breakpoint
CREATE INDEX "cards_category_id_idx" ON "cards" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "cards_author_id_idx" ON "cards" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "categories_retro_id_idx" ON "categories" USING btree ("retro_id");--> statement-breakpoint
CREATE INDEX "invite_tokens_token_idx" ON "invite_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "retros_status_idx" ON "retros" USING btree ("status");--> statement-breakpoint
CREATE INDEX "retros_date_idx" ON "retros" USING btree ("date");--> statement-breakpoint
CREATE INDEX "retros_created_by_idx" ON "retros" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");