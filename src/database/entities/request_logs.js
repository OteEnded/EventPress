import { pgTable, uuid, integer, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const requestLogs = pgTable("request_logs", {
    request_id: uuid("request_id").defaultRandom().primaryKey(),
    rolling_order: integer("rolling_order"),
    request_from: varchar("request_from").notNull(),
    request_to: varchar("request_to").notNull(),
    request_protocol: varchar("request_protocol").notNull(),
    request_method: varchar("request_method").notNull(),
    request_header: jsonb("request_header").notNull(),
    request_body: jsonb("request_body").notNull(),
    cookies: jsonb("cookies").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});
