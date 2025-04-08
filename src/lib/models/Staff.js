import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, staffTickets, staffPermissions, events, booths } from "@/database/schema";
import { eq, and, sql  } from "drizzle-orm";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";
import { sendEmail } from "@/lib/emailservice";

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
    
    if (reqBody.verification_email) {
        sendInviteEmail(staffTicketResult);
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

async function getStaffByInvitationCode(invitationCode) {
    const dbConnection = getConnection();
    
    if (!invitationCode) {
        throw new Error("Invitation Code is required.");
    }
    
    if (typeof invitationCode !== "string") {
        throw new Error("Invitation Code must be a string.");
    }
    
    // check if invitation code is valid
    // the invitation code is the first part of the staff ticket id
    const pattern = invitationCode + "-%";
    const staffQueryResult = await dbConnection
        .select()
        .from(staffTickets)
        .where(sql`${staffTickets.staff_tickets_id}::text LIKE ${pattern}`);
    
    return staffQueryResult;
}

async function sendInviteEmail(staffTicketBody) {
    // send email to staff
    const email = staffTicketBody.verification_email;
    
    const event = await Event.getEventByEventId(staffTicketBody.event);
    if (!event) {
        throw new Error("Event not found.");
    }
    
    const invitationCode = (staffTicketBody.staff_tickets_id.split("-"))[0];
    
    const subject = "คุณได้รับการเชิญให้เป็น Staff อีเวนต์จาก EventPress";
    const body = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Staff Invitation</title>
            <style>
                body {
                    font-family: 'Prompt', 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #6366f1;
                    padding: 20px;
                    color: #ffffff;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                }
                .content {
                    background-color: #f8fafc;
                    padding: 30px;
                    border-left: 1px solid #e2e8f0;
                    border-right: 1px solid #e2e8f0;
                    color: #1e293b;
                }
                .footer {
                    background-color: #f1f5f9;
                    padding: 15px;
                    color: #475569;
                    font-size: 14px;
                    text-align: center;
                    border-radius: 0 0 8px 8px;
                    border: 1px solid #e2e8f0;
                }
                .event-name {
                    font-weight: bold;
                    color: #6366f1;
                    font-size: 18px;
                }
                .invitation-code {
                    background-color: #f1f5f9;
                    color: #1e293b;
                    padding: 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 20px;
                    text-align: center;
                    letter-spacing: 2px;
                    margin: 20px 0;
                    border: 1px dashed #94a3b8;
                }
                .button {
                    display: inline-block;
                    background-color: #6366f1;
                    color: #ffffff !important;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .message {
                    background-color: #ffffff;
                    border-left: 4px solid #6366f1;
                    padding: 15px;
                    margin: 20px 0;
                    color: #1e293b;
                }
                a {
                    color: #6366f1;
                    text-decoration: underline;
                }
                h1, h2, p {
                    color: inherit;
                }
                .dark-mode-friendly {
                    color-scheme: light dark;
                    -webkit-font-smoothing: antialiased;
                }
                @media (prefers-color-scheme: dark) {
                    /* Dark mode styles are handled by email clients */
                    /* We're making sure our colors have enough contrast in both modes */
                }
            </style>
        </head>
        <body class="dark-mode-friendly">
            <div class="header">
                <h1 style="color: #ffffff;">EventPress Staff Invitation</h1>
            </div>
            
            <div class="content">
                <h2>เรียนเจ้าของอีเมล ${email}</h2>
                
                <p>คุณได้รับการเชิญให้เป็น Staff อีเวนต์จาก EventPress</p>
                
                <p>อีเวนต์: <span class="event-name">${event.name}</span></p>
                
                <div class="message">
                    <p>${staffTicketBody.message || 'เรายินดีที่คุณจะมาร่วมเป็นส่วนหนึ่งของทีมงานในอีเวนต์นี้'}</p>
                </div>
                
                <p><strong>รหัส Invitation Code:</strong></p>
                <div class="invitation-code">${invitationCode}</div>
                
                <div style="text-align: center;">
                    <a href="https://secretly-big-lobster.ngrok-free.app" class="button">รับคำเชิญ</a>
                </div>
                
                <p>กรุณาเข้าสู่ระบบที่ <a href="https://secretly-big-lobster.ngrok-free.app">EventPress</a> และคลิกที่ปุ่ม "รับคำเชิญ" เพื่อเข้าร่วมเป็น Staff</p>
            </div>
            
            <div class="footer">
                <p>หากคุณไม่ใช่เจ้าของอีเมลนี้ กรุณาเพิกเฉย</p>
                <p>&copy; ${new Date().getFullYear()} EventPress - Professional Event Management Platform</p>
            </div>
        </body>
        </html>
    `;
    
    try {
        const result = await sendEmail(email, subject, body);
        console.log("Email sent successfully:", result);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email.");
    }
}

async function sendAcceptEmail(staffTicketId) {
    
    const staffTicketBody = await getStaffByStaffTicketId(staffTicketId);
    
    // send email to staff
    const email = staffTicketBody.verification_email;
    
    const event = staffTicketBody.event;
    if (!event) {
        throw new Error("Event not found.");
    }
    
    const verificationCode = (staffTicketBody.staff_tickets_id.split("-"))[staffTicketBody.staff_tickets_id.split("-").length - 1];
    
    const subject = "รหัสยืนยันการเข้าร่วม Staff อีเวนต์จาก EventPress";
    
    // email to send validation code to staff (use the invitation code as verification code)
    const body = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Staff Verification</title>
            <style>
                body {
                    font-family: 'Prompt', 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #22c55e;
                    padding: 20px;
                    color: #ffffff;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                }
                .content {
                    background-color: #f8fafc;
                    padding: 30px;
                    border-left: 1px solid #e2e8f0;
                    border-right: 1px solid #e2e8f0;
                    color: #1e293b;
                }
                .footer {
                    background-color: #f1f5f9;
                    padding: 15px;
                    color: #475569;
                    font-size: 14px;
                    text-align: center;
                    border-radius: 0 0 8px 8px;
                    border: 1px solid #e2e8f0;
                }
                .event-name {
                    font-weight: bold;
                    color: #22c55e;
                    font-size: 18px;
                }
                .verification-code {
                    background-color: #f1f5f9;
                    color: #1e293b;
                    padding: 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 24px;
                    text-align: center;
                    letter-spacing: 2px;
                    margin: 20px 0;
                    border: 1px dashed #22c55e;
                    font-weight: bold;
                }
                .button {
                    display: inline-block;
                    background-color: #22c55e;
                    color: #ffffff !important;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .success-box {
                    background-color: #dcfce7;
                    border-left: 4px solid #22c55e;
                    padding: 15px;
                    margin: 20px 0;
                    color: #166534;
                }
                a {
                    color: #22c55e;
                    text-decoration: underline;
                }
                h1, h2, p {
                    color: inherit;
                }
                .dark-mode-friendly {
                    color-scheme: light dark;
                    -webkit-font-smoothing: antialiased;
                }
                .check-icon {
                    font-size: 32px;
                    color: #22c55e;
                    margin-right: 10px;
                }
                @media (prefers-color-scheme: dark) {
                    /* Dark mode styles are handled by email clients */
                    /* We're making sure our colors have enough contrast in both modes */
                }
            </style>
        </head>
        <body class="dark-mode-friendly">
            <div class="header">
                <h1 style="color: #ffffff;">ยืนยันการเข้าร่วมเป็น Staff</h1>
            </div>
            
            <div class="content">
                <h2>เรียนคุณ ${email}</h2>
                
                <p>รหัสยืนยันสำหรับรับคำเชิญ Staff:</p>
                
                <div class="verification-code">${verificationCode}</div>
                
                <p><strong>วิธีการใช้รหัสยืนยัน:</strong></p>
                <ol>
                    <li>เข้าสู่ระบบ EventPress </li>
                    <li>เลือกตัวเลือกรับคำเชิญ Staff</li>
                    <li>กรอกรหัสยืนยัน</li>
                </ol>
                
                <p>รายละเอียดอีเวนต์:</p>
                <ul>
                    <li>ชื่ออีเวนต์: ${event.name}</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="https://secretly-big-lobster.ngrok-free.app" class="button">เข้าสู่ระบบ Staff</a>
                </div>
                
                <p>หากคุณมีข้อสงสัยใดๆ กรุณาติดต่อผู้จัดงานได้โดยตรง</p>
            </div>
            
            <div class="footer">
                <p>ขอบคุณที่เป็นส่วนหนึ่งของความสำเร็จในอีเวนต์นี้</p>
                <p>&copy; ${new Date().getFullYear()} EventPress - Professional Event Management Platform</p>
            </div>
        </body>
        </html>
    `;
    
    try {
        const result = await sendEmail(email, subject, body);
        console.log("Verification email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Error sending verification email.");
    }
}


export default {
    getStaffOfUser,
    getStaffOfEvent,
    grantStaffPermission,
    revokeStaffPermission,
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffByStaffTicketId,
    getStaffByInvitationCode,
    sendInviteEmail,
    sendAcceptEmail
    
}