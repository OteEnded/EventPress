import { pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const userProfiles = pgTable("user_profiles", {
    user: uuid().primaryKey().references(() => users.user_id, { onDelete: 'cascade' }),
    firstname: text().notNull(),
    lastname: text().notNull(),
    display_name: text(),
    contact_email: text(),
    // age: integer(),
    phone_number: text(10),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
