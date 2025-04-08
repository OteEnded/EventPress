import { pgTable, uuid, timestamp, json } from "drizzle-orm/pg-core";
import { events } from "./events.js";
import { choiceWidgetTypes } from "../enums/choice_widget_types.js";

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const eventPageWidgets = pgTable("event_page_widgets", {
    
    event_page_widget_id: uuid().defaultRandom().primaryKey(),
    event: uuid().notNull().references(() => events.event_id, { onDelete: "cascade" }),
    widget_type: choiceWidgetTypes().notNull(),
    options: json(), // JSON object to store widget options
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});