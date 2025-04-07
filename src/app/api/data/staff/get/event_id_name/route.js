import { NextResponse } from "next/server";
import projectutility from "@/lib/projectutility";
import Event from "@/lib/models/Event";
import Organizer from "@/lib/models/Organizer";
import User from "@/lib/models/User";

import Staff from "@/lib/models/Staff";

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
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { message: `Missing field ${field}`, isSuccess: false },
                    { status: 400 }
                );
            }
        }
        
        // Check if the event_id_name is valid uuid format
        if (!projectutility.isValidUUID(request_body.event_id_name)) {
            // If not, return an error response
            console.error("API ERROR: Invalid event_id_name uuid format", event_id_name);
            return NextResponse.json(
                { message: "Invalid event_id_name uuid format", isSuccess: false },
                { status: 400 }
            );
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
        
        if(currentUser.user_id !== organizer.owner){
            console.error("API ERROR: Unauthorized access, user is not the owner", session.user.email);
            return NextResponse.json(
                { message: "Unauthorized access, user is not the owner", isSuccess: false },

                { status: 401 }
            );
        }
        
        const staff = await Staff.getStaffOfEvent(event.event_id);
        
        /*
        return example
        [
        
        ]
        */
        

        return NextResponse.json(
            { message: "Event retrieved successfully", content: staff, isSuccess: true },
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
