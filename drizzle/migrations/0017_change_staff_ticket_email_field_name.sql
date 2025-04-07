ALTER TABLE "staff_tickets" RENAME COLUMN "email" TO "verification_email";--> statement-breakpoint
ALTER TABLE "staff_tickets" ALTER COLUMN "valid_until" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_staff_ticket_booth" ON "staff_permissions" USING btree ("staff_ticket","booth");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_staff_ticket_per_event_user" ON "staff_tickets" USING btree ("event","connected_user") WHERE connected_user IS NOT NULL;