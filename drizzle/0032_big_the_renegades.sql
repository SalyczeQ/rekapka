CREATE TABLE "card_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card_reactions" ADD CONSTRAINT "card_reactions_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_reactions" ADD CONSTRAINT "card_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "card_reactions_card_user_emoji_idx" ON "card_reactions" USING btree ("card_id","user_id","emoji");--> statement-breakpoint
CREATE INDEX "card_reactions_card_id_idx" ON "card_reactions" USING btree ("card_id");