ALTER TABLE "events" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_time" time;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_time" time;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "start";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "end";