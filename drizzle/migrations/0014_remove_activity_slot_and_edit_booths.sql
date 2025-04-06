CREATE TABLE "system_admins" (
	"system_admin_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" uuid,
	"note" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_slots" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "activity_slots" CASCADE;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "start_time" time;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "end_time" time;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "price" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "booths" ADD COLUMN "id_name" text;--> statement-breakpoint
ALTER TABLE "booths" ADD COLUMN "banner" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "banner" uuid;--> statement-breakpoint
ALTER TABLE "system_admins" ADD CONSTRAINT "system_admins_user_users_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booths" ADD CONSTRAINT "booths_banner_files_file_id_fk" FOREIGN KEY ("banner") REFERENCES "public"."files"("file_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_banner_files_file_id_fk" FOREIGN KEY ("banner") REFERENCES "public"."files"("file_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_booth_id_name_per_event" ON "booths" USING btree ("event","id_name") WHERE id_name IS NOT NULL;--> statement-breakpoint
ALTER TABLE "booths" DROP COLUMN "booth_type";