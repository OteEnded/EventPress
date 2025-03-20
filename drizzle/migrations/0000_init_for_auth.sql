CREATE TYPE "public"."choice_event_layers" AS ENUM('EVENT', 'BOOTH', 'ACTIVITY', 'ACTIVITY_SLOT');--> statement-breakpoint
CREATE TYPE "public"."choice_permission_types" AS ENUM('READ_HEADER', 'EDIT_HEADER', 'READ_RECURRIVE', 'EDIT_RECURRIVE', 'READ_STAFF', 'EDIT_STAFF');--> statement-breakpoint
CREATE TYPE "public"."choice_signin_methods" AS ENUM('CREDENTIALS', 'GOOGLE');--> statement-breakpoint
CREATE TABLE "request_logs" (
	"request_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rolling_order" integer,
	"request_from" varchar NOT NULL,
	"request_to" varchar NOT NULL,
	"request_protocol" varchar NOT NULL,
	"request_method" varchar NOT NULL,
	"request_header" jsonb NOT NULL,
	"request_body" jsonb NOT NULL,
	"cookies" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"password_hash" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"firstname" varchar NOT NULL,
	"lastname" varchar NOT NULL,
	"display_name" varchar,
	"contact_email" varchar,
	"age" integer,
	"phone_no" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_signin_methods" (
	"user_signin_method_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"method" "choice_signin_methods" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_email" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_identity_email_unique" UNIQUE("identity_email")
);
--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_signin_methods" ADD CONSTRAINT "user_signin_methods_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;