import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    user_id: uuid("user_id").defaultRandom().primaryKey(),
    identity_email: varchar("identity_email").unique().notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
});
