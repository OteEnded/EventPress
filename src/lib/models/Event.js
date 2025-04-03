import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, organizers, events } from "@/database/schema";
import { eq } from "drizzle-orm";

async function getEventByEventId(eventId) {
    const dbConnection = getConnection();

    if (!eventId) {
        throw new Error("Event ID is required.");
    }
    if (!projectutility.isValidUUID(eventId)) {
        throw new Error("Invalid Event ID format.");
    }

    const eventQueryResult = await dbConnection.select().from(events).where(eq(events.event_id, eventId));
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

    const eventQueryResult = await dbConnection.select().from(events).where(eq(events.organizer, organizerId));
    if (eventQueryResult.length === 0) {
        return null;
    }
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

export default {
    getEventByEventId,
    getEventsByOrganizerId,
    getEventsByOrganizer,
};