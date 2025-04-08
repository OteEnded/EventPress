import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { booths } from "./booths.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const boothPages = pgTable("booth_pages", {
    booth: uuid().primaryKey().notNull().references(() => booths.booth_id, { onDelete: "cascade" }),
    header: text().default("ข้อมูลบูธ"),
    sub_header: text(),
    primary_color: text().default("#4A90E2"), // Light blue
    accent_color: text().default("#50E3C2"), // Mint green
    background_color: text().default("#F5F5F5"), // Light gray
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});