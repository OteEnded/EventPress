import { pgTable, varchar, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const userProfiles = pgTable("user_profiles", {
    user_id: uuid("user_id").primaryKey().references(() => users.user_id),
    firstname: varchar("firstname").notNull(),
    lastname: varchar("lastname").notNull(),
    display_name: varchar("display_name"),
    contact_email: varchar("contact_email"),
    age: integer("age"),
    phone_no: varchar("phone_no"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
});
