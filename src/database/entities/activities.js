import { pgTable, text, uuid, timestamp, time, real  } from "drizzle-orm/pg-core";
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
    activity_id: uuid().defaultRandom().primaryKey(),
    
    booth: uuid().notNull().references(() => booths.booth_id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text(),
    location: text(),
    start_time: time(),
    end_time: time(),
    price: real().default(0.0),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});