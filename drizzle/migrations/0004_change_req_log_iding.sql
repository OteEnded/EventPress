ALTER TABLE "request_logs" RENAME COLUMN "request_id" TO "request_order";--> statement-breakpoint
ALTER TABLE "request_logs" DROP COLUMN "rolling_order";