import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const userCredentials = pgTable("user_credentials", {
    user: uuid().primaryKey().references(() => users.user_id),
    password_hash: varchar().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
