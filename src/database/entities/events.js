import { pgTable, text, uuid, time, date, timestamp, real, uniqueIndex, boolean  } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { organizers } from "./organizers.js";
import { files } from "./files.js";

// import { webPages } from "./web_pages.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const events = pgTable("events", {
    event_id: uuid().defaultRandom().primaryKey(),
    organizer: uuid().notNull().references(() => organizers.organizer_id, { onDelete: "cascade" }),
    
    name: text().notNull(),
    id_name: text(),
    description: text(),
    location: text(),
    start_date: date(),
    end_date: date(),
    start_time: time(),
    end_time: time(),
    capacity: text(),
    price: real().default(0.0),
    contact_info: text(),
    banner: uuid().references(() => files.file_id, { onDelete: "set null" }),
    published: boolean().default(false),
    // web_page: uuid("web_page").references(() => webPages.web_page_id, { onDelete: "set null" }),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date())
},

(table) => [
    // Define a partial unique index for id_name where id_name IS NOT NULL
    uniqueIndex("unique_id_name_not_null").on(table.id_name).where(sql`id_name IS NOT NULL`),
]

);