import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

/*
{PK} [UUID] SystemAdminsID*^#
{FK: Users.UserID} User* (ex: u...001)
[String] Note
*/

export const userProfiles = pgTable("user_profiles", {
    system_admin_id: uuid().primaryKey().references(() => users.user_id),
    user: uuid().references(() => users.user_id),
    note: varchar(),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
