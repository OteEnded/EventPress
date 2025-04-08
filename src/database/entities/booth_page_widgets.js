import { pgTable, uuid, timestamp, json } from "drizzle-orm/pg-core";
import { booths } from "./booths.js";
import { choiceWidgetTypes } from "../enums/choice_widget_types.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const boothPageWidgets = pgTable("booth_page_widgets", {
    booth_page_widget_id: uuid().defaultRandom().primaryKey(),
    booth: uuid().notNull().references(() => booths.booth_id, { onDelete: "cascade" }),
    widget_type: choiceWidgetTypes().notNull(),
    options: json(), // JSON object to store widget options
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});