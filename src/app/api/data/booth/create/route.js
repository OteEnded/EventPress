import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { booths, events } from "@/database/schema";
import { eq } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    const dbConnection = getConnection();

    try {
        // Authentication check
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", isSuccess: false },
                { status: 401 }
            );
        }

        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Booth create request body:", request_body);
        } catch (error) {
            console.error("API ERROR: Failed to parse JSON body", error);
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        if (!request_body || typeof request_body !== "object") {
            console.error("API ERROR: Invalid request body format");
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        // Ensure required fields exist
        const requiredFields = ["event", "name"];
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate event ID
        const eventId = request_body.event;
        if (!projectutility.isValidUUID(eventId)) {
            console.error("API ERROR: Invalid event ID format");
            return NextResponse.json(
                { error: "Invalid event ID format" },
                { status: 400 }
            );
        }

        // Check if the event exists
        const eventExists = await dbConnection
            .select({ event_id: events.event_id })
            .from(events)
            .where(eq(events.event_id, eventId));

        if (eventExists.length === 0) {
            return NextResponse.json(
                { error: "Event not found", isSuccess: false },
                { status: 404 }
            );
        }

        // Prepare booth data for insertion
        const boothData = {
            event: request_body.event,
            name: request_body.name,
            description: request_body.description || null,
            location: request_body.location || null,
            contact_info: request_body.contact_info || null,
            banner: request_body.banner || null,
        };

        // Insert the booth
        const result = await dbConnection
            .insert(booths)
            .values(boothData)
            .returning();

        if (!result || result.length === 0) {
            return NextResponse.json(
                { error: "Failed to create booth", isSuccess: false },
                { status: 500 }
            );
        }

        projectutility.log("Booth created:", result);
        return NextResponse.json(
            { message: "Booth created successfully", content: result[0], isSuccess: true },
            { status: 201 }
        );

    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error", isSuccess: false },
            { status: 500 }
        );
    }
}