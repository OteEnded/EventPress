import { pgTable, text, uuid, timestamp, time, real, uniqueIndex  } from "drizzle-orm/pg-core";
import { events } from "./events.js";
import { users } from "./users.js";
import { sql } from "drizzle-orm";
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
    verification_email: text(),
    valid_until: timestamp(),
    note: text(),
    message: text(),
    connected_user: uuid().references(() => users.user_id, { onDelete: "cascade" }),
    // modified_by: uuid().references(() => users.user_id, { onDelete: "set null" }),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
    
},
(table) => {
    return [
        // Composite unique index that only applies when connected_user is not null
        // This ensures uniqueness of event and connected_user combination
        uniqueIndex("unique_staff_ticket_per_event_user").on(table.event, table.connected_user).where(sql`connected_user IS NOT NULL`),
    ];
});