import { pgTable, varchar, uuid, timestamp  } from "drizzle-orm/pg-core";
import { booths } from "./booths.js";
// import { webPages } from "./web_pages.js";

/*
{PK} [UUID] ActivityID*^#
{FK: Booths.BoothID} Booth*
[String] ActivityName* (ex: Computer Science Workshop)
[String] Description (ex: Workshop, Seminar)
[String] Location (ex: Computer Science Building)
{FK: WebPages.WebPageID} WebPage* (ex: p...002)
*/

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const activities = pgTable("activities", {
    activity_id: uuid("activity_id").defaultRandom().primaryKey(),
    
    booth: uuid("booth").notNull().references(() => booths.booth_id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    description: varchar("description"),
    location: varchar("location"),
    
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});