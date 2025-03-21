import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const userCredentials = pgTable("user_credentials", {
    user_id: uuid("user_id").primaryKey().references(() => users.user_id),
    password_hash: varchar("password_hash").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});
