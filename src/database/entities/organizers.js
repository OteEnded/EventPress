import { pgTable, text, uuid, timestamp  } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { files } from "./files.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const organizers = pgTable("organizers", {
    organizer_id: uuid().defaultRandom().primaryKey(),
    owner: uuid().notNull().references(() => users.user_id, { onDelete: "cascade" }),
    
    name: text().notNull(),
    // business_name: text(),
    description: text(),
    logo: uuid().references(() => files.file_id, { onDelete: "set null" }),
    website: text(),
    email: text(),
    phone_number: text(),
    address: text(),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});