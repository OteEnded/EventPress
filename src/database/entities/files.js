import { pgTable, varchar, uuid, timestamp  } from "drizzle-orm/pg-core";
import { choiceFileTypes } from "../enums/choice_file_types";

export const files = pgTable("files", {
    file_id: uuid().defaultRandom().primaryKey(),
    name: varchar(),
    type: choiceFileTypes(),
    file_name_extension: varchar(),
    size: varchar(),
    description: varchar(),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});