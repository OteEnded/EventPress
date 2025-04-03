import { pgTable, varchar, uuid, timestamp  } from "drizzle-orm/pg-core";
import { events } from "./events.js";
// import { webPages } from "./web_pages.js";

/*
{PK} [UUID] BoothID*^# (ex: b...001)
{FK: Events.EventID} Event* (ex: e...001)
[String] BoothName* (ex: Science Faculty)
[String] Description (ex: Science Faculty's booth)
[String] Location (ex: Faculty of Science)
[String] ContactInfo 
[String] BoothType (ex: Exhibition, Workshop)
{FK: WebPages.WebPageID} WebPage* (ex: p...002)
*/

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const booths = pgTable("booths", {
    booth_id: uuid("booth_id").defaultRandom().primaryKey(),
    event: uuid("event").notNull().references(() => events.event_id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    description: varchar("description"),
    location: varchar("location"),
    contact_info: varchar("contact_info"),
    booth_type: varchar("booth_type"),
    
    // web_page: uuid("web_page").references(() => webPages.web_page_id, { onDelete: "set null" }),
    
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});