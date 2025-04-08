CREATE TABLE "event_attendees" (
	"event_attendee_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event" uuid NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_events_event_id_fk" FOREIGN KEY ("event") REFERENCES "public"."events"("event_id") ON DELETE cascade ON UPDATE no action;