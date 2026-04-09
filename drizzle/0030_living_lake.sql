CREATE TABLE "predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"retro_id" uuid NOT NULL,
	"resolved_in_retro_id" uuid,
	"author_id" uuid NOT NULL,
	"text" text NOT NULL,
	"stake" text,
	"challenged_user_id" uuid,
	"status" text DEFAULT 'open' NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_retro_id_retros_id_fk" FOREIGN KEY ("retro_id") REFERENCES "public"."retros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_resolved_in_retro_id_retros_id_fk" FOREIGN KEY ("resolved_in_retro_id") REFERENCES "public"."retros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_challenged_user_id_users_id_fk" FOREIGN KEY ("challenged_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "predictions_retro_id_idx" ON "predictions" USING btree ("retro_id");--> statement-breakpoint
CREATE INDEX "predictions_author_id_idx" ON "predictions" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "predictions_status_idx" ON "predictions" USING btree ("status");