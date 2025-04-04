import { pgTable, varchar, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const userProfiles = pgTable("user_profiles", {
    user: uuid().primaryKey().references(() => users.user_id, { onDelete: 'cascade' }),
    firstname: varchar().notNull(),
    lastname: varchar().notNull(),
    display_name: varchar(),
    contact_email: varchar(),
    age: integer(),
    phone_number: varchar(10),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
