import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, organizers, events, booths } from "@/database/schema";
import { eq, or, asc, desc } from "drizzle-orm";
import Organizer from "./Organizer";

async function getEventByEventId(eventId) {
    const dbConnection = getConnection();

    if (!eventId) {
        throw new Error("Event ID is required.");
    }
    if (!projectutility.isValidUUID(eventId)) {
        throw new Error("Invalid Event ID format.");
    }

    const eventQueryResult = await dbConnection
        .select()
        .from(events)
        .where(eq(events.event_id, eventId));
    if (eventQueryResult.length === 0) {
        return null;
    }
    
    // select booths of the event
    const boothsQueryResult = await dbConnection
        .select()
        .from(booths)
        .where(eq(booths.event, eventId))
        .orderBy(desc(booths.created_at));
    eventQueryResult[0].Booths = boothsQueryResult;

    
    return eventQueryResult[0];
}

async function getEventsByOrganizerId(organizerId) {
    const dbConnection = getConnection();

    if (!organizerId) {
        throw new Error("Organizer ID is required.");
    }
    if (!projectutility.isValidUUID(organizerId)) {
        throw new Error("Invalid Organizer ID format.");
    }

    const eventQueryResult = await dbConnection
        .select()
        .from(events)
        .where(eq(events.organizer, organizerId))
        .orderBy(desc(events.created_at));
    // if (eventQueryResult.length === 0) {
    //     return null;
    // }
    return eventQueryResult;
}

async function getEventsByOrganizer(organizer) {
    if (!organizer) {
        throw new Error("Organizer is required.");
    }
    if (!organizer.organizer_id) {
        throw new Error("Organizer ID is required.");
    }
    return getEventsByOrganizerId(organizer.organizer_id);
}

async function getEventsOfUser(userId) {
    /*
    built template
    // event list grouped by organizer, organizers which of the user will be at the top followed by related events
    [
        {
            organizer: {
                organizer_id: "uuid",
                // other organizer fields
            },
            isOwner: true,
            events: [
                {
                    event_id: "uuid",
                    // other event fields
                },
                // more events
            ]
        }
    ]
    */

    const dbConnection = getConnection();

    const result = [];

    const organizersOfUser = await Organizer.getOrganizersByOwnerUserId(userId);
    
    if (organizersOfUser) {
        for (const organizer of organizersOfUser) {
            const events = await getEventsByOrganizerId(organizer.organizer_id);
            
            result.push({
                organizer: organizer,
                isOwner: true,
                events: events,
            });
            
        }
    }
    
    // get events of the user
    // get events which the user is not the owner but is a participant
    
    return result;
}

async function createEvent(req) {
    const dbConnection = getConnection();

    if (!req) {
        throw new Error("Event object is required.");
    }
    
    if (!req || typeof req !== "object") {
        throw new Error("Invalid event object format.");
    }
    
    // event_id: uuid().defaultRandom().primaryKey(),
    // organizer: uuid().notNull().references(() => organizers.organizer_id, { onDelete: "cascade" }),
    // name: varchar().notNull(),
    // id_name: varchar(),
    // description: varchar(),
    // location: varchar(),
    // start: timestamp(),
    // end: timestamp(),
    // capacity: varchar(),
    // price: real().default(0.0),
    // contact_info: varchar(),
    // // web_page: uuid("web_page").references(() => webPages.web_page_id, { onDelete: "set null" }),
    
    const requiredFields = [
        "organizer",
        "name",
        // "id_name",
        "description",
        // "location",
        // "start",
        // "end",
        // "capacity",
        // "price",
        // "contact_info",
        // // "web_page",
    ];
    
    for (const field of requiredFields) {
        if (!req[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    if (typeof req.organizer === "object") {
        if (!req.organizer.organizer_id) {
            throw new Error("Missing required field: organizer_id in organizer object");
        }
        req.organizer = req.organizer.organizer_id;
    }
    if (!projectutility.isValidUUID(req.organizer)) {
        throw new Error("Invalid Organizer ID format.");
    }
    if (typeof req.name !== "string") {
        throw new Error("Invalid name format.");
    }
    if (req.id_name && typeof req.id_name !== "string") {
        throw new Error("Invalid id_name format.");
    }
    if (req.start && !projectutility.isValidDate(req.start)) {
        throw new Error("Invalid start date format.");
    }
    if (req.end && !projectutility.isValidDate(req.end)) {
        throw new Error("Invalid end date format.");
    }
    if (req.capacity && typeof req.capacity !== "number") {
        throw new Error("Invalid capacity format.");
    }
    if (req.price && typeof req.price !== "number") {
        throw new Error("Invalid price format.");
    }
    if (req.contact_info && typeof req.contact_info !== "string") {
        throw new Error("Invalid contact_info format.");
    }
    
    const insertResult = await dbConnection
        .insert(events)
        .values({
            organizer: req.organizer,
            name: req.name,
            id_name: req.id_name,
            description: req.description,
            location: req.location,
            start: req.start,
            end: req.end,
            capacity: req.capacity,
            price: req.price,
            contact_info: req.contact_info,
        })
        .returning();
        
    if (insertResult.length === 0) {
        throw new Error("Failed to create event.");
    }
    return insertResult[0];
    
}

async function getEventByIdName(idName) {
    const dbConnection = getConnection();

    if (!idName) {
        throw new Error("ID Name is required.");
    }
    if (typeof idName !== "string") {
        throw new Error("Invalid ID Name format.");
    }
    
    try {
        const eventFromID = await getEventByEventId(idName);
        if (eventFromID) {
            return eventFromID;
        }
    } catch (error) {}

    const eventQueryResult = await dbConnection
        .select()
        .from(events)
        .where(eq(events.id_name, idName));
        
    if (eventQueryResult.length === 0) {
        return null;
    }
    
    const eventFromID = await getEventByEventId(eventQueryResult[0].event_id);
    if (eventFromID) {
        return eventFromID;
    }
    
    throw new Error("Event not found.");
    return null
}

export default {
    getEventByEventId,
    getEventsByOrganizerId,
    getEventsByOrganizer,
    getEventsOfUser,
    createEvent,
    getEventByIdName,
};
