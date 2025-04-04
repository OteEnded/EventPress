ALTER TABLE "organizers" RENAME COLUMN "phone" TO "phone_number";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "phone_no" TO "phone_number";--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "request_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "request_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "request_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "request_logs_request_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);