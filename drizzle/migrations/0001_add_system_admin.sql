CREATE TABLE "files" (
	"file_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"type" "choice_file_types",
	"file_name_extension" varchar,
	"size" varchar,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "price" real DEFAULT 0;