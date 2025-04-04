import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { choiceSigninMethods } from "../enums/choice_signin_methods.js"; // Import ENUM

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const userSigninMethods = pgTable("user_signin_methods", {
    user_signin_method_id: uuid().defaultRandom().primaryKey(),
    user: uuid().references(() => users.user_id, { onDelete: 'cascade' }),
    method: choiceSigninMethods().notNull(), // Use ENUM
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});