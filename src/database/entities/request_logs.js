import { pgTable, uuid, integer, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const requestLogs = pgTable("request_logs", {
    request_order: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
    request_from: varchar().notNull(),
    request_to: varchar().notNull(),
    request_protocol: varchar().notNull(),
    request_method: varchar().notNull(),
    request_header: jsonb().notNull(),
    request_body: jsonb().notNull(),
    cookies: jsonb().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
