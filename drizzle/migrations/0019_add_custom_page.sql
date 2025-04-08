CREATE TYPE "public"."choice_widget_types" AS ENUM('GALLERY', 'INFORMATION', 'CHILDEN', 'TEXT');--> statement-breakpoint
CREATE TABLE "booth_page_widgets" (
	"booth" uuid NOT NULL,
	"widget_type" "choice_widget_types" NOT NULL,
	"option" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booth_pages" (
	"booth" uuid NOT NULL,
	"header" text DEFAULT 'ข้อมูลบูธ',
	"sub_header" text,
	"primary_color" text DEFAULT '#4A90E2',
	"accent_color" text DEFAULT '#50E3C2',
	"background_color" text DEFAULT '#F5F5F5',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_page_widgets" (
	"event" uuid NOT NULL,
	"widget_type" "choice_widget_types" NOT NULL,
	"option" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_pages" (
	"event" uuid NOT NULL,
	"header" text DEFAULT 'ข้อมูลอีเวนต์',
	"sub_header" text,
	"primary_color" text DEFAULT '#4A90E2',
	"accent_color" text DEFAULT '#50E3C2',
	"background_color" text DEFAULT '#F5F5F5',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booth_page_widgets" ADD CONSTRAINT "booth_page_widgets_booth_booths_booth_id_fk" FOREIGN KEY ("booth") REFERENCES "public"."booths"("booth_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booth_pages" ADD CONSTRAINT "booth_pages_booth_booths_booth_id_fk" FOREIGN KEY ("booth") REFERENCES "public"."booths"("booth_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_page_widgets" ADD CONSTRAINT "event_page_widgets_event_events_event_id_fk" FOREIGN KEY ("event") REFERENCES "public"."events"("event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_pages" ADD CONSTRAINT "event_pages_event_events_event_id_fk" FOREIGN KEY ("event") REFERENCES "public"."events"("event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."choice_event_layers";--> statement-breakpoint
DROP TYPE "public"."choice_permission_types";