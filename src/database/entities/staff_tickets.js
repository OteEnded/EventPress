import { pgTable, text, uuid, timestamp, time, real  } from "drizzle-orm/pg-core";
import { events } from "./events.js";
import { booths } from "./booths.js";
import { users } from "./users.js";
// import { webPages } from "./web_pages.js";

/*
{PK} [UUID] StaffTicketsID*^# (ex: si...001)
{FK: Events.EventID} Event* 
[String] Email
[DateTime] ValidUntil*
[String] Note
[String] Message
{FK: Users.UserID} ConnectedUser*
*/

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const staffTickets = pgTable("staff_tickets", {
    
    staff_tickets_id: uuid().defaultRandom().primaryKey(),
    event: uuid().notNull().references(() => events.event_id, { onDelete: "cascade" }),
    email: text(),
    valid_until: timestamp().notNull(),
    note: text(),
    message: text(),
    connected_user: uuid().references(() => users.user_id, { onDelete: "cascade" }),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
    
});