import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { choiceSigninMethods } from "../enums/choice_signin_methods.js"; // Import ENUM

export const userSigninMethods = pgTable("user_signin_methods", {
    user_signin_method_id: uuid("user_signin_method_id").defaultRandom().primaryKey(),
    user: uuid("user").references(() => users.user_id),
    method: choiceSigninMethods("method").notNull(), // Use ENUM
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
});