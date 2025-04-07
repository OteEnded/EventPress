import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, staffTickets, staffPermissions, events, booths } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";

async function getStaffOfUser(userId) {
    const dbConnection = getConnection();
    
    if (!userId) {
        throw new Error("User ID is required.");
    }
    
    if (!projectutility.isValidUUID(userId)) {
        // console.error("Invalid User ID format.", userId);
        throw new Error(`Invalid User ID format. Found ${userId} as user_id.`);
    }
    
    // check if user exists
    const userQueryResult = await dbConnection.select().from(users).where(eq(users.user_id, userId));
    if (userQueryResult.length === 0) {
        throw new Error(`User not found. Found ${userId} as user_id.`);
    }
    
    // get staff of user
    const staffQueryResult = await dbConnection.select().from(staffTickets).where(eq(staffTickets.connected_user, userId));
    
    return staffQueryResult;
   
}

async function getStaffOfEvent(eventId) {
    const dbConnection = getConnection();
    
    if (!eventId) {
        throw new Error("Event ID is required.");
    }
    
    if (!projectutility.isValidUUID(eventId)) {
        throw new Error(`Invalid Event ID format. Found ${eventId} as event_id.`);
    }
    
    // check if event exists
    const eventQueryResult = await dbConnection.select().from(events).where(eq(events.event_id, eventId));
    if (eventQueryResult.length === 0) {
        throw new Error(`Event not found. Found ${eventId} as event_id.`);
    }
    
    // get staff of event
    const staffQueryResult = await dbConnection.select().from(staffTickets).where(eq(staffTickets.event, eventId));
    
    const result = [];
    for (const staffTicket of staffQueryResult) {
        const permissions = await dbConnection.select().from(staffPermissions).where(eq(staffPermissions.staff_ticket, staffTicket.staff_tickets_id));
        
        const boothIds = permissions.map(permission => permission.booth);
        const resolvedBooths = [];
        for (const boothId of boothIds) {
            const booth = await dbConnection.select().from(booths).where(eq(booths.booth_id, boothId));
            if (booth.length > 0) {
                resolvedBooths.push(booth[0]);
            }
        }
        
        const resolvedConnectedUser = await User.getUserByUserId(staffTicket.connected_user);
        
        result.push({
            ...staffTicket,
            connected_user: resolvedConnectedUser,
            Booths: resolvedBooths,
        });
    }
    
    return result;
}

async function grantStaffPermission(staffTicketId, boothId) {
    const dbConnection = getConnection();
    
    if (!staffTicketId) {
        throw new Error("Staff Ticket ID is required.");
    }
    
    if (!boothId) {
        throw new Error("Booth ID is required.");
    }
    
    if (!projectutility.isValidUUID(staffTicketId)) {
        throw new Error(`Invalid Staff Ticket ID format. Found ${staffTicketId} as staff_ticket_id.`);
    }
    
    if (!projectutility.isValidUUID(boothId)) {
        throw new Error(`Invalid Booth ID format. Found ${boothId} as booth_id.`);
    }
    
    // check if staff ticket exists
    const staffQueryResult = await dbConnection.select().from(staffTickets).where(eq(staffTickets.staff_tickets_id, staffTicketId));
    if (staffQueryResult.length === 0) {
        throw new Error(`Staff Ticket not found. Found ${staffTicketId} as staff_ticket_id.`);
    }
    
    // check if booth exists
    const boothQueryResult = await dbConnection.select().from(booths).where(eq(booths.booth_id, boothId));
    if (boothQueryResult.length === 0) {
        throw new Error(`Booth not found. Found ${boothId} as booth_id.`);
    }
    
    // check if permission already exists
    const permissionQueryResult = await dbConnection.select().from(staffPermissions).where(
        and(
            eq(staffPermissions.staff_ticket, staffTicketId),
            eq(staffPermissions.booth, boothId)
        )
    );
    if (permissionQueryResult.length > 0) {
        console.error("Permission already exists:", permissionQueryResult);
        return permissionQueryResult[0];
    }
    
    // grant permission
    const permission = {
        staff_ticket: staffTicketId,
        booth: boothId
    };
    
    const result =  await dbConnection.insert(staffPermissions).values(permission).returning();
    
    console.log("Permission granted:", result);
    return result[0];

}

