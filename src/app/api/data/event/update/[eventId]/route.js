import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { events, organizers } from "@/database/schema";
import { eq, or, and, not } from "drizzle-orm";
import projectutility from "@/lib/projectutility";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req, { params }) {
    
    const param = await params;
    
    const dbConnection = getConnection();

    try {
        const { eventId } = param;
        if (!projectutility.isValidUUID(eventId)) {
            console.error("API ERROR: Invalid event ID");
            return NextResponse.json(
                { error: "Invalid event ID" },
                { status: 400 }
            );
        }

        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Event update request body:", request_body);
        } catch (error) {
            console.error("API ERROR: Failed to parse JSON body", error, req);
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
        const requiredFields = ["name", "organizer"];
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Check if organizer is a valid UUID
        if (!projectutility.isValidUUID(request_body.organizer)) {
            console.error("API ERROR: Invalid organizer UUID");
            return NextResponse.json(
                { error: "Invalid organizer UUID" },
                { status: 400 }
            );
        }

        // Check if the organizer exists in the database
        const organizerExists = await dbConnection.select()
            .from(organizers)
            .where(eq(organizers.organizer_id, request_body.organizer));
        if (organizerExists.length === 0) {
            console.error("API ERROR: Organizer does not exist");
            return NextResponse.json(
                { error: "Organizer does not exist" },
                { status: 400 }
            );
        }
        
        // Check if id_name is a not existing id_name in the database
        if (request_body.id_name) {
            const idNameExists = await dbConnection.select()
                .from(events)
                .where(
                    and(
                        eq(events.id_name, request_body.id_name),
                        not(eq(events.event_id, eventId))
                    )
                );
            
            if (idNameExists.length > 0) {
                console.error("API ERROR: id_name already exists");
                return NextResponse.json(
                    { error: "id_name already exists" },
                    { status: 400 }
                );
            }
        }

        // Update the event in the database
        const eventData = {
            name: request_body.name,
            id_name: request_body.id_name || null,
            description: request_body.description || null,
            location: request_body.location || null,
            start_date: request_body.start_date || null,
            end_date: request_body.end_date || null,
            start_time: request_body.start_time || null,
            end_time: request_body.end_time || null,
            capacity: request_body.capacity || null,
            price: request_body.price || 0.0,
            contact_info: request_body.contact_info || null,
            organizer: request_body.organizer
        };

        const result = await dbConnection.update(events)
            .set(eventData)
            .where(eq(events.event_id, eventId))
            .returning();

        if (result.length === 0) {
            console.error("API ERROR: Failed to update event");
            return NextResponse.json(
                { error: "Failed to update event" },
                { status: 500 }
            );
        }

        projectutility.log("Event updated:", result);
        return NextResponse.json(
            { message: "Event updated successfully", content: result[0], isSuccess: true },
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
