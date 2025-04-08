ALTER TABLE "public"."booth_page_widgets" ALTER COLUMN "widget_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."event_page_widgets" ALTER COLUMN "widget_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."choice_widget_types";--> statement-breakpoint
CREATE TYPE "public"."choice_widget_types" AS ENUM('GALLERY', 'INFORMATION', 'CHILRDEN', 'TEXT');--> statement-breakpoint
ALTER TABLE "public"."booth_page_widgets" ALTER COLUMN "widget_type" SET DATA TYPE "public"."choice_widget_types" USING "widget_type"::"public"."choice_widget_types";--> statement-breakpoint
ALTER TABLE "public"."event_page_widgets" ALTER COLUMN "widget_type" SET DATA TYPE "public"."choice_widget_types" USING "widget_type"::"public"."choice_widget_types";