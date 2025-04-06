import { pgTable, text, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { events } from "./events.js";
import { files } from "./files.js";
import { sql } from "drizzle-orm";

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
    id_name: text(),
    name: text().notNull(),
    description: text(),
    location: text(),
    contact_info: text(),
    banner: uuid().references(() => files.file_id, { onDelete: "set null" }),
    
    // booth_type: text(),
    // web_page: uuid("web_page").references(() => webPages.web_page_id, { onDelete: "set null" }),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
},
(table) => {
    return [
        // Composite unique index that only applies when id_name is not null
        // This ensures uniqueness of id_name within the same event
        uniqueIndex("unique_booth_id_name_per_event").on(table.event, table.id_name).where(sql`id_name IS NOT NULL`),
    ];
});