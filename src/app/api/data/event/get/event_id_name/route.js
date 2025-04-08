import { NextResponse } from "next/server";
import projectutility from "@/lib/projectutility";
import Event from "@/lib/models/Event";
import Organizer from "@/lib/models/Organizer";
import User from "@/lib/models/User";

import { getConnection } from "@/lib/dbconnector";
import { events, organizers, users, staffPermissions, staffTickets, booths } from "@/database/schema";
import { eq, and } from "drizzle-orm";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    
    try {
        
        const session = await getServerSession(authOptions);
        
        console.log("Session:", session);
    
        if (!session || !session.user) {
            console.error("API ERROR: Unauthorized access", session);
            return NextResponse.json(
                { message: "Unauthorized access", isSuccess: false },
                { status: 401 }
            );
        }
        
        const currentUser = await User.getUserByIdentityEmail(session.user.email);
        if (!currentUser) {
            console.error("API ERROR: Unauthorized access, user not found", session.user.email);
            return NextResponse.json(
                { message: "Unauthorized access, user not found", isSuccess: false },

                { status: 401 }
            );
        }
        
        
        let request_body;
        try {
            request_body = await req.json();
        } catch (error) {
            console.error("API ERROR: Failed to parse JSON body", error);
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }
        
        const requiredFields = ["event_id_name"];
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing required field: ${field}`);
                return NextResponse.json(
                    { message: `Missing required field: ${field}`, isSuccess: false },
                    { status: 400 }
                );
            }
        }
        
        const event = await Event.getEventByIdName(request_body.event_id_name);
        if (!event) {
            console.error("API ERROR: Event not found", request_body.event_id_name);
            return NextResponse.json(
                { message: "Event not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        const organizer = await Organizer.getOrganizerByOrganizerId(event.organizer);
        
        event.isOwner = currentUser.user_id === organizer.owner;
        
        if (!event.isOwner) {
            const dbConnection = getConnection();
            const relatedStaffTickets = await dbConnection.
                select().from(staffTickets).where(
                    and(
                        eq(staffTickets.event, event.event_id),
                        eq(staffTickets.connected_user, currentUser.user_id)
                    )
                );
            console.log("Related Staff Tickets:", relatedStaffTickets);
            if (relatedStaffTickets.length == 1){
                console.log("Staff Ticket:", relatedStaffTickets[0]);
                const visibleBoothOfStaffTicket = await dbConnection.
                    select().from(staffPermissions).where(
                        eq(staffPermissions.staff_ticket, relatedStaffTickets[0].staff_tickets_id)
                    );
                console.log("Visible Booth of Staff Ticket:", visibleBoothOfStaffTicket);
                const resolvedBooths = [];
                for (const staffPermissions of visibleBoothOfStaffTicket) {
                    const booth = await dbConnection.
                        select().from(booths).where(
                            eq(booths.booth_id, staffPermissions.booth)
                        );
                    console.log("Booth:", booth);
                    if (booth.length > 0) {
                        resolvedBooths.push(booth[0]);
                    }
                }
                event.Booths = resolvedBooths;
            }
            
        }
        
        console.log("Event data:", event);

        return NextResponse.json(
            { message: "Event retrieved successfully", content: event, isSuccess: true },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
