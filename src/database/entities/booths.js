import { pgTable, text, uuid, timestamp  } from "drizzle-orm/pg-core";
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
    booth_id: uuid().defaultRandom().primaryKey(),
    event: uuid().notNull().references(() => events.event_id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text(),
    location: text(),
    contact_info: text(),
    booth_type: text(),
    
    // web_page: uuid("web_page").references(() => webPages.web_page_id, { onDelete: "set null" }),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});