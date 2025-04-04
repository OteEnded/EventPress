import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const userCredentials = pgTable("user_credentials", {
    user: uuid().primaryKey().references(() => users.user_id, { onDelete: 'cascade' }),
    password_hash: varchar().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
