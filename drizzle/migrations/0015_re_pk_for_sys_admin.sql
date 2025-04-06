ALTER TABLE "system_admins" ADD PRIMARY KEY ("user");--> statement-breakpoint
ALTER TABLE "system_admins" ALTER COLUMN "user" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "system_admins" DROP COLUMN "system_admin_id";