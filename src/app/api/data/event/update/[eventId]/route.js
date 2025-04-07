import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { events, organizers } from "@/database/schema";
import { eq, or, and, not } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import Events from "@/lib/models/Event";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req, { params }) {
    const param = await params;

    const dbConnection = getConnection();

    try {
        const { eventId } = param;

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
        const requiredFields = [];
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Check if the organizer exists in the database
        if (request_body.organizer) {
            if (!projectutility.isValidUUID(request_body.organizer)) {
                console.error("API ERROR: Invalid organizer UUID format");
                return NextResponse.json(
                    { error: "Invalid organizer UUID format" },
                    { status: 400 }
                );
            }
            const organizerExists = await dbConnection
                .select()
                .from(organizers)
                .where(eq(organizers.organizer_id, request_body.organizer));
            if (organizerExists.length === 0) {
                console.error("API ERROR: Organizer does not exist");
                return NextResponse.json(
                    { error: "Organizer does not exist" },
                    { status: 400 }
                );
            }
        }

        // Check if the event exists in the database
        const eventExists = await Events.getEventByIdName(eventId);
        if (!eventExists) {
            console.error("API ERROR: Event does not exist");
            return NextResponse.json(
                { error: "Event does not exist" },
                { status: 404 }
            );
        }
        const resolvedEventId = eventExists.event_id;

        // Check if id_name is a not existing id_name in the database
        if (request_body.id_name) {
            const idNameExists = await dbConnection
                .select()
                .from(events)
                .where(
                    and(
                        eq(events.id_name, request_body.id_name),
                        not(eq(events.event_id, resolvedEventId))
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
        const eventData = {};

        if (request_body.name !== undefined) {
            eventData.name = request_body.name;
        }
        if (request_body.id_name !== undefined) {
            eventData.id_name = request_body.id_name;
        }
        if (request_body.description !== undefined) {
            eventData.description = request_body.description;
        }
        if (request_body.location !== undefined) {
            eventData.location = request_body.location;
        }
        if (request_body.start_date !== undefined) {
            eventData.start_date = request_body.start_date;
        }
        if (request_body.end_date !== undefined) {
            eventData.end_date = request_body.end_date;
        }
        if (request_body.start_time !== undefined) {
            eventData.start_time = request_body.start_time;
        }
        if (request_body.end_time !== undefined) {
            eventData.end_time = request_body.end_time;
        }
        if (request_body.capacity !== undefined) {
            eventData.capacity = request_body.capacity;
        }
        if (request_body.price !== undefined) {
            eventData.price = request_body.price;
        }
        if (request_body.contact_info !== undefined) {
            eventData.contact_info = request_body.contact_info;
        }
        if (request_body.organizer !== undefined) {
            eventData.organizer = request_body.organizer;
        }
        if (request_body.banner !== undefined) {
            eventData.banner = request_body.banner;
        }

        const result = await dbConnection
            .update(events)
            .set(eventData)
            .where(eq(events.event_id, resolvedEventId))
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
            {
                message: "Event updated successfully",
                content: result[0],
                isSuccess: true,
            },
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
