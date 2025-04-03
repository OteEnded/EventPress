import { pgTable, varchar, uuid, timestamp, real  } from "drizzle-orm/pg-core";
import { organizers } from "./organizers.js";
// import { webPages } from "./web_pages.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const events = pgTable("events", {
    event_id: uuid("event_id").defaultRandom().primaryKey(),
    organizer: uuid("organizer").notNull().references(() => organizers.organizer_id, { onDelete: "cascade" }),
    
    name: varchar("name").notNull(),
    id_name: varchar("id_name"),
    description: varchar("description"),
    location: varchar("location"),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),
    capacity: varchar("capacity"),
    price: real("price").default(0.0),
    contact_info: varchar("contact_info"),
    // web_page: uuid("web_page").references(() => webPages.web_page_id, { onDelete: "set null" }),
    
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});