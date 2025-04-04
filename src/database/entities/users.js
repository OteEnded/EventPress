import { pgTable, text, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { lower } from "@/database/functions.js";

export const users = pgTable("users", {
    user_id: uuid().defaultRandom().primaryKey(),
    identity_email: text().unique().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
    },

    (table) => [
        uniqueIndex("identity_email_unique_index").on(lower(table.identity_email)),
    ]
);