async function revokeStaffPermission(staffTicketId, boothId) {
    const dbConnection = getConnection();
    
    if (!staffTicketId) {
        throw new Error("Staff Ticket ID is required.");
    }
    
    if (!boothId) {
        throw new Error("Booth ID is required.");
    }
    
    if (!projectutility.isValidUUID(staffTicketId)) {
        throw new Error(`Invalid Staff Ticket ID format. Found ${staffTicketId} as staff_ticket_id.`);
    }
    
    if (!projectutility.isValidUUID(boothId)) {
        throw new Error(`Invalid Booth ID format. Found ${boothId} as booth_id.`);
    }
    
    // check if permission exists
    const permissionQueryResult = await dbConnection.select().from(staffPermissions).where(
        and(
            eq(staffPermissions.staff_ticket, staffTicketId),
            eq(staffPermissions.booth, boothId)
        )
    );
    
    if (permissionQueryResult.length === 0) {
        console.error("Permission not found:", permissionQueryResult);
        return null;
    }
    
    // revoke permission
    const result = await dbConnection.delete(staffPermissions).where(
        and(
            eq(staffPermissions.staff_ticket, staffTicketId),
            eq(staffPermissions.booth, boothId)
        )
    ).returning();
    
    console.log("Permission revoked:", result);
    return result[0];
}

