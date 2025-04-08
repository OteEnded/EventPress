import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { events, organizers, eventAttendees } from "@/database/schema";
import { eq } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import Event from "@/lib/models/event";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    try {
        // No authentication check for public attendance registration
        
        const dbConnection = getConnection();
        
        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Attendee create request body:", request_body);
        } catch (error) {
            console.error("API ERROR: Failed to parse JSON body", error);
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        if (!request_body || typeof request_body !== "object") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        // Ensure required fields exist
        const requiredFields = [
            "event",
            "firstname",
            "lastname"
        ];
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }
        
        const event = await Event.getEventByIdName(
            request_body.event
        );
        if (!event) {
            return NextResponse.json(
                { error: "Event not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        const newAttendee = {
            event: event.event_id, // Using event_id as per your db schema
            firstname: request_body.firstname,
            lastname: request_body.lastname,
        };
        
        const result = await dbConnection.insert(eventAttendees).values(newAttendee).returning();
        if (result.length === 0) {
            return NextResponse.json(
                { error: "Failed to create attendee", isSuccess: false },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { message: "Attendee registered successfully", content: result[0], isSuccess: true },
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
