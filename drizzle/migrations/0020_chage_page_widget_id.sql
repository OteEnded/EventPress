ALTER TABLE "booth_page_widgets" RENAME COLUMN "option" TO "options";--> statement-breakpoint
ALTER TABLE "event_page_widgets" RENAME COLUMN "option" TO "options";--> statement-breakpoint
ALTER TABLE "booth_pages" ADD PRIMARY KEY ("booth");--> statement-breakpoint
ALTER TABLE "event_pages" ADD PRIMARY KEY ("event");--> statement-breakpoint
ALTER TABLE "booth_page_widgets" ADD COLUMN "booth_page_widget_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "event_page_widgets" ADD COLUMN "event_page_widget_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;