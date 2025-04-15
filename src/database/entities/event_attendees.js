import { pgTable, text, uuid, time, date, timestamp, real, uniqueIndex  } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { events } from "./events.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const eventAttendees = pgTable("event_attendees", {
    event_attendee_id: uuid().defaultRandom().primaryKey(),
    event: uuid().notNull().references(() => events.event_id, { onDelete: "cascade" }),
    firstname: text().notNull(),
    lastname: text().notNull(),
    email: text().notNull(),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date())
}
);