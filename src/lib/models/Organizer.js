import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, userProfiles, organizers } from "@/database/schema";
import { eq, asc, desc } from "drizzle-orm";
import Event from "@/lib/models/Event";

async function getOrganizerByOrganizerId(organizerId) {
    const dbConnection = getConnection();
    
    if (!organizerId) {
        throw new Error("Organizer ID is required.");
    }
    if (!projectutility.isValidUUID(organizerId)) {
        throw new Error("Invalid Organizer ID format.");
    }

    const organizerQueryResult = await dbConnection.select().from(organizers).where(eq(organizers.organizer_id, organizerId));
    if (organizerQueryResult.length === 0) {
        return null;
    }
    
    const organizer = {
        ...organizerQueryResult[0],
        expand: async function() {
            return await expandOrganizer(this.organizer_id);
        }
    }
    
    return organizer;
}

async function expandOrganizer(organizer) {
    if (!organizer) {
        return null;
    }
    
    // check if organizer is object or string
    if (typeof organizer === "string") {
        // check if organizer is valid uuid
        if (!projectutility.isValidUUID(organizer)) {
            return null;
        }
        return expandOrganizer({organizer_id: organizer});
    }
    else if (typeof organizer !== "object") {
        return null;
    }
    
    if (!organizer.organizer_id) {
        throw new Error("Organizer ID is required. Didn't find organizer_id in the organizer object.");
    }
    
    if (!projectutility.isValidUUID(organizer.organizer_id)) {
        throw new Error(`Invalid Organizer ID format. Found ${organizer.organizer_id} as organizer_id in the organizer object.`);
    }
    
    return {
        ...(await getOrganizerByOrganizerId(organizer.organizer_id)),
        Events: (await Event.getEventsByOrganizerId(organizer.organizer_id)) || [],
    };
}

async function getOrganizersByOwner(owner) {
    if (!owner) {
        throw new Error("Owner is required.");
    }
    if (!owner.user_id) {
        throw new Error("Owner user ID is required.");
    }
    return getOrganizersByOwnerUserId(owner.user_id);
}

async function getOrganizersByOwnerUserId(ownerUserId) {
    const dbConnection = getConnection();
    
    const userQueryResult = await dbConnection.select().from(users).where(eq(users.user_id, ownerUserId));
    if (userQueryResult.length === 0) {
        throw new Error("User not found.");
    }
    
    const organizerQueryResult = await dbConnection.select({organizer_id: organizers.organizer_id}).from(organizers).where(eq(organizers.owner, ownerUserId));
    if (organizerQueryResult.length === 0) {
        return null;
    }
    
    const results = [];
    for (const organizer of organizerQueryResult) {
        results.push(await getOrganizerByOrganizerId(organizer.organizer_id));
    }
    
    return results;
}

async function approveOrganizer(organizerId, approverUserId) {
    try {
        
        const dbConnection = getConnection();
        
        // First check if organizer exists
        const existingOrganizer = await getOrganizerByOrganizerId(organizerId);
        if (!existingOrganizer) {
            throw new Error("Organizer not found");
        }

        if (!existingOrganizer) {
            throw new Error("Organizer not found");
        }

        // Update organizer with approver
        const updatedOrganizer = await dbConnection.update(organizers).set({
            approver: approverUserId,
        }).where(eq(organizers.organizer_id, organizerId)).returning();
        
        return updatedOrganizer;
        
    } catch (error) {
        console.error("Error approving organizer:", error);
        return null;
    }
}

export default {
    getOrganizerByOrganizerId,
    getOrganizersByOwner,
    getOrganizersByOwnerUserId,
    approveOrganizer,
};