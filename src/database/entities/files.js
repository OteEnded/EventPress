import { pgTable, varchar, uuid, timestamp  } from "drizzle-orm/pg-core";
import { choiceFileTypes } from "../enums/choice_file_types";

export const files = pgTable("files", {
    file_id: uuid("file_id").defaultRandom().primaryKey(),
    name: varchar("name"),
    type: choiceFileTypes("type"),
    file_name_extension: varchar("file_name_extension"),
    size: varchar("size"),
    description: varchar("description"),
    
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});