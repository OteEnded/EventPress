import { pgTable, varchar, uuid, timestamp  } from "drizzle-orm/pg-core";
import { activities } from "./activities";
// import { webPages } from "./web_pages.js";

/*
{PK} [UUID] ActivitySlotID*^#
{FK: Activities.ActivityID} Activity*
[String] Description (ex: Morning session, Afternoon session)
[String] Location (ex: Computer Science Building Room 101)
[DateTime] Start* (ex: 2025-01-01 09:00, 2025-01-01 13:00)
[DateTime] End* (ex: 2025-01-01 12:00, 2025-01-01 16:00)
*/

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const activitySlots = pgTable("activity_slots", {
    activity_slot_id: uuid("activity_slot_id").defaultRandom().primaryKey(),
    activity: uuid("activity").notNull().references(() => activities.activity_id, { onDelete: "cascade" }),
    description: varchar("description"),
    location: varchar("location"),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),
    
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});