ALTER TABLE "events" ALTER COLUMN "start" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "updated_at" DROP NOT NULL;