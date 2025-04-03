import { pgTable, varchar, uuid, timestamp  } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { files } from "./files.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const organizers = pgTable("organizers", {
    organizer_id: uuid("organizer_id").defaultRandom().primaryKey(),
    owner: uuid("owner").notNull().references(() => users.user_id, { onDelete: "cascade" }),
    
    name: varchar("name").notNull(),
    business_name: varchar("business_name"),
    description: varchar("description"),
    logo: uuid("logo").references(() => files.file_id, { onDelete: "set null" }),
    website: varchar("website"),
    email: varchar("email"),
    phone: varchar("phone"),
    address: varchar("address"),
    
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});