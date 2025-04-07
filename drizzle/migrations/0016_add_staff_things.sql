CREATE TABLE "staff_permissions" (
	"staff_permission_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_ticket" uuid NOT NULL,
	"booth" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_tickets" (
	"staff_tickets_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event" uuid NOT NULL,
	"email" text,
	"valid_until" timestamp NOT NULL,
	"note" text,
	"message" text,
	"connected_user" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "staff_permissions" ADD CONSTRAINT "staff_permissions_staff_ticket_staff_tickets_staff_tickets_id_fk" FOREIGN KEY ("staff_ticket") REFERENCES "public"."staff_tickets"("staff_tickets_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_permissions" ADD CONSTRAINT "staff_permissions_booth_booths_booth_id_fk" FOREIGN KEY ("booth") REFERENCES "public"."booths"("booth_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_tickets" ADD CONSTRAINT "staff_tickets_event_events_event_id_fk" FOREIGN KEY ("event") REFERENCES "public"."events"("event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_tickets" ADD CONSTRAINT "staff_tickets_connected_user_users_user_id_fk" FOREIGN KEY ("connected_user") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;