import { pgTable, text, uuid, timestamp, time, real, uniqueIndex  } from "drizzle-orm/pg-core";
import { staffTickets } from "./staff_tickets.js";
import { booths } from "./booths.js";
// import { webPages } from "./web_pages.js";

/*
{PK} [UUID] StaffPermissionID*^# (ex: sbp...001)
{FK: StaffTickets.StaffTicketsID} StaffTicket* (ex: s...001)
{FK: Booths.BoothID} Booth (ex: b...001)
// {FK: Users.UserID} modified_by* (ex: u...001)
*/

// 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export const staffPermissions = pgTable("staff_permissions", {
    
    staff_permission_id: uuid().defaultRandom().primaryKey(),
    staff_ticket: uuid().notNull().references(() => staffTickets.staff_tickets_id, { onDelete: "cascade" }),
    booth: uuid().notNull().references(() => booths.booth_id, { onDelete: "cascade" }),
    // modified_by: uuid().references(() => users.user_id, { onDelete: "set null" }),
    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
    
},
(table) => {
    return [
        // Composite unique index to ensure each staff_ticket can only be associated with a booth once
        uniqueIndex("unique_staff_ticket_booth").on(table.staff_ticket, table.booth),
    ];
});