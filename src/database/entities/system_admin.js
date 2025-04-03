import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

/*
{PK} [UUID] SystemAdminsID*^#
{FK: Users.UserID} User* (ex: u...001)
[String] Note
*/

export const userProfiles = pgTable("user_profiles", {
    system_admin_id: uuid("system_admin_id").primaryKey().references(() => users.user_id),
    user: uuid("user").references(() => users.user_id),
    note: varchar("note"),
    
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});
