import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, organizers, events } from "@/database/schema";
import { eq, or } from "drizzle-orm";
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
        .where(eq(events.organizer, organizerId));
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

export default {
    getEventByEventId,
    getEventsByOrganizerId,
    getEventsByOrganizer,
    getEventsOfUser,
};
