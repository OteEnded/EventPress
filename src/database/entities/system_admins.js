import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

/*
{PK} [UUID] SystemAdminsID*^#
{FK: Users.UserID} User* (ex: u...001)
[String] Note
*/

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const systemAdmins = pgTable("system_admins", {

    user: uuid().primaryKey().references(() => users.user_id, { onDelete: 'cascade' }),
    note: text(),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
