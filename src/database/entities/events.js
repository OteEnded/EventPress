import { pgTable, varchar, uuid, timestamp, real  } from "drizzle-orm/pg-core";
import { organizers } from "./organizers.js";
// import { webPages } from "./web_pages.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const events = pgTable("events", {
    event_id: uuid().defaultRandom().primaryKey(),
    organizer: uuid().notNull().references(() => organizers.organizer_id, { onDelete: "cascade" }),
    
    name: varchar().notNull(),
    id_name: varchar(),
    description: varchar(),
    location: varchar(),
    start: timestamp(),
    end: timestamp(),
    capacity: varchar(),
    price: real().default(0.0),
    contact_info: varchar(),
    // web_page: uuid("web_page").references(() => webPages.web_page_id, { onDelete: "set null" }),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date())
});