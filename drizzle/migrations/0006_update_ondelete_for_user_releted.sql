ALTER TABLE "user_credentials" DROP CONSTRAINT "user_credentials_user_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_signin_methods" DROP CONSTRAINT "user_signin_methods_user_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_users_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_users_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_signin_methods" ADD CONSTRAINT "user_signin_methods_user_users_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;