async function createStaff(reqBody){
    
    // varify if req
    if (!reqBody) {
        throw new Error("Request is required.");
    }
    if (typeof reqBody !== "object") {
        throw new Error("Request must be an object.");
    }
    
    // check if required fields are present
    const requiredFields = [
        "event"
        // "verification_email",
        // "valid_until",
        // "note",
        // "message",
        // "connected_user",
        // "Booths"
    ];
    for (const field of requiredFields) {
        if (!reqBody[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    const dbConnection = getConnection();
    
    // check if event exists
    if (!projectutility.isValidUUID(reqBody.event)) {
        throw new Error(`Invalid Event ID format. Found ${reqBody.event} as event_id.`);
    }
    const eventExists = await Event.getEventByEventId(reqBody.event);
    if (!eventExists) {
        throw new Error(`Event not found. Found ${reqBody.event} as event_id.`);
    }
    
    // Handle either Booths or booths property from request
    const boothsArray = reqBody.Booths || reqBody.booths || [];
    
    // check if booths exist
    if (boothsArray.length > 0) {
        if (!Array.isArray(boothsArray)) {
            throw new Error("Booths must be an array.");
        }
        for (const booth of boothsArray) {
            if (!projectutility.isValidUUID(booth)) {
                throw new Error(`Invalid Booth ID format. Found ${booth} as booth_id.`);
            }
            const boothExists = await dbConnection.select().from(booths).where(eq(booths.booth_id, booth));
            if (boothExists.length === 0) {
                throw new Error(`Booth not found. Found ${booth} as booth_id.`);
            }
        }
    }
    
    // check if connected user exists
    if (reqBody.connected_user) {
        if (!projectutility.isValidUUID(reqBody.connected_user)) {
            throw new Error(`Invalid User ID format. Found ${reqBody.connected_user} as user_id.`);
        }
        const userExists = await dbConnection.select().from(users).where(eq(users.user_id, reqBody.connected_user));
        if (userExists.length === 0) {
            throw new Error(`User not found. Found ${reqBody.connected_user} as user_id.`);
        }
    }
    
    // check if verification email is valid
    if (reqBody.verification_email) {
        if (typeof reqBody.verification_email !== "string") {
            throw new Error("Verification email must be a string.");
        }
        if (!projectutility.isValidEmail(reqBody.verification_email)) {
            throw new Error(`Invalid email format. Found ${reqBody.verification_email} as verification_email.`);
        }
    }    
    
    // convert valid_until to date
    if (reqBody.valid_until && typeof reqBody.valid_until === "string") {
        const date = new Date(reqBody.valid_until);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format. Found ${reqBody.valid_until} as valid_until.`);
        }
        reqBody.valid_until = date;
    }
    
    // create staff ticket
    const staffTicket = {
        event: reqBody.event,
        verification_email: reqBody.verification_email || null,
        valid_until: reqBody.valid_until || null,
        note: reqBody.note || null,
        message: reqBody.message || null,
        connected_user: reqBody.connected_user || null
    };
    
    let staffTicketResult = null;
    try {
        staffTicketResult = (await dbConnection.insert(staffTickets).values(staffTicket).returning())[0];
        console.log("Staff Ticket created:", staffTicketResult);
        
        // grant permissions only if booths are provided
        if (boothsArray.length > 0) {
            for (const booth of boothsArray) {
                const permission = await grantStaffPermission(staffTicketResult.staff_tickets_id, booth);
                console.log("Permission granted:", permission);
            }
        }
        
    } catch (error) {
        console.error("Error creating staff ticket:", error);
        if (staffTicketResult) {
            console.error("Staff ticket result exists, reversing:", staffTicketResult);
            await dbConnection.delete(staffTickets).where(eq(staffTickets.staff_tickets_id, staffTicketResult.staff_tickets_id));
        }
        throw new Error("Error creating staff ticket.");
    }
    
    return staffTicketResult;
}

async function updateStaff(reqBody){
    
    // varify if req
    if (!reqBody) {
        throw new Error("Request is required.");
    }
    if (typeof reqBody !== "object") {
        throw new Error("Request must be an object.");
    }
    
    // check if required fields are present
    const requiredFields = [
        "staff_tickets_id",
        // "verification_email",
        // "valid_until",
        // "note",
        // "message",
        // "connected_user",
        // "Booths"
    ];
    for (const field of requiredFields) {
        if (!reqBody[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    const dbConnection = getConnection();
    
    // check if staff ticket exists
    if (!projectutility.isValidUUID(reqBody.staff_tickets_id)) {
        throw new Error(`Invalid Staff Ticket ID format. Found ${reqBody.staff_tickets_id} as staff_ticket_id.`);
    }
    const staffTicketExists = await dbConnection.select().from(staffTickets).where(eq(staffTickets.staff_tickets_id, reqBody.staff_tickets_id));
    if (staffTicketExists.length === 0) {
        throw new Error(`Staff Ticket not found. Found ${reqBody.staff_tickets_id} as staff_ticket_id.`);
    }
    
    // check Booths
    if (reqBody.Booths) {
        if (!Array.isArray(reqBody.Booths)) {
            throw new Error("Booths must be an array.");
        }
        for (const booth of reqBody.Booths) {
            if (!projectutility.isValidUUID(booth)) {
                throw new Error(`Invalid Booth ID format. Found ${booth} as booth_id.`);
            }
            const boothExists = await dbConnection.select().from(booths).where(eq(booths.booth_id, booth));
            if (boothExists.length === 0) {
                throw new Error(`Booth not found. Found ${booth} as booth_id.`);
            }
        }
    }

    // check if connected user exists
    if (reqBody.connected_user) {
        if (!projectutility.isValidUUID(reqBody.connected_user)) {
            throw new Error(`Invalid User ID format. Found ${reqBody.connected_user} as user_id.`);
        }
        const userExists = await dbConnection.select().from(users).where(eq(users.user_id, reqBody.connected_user));
        if (userExists.length === 0) {
            throw new Error(`User not found. Found ${reqBody.connected_user} as user_id.`);
        }
    }
    
    // check if verification email is valid
    if (reqBody.verification_email) {
        if (typeof reqBody.verification_email !== "string") {
            throw new Error("Verification email must be a string.");
        }
        if (!projectutility.isValidEmail(reqBody.verification_email)) {
            throw new Error(`Invalid email format. Found ${reqBody.verification_email} as verification_email.`);
        }
    }
    
    // convert valid_until to date
    if (reqBody.valid_until && typeof reqBody.valid_until === "string") {
        const date = new Date(reqBody.valid_until);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format. Found ${reqBody.valid_until} as valid_until.`);
        }
        reqBody.valid_until = date;
    }
    
    // update staff ticket
    const staffTicket = {
        event: reqBody.event,
        verification_email: reqBody.verification_email || undefined,
        valid_until: reqBody.valid_until,
        note: reqBody.note || undefined,
        message: reqBody.message || undefined,
        connected_user: reqBody.connected_user || undefined
    };
    
    const staffTicketResult = await dbConnection.update(staffTickets).set(staffTicket).where(eq(staffTickets.staff_tickets_id, reqBody.staff_tickets_id)).returning();
    console.log("Staff Ticket updated:", staffTicketResult);
    
    // revoke all permissions
    const permissions = await dbConnection.select().from(staffPermissions).where(eq(staffPermissions.staff_ticket, reqBody.staff_tickets_id));
    for (const permission of permissions) {
        await revokeStaffPermission(permission.staff_ticket, permission.booth);
    }
    
    // grant new permissions
    if (reqBody.Booths) {
        for (const booth of reqBody.Booths) {
            const permission = await grantStaffPermission(reqBody.staff_tickets_id, booth);
            console.log("Permission granted:", permission);
        }
    }
    // return updated staff ticket
    
    return staffTicketResult[0];

}

async function deleteStaff(reqBody){
    
    // varify if req
    if (!reqBody) {
        throw new Error("Request is required.");
    }
    if (typeof reqBody !== "object") {
        throw new Error("Request must be an object.");
    }
    
    // check if required fields are present
    const requiredFields = [
        "staff_tickets_id",
    ];
    for (const field of requiredFields) {
        if (!reqBody[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    const dbConnection = getConnection();
    
    // check if staff ticket exists
    if (!projectutility.isValidUUID(reqBody.staff_tickets_id)) {
        throw new Error(`Invalid Staff Ticket ID format. Found ${reqBody.staff_tickets_id} as staff_ticket_id.`);
    }
    const staffTicketExists = await dbConnection.select().from(staffTickets).where(eq(staffTickets.staff_tickets_id, reqBody.staff_tickets_id));
    if (staffTicketExists.length === 0) {
        throw new Error(`Staff Ticket not found. Found ${reqBody.staff_tickets_id} as staff_ticket_id.`);
    }
    
    // revoke all permissions is not needed because we are deleting the staff ticket and the permissions will be deleted automatically by on delete cascade
    // // revoke all permissions
    // const permissions = await dbConnection.select().from(staffPermissions).where(eq(staffPermissions.staff_ticket, reqBody.staff_tickets_id));
    // for (const permission of permissions) {
    //     await revokeStaffPermission(permission.staff_ticket, permission.booth);
    // }
    
    // delete staff ticket
    const result = await dbConnection.delete(staffTickets).where(eq(staffTickets.staff_tickets_id, reqBody.staff_tickets_id)).returning();
    
    console.log("Staff Ticket deleted:", result);
    
}

async function getStaffByStaffTicketId(staffTicketId) {
    const dbConnection = getConnection();
    
    if (!staffTicketId) {
        throw new Error("Staff Ticket ID is required.");
    }
    
    if (!projectutility.isValidUUID(staffTicketId)) {
        throw new Error(`Invalid Staff Ticket ID format. Found ${staffTicketId} as staff_ticket_id.`);
    }
    
    // check if staff ticket exists
    const staffQueryResult = await dbConnection.select().from(staffTickets).where(eq(staffTickets.staff_tickets_id, staffTicketId));
    if (staffQueryResult.length === 0) {
        throw new Error(`Staff Ticket not found. Found ${staffTicketId} as staff_ticket_id.`);
    }
    
    // get permissions
    const permissions = await dbConnection.select().from(staffPermissions).where(eq(staffPermissions.staff_ticket, staffTicketId));
    const resolvedBooths = [];
    for (const permission of permissions) {
        const booth = await dbConnection.select().from(booths).where(eq(booths.booth_id, permission.booth));
        if (booth.length > 0) {
            resolvedBooths.push(booth[0]);
        }
    }
    staffQueryResult[0].Booths = resolvedBooths;
    if (staffQueryResult[0].connected_user) {
        const resolvedConnectedUser = await User.getUserByUserId(staffQueryResult[0].connected_user);
        staffQueryResult[0].connected_user = resolvedConnectedUser;
    }
    
    // get event
    const event = await dbConnection.select().from(events).where(eq(events.event_id, staffQueryResult[0].event));
    if (event.length > 0) {
        staffQueryResult[0].event = event[0];
    }
    
    return staffQueryResult[0];
}

export default {
    getStaffOfUser,
    getStaffOfEvent,
    grantStaffPermission,
    revokeStaffPermission,
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffByStaffTicketId
    
}