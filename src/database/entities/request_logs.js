import { pgTable, uuid, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const requestLogs = pgTable("request_logs", {
    request_order: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
    request_from: text().notNull(),
    request_to: text().notNull(),
    request_protocol: text().notNull(),
    request_method: text().notNull(),
    request_header: jsonb().notNull(),
    request_body: jsonb().notNull(),
    cookies: jsonb().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
