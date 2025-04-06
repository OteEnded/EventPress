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

export async function POST(req, { params }) {
    
    const param = await params;
    
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

        const { boothId } = param;
        if (!projectutility.isValidUUID(boothId)) {
            console.error("API ERROR: Invalid booth ID");
            return NextResponse.json(
                { error: "Invalid booth ID" },
                { status: 400 }
            );
        }

        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Booth update request body:", request_body);
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

        // Check if booth exists
        const boothExists = await dbConnection
            .select({ booth_id: booths.booth_id })
            .from(booths)
            .where(eq(booths.booth_id, boothId));

        if (boothExists.length === 0) {
            return NextResponse.json(
                { error: "Booth not found", isSuccess: false },
                { status: 404 }
            );
        }

        // Only update fields that are provided
        const updateData = {};
        
        if (request_body.name !== undefined) {
            updateData.name = request_body.name;
        }
        
        if (request_body.description !== undefined) {
            updateData.description = request_body.description;
        }
        
        if (request_body.location !== undefined) {
            updateData.location = request_body.location;
        }
        
        if (request_body.contact_info !== undefined) {
            updateData.contact_info = request_body.contact_info;
        }
        
        if (request_body.banner !== undefined) {
            updateData.banner = request_body.banner;
        }

        // If event is being updated, validate that the event exists
        if (request_body.event !== undefined) {
            if (!projectutility.isValidUUID(request_body.event)) {
                return NextResponse.json(
                    { error: "Invalid event ID format" },
                    { status: 400 }
                );
            }

            const eventExists = await dbConnection
                .select({ event_id: events.event_id })
                .from(events)
                .where(eq(events.event_id, request_body.event));

            if (eventExists.length === 0) {
                return NextResponse.json(
                    { error: "Event not found", isSuccess: false },
                    { status: 404 }
                );
            }

            updateData.event = request_body.event;
        }

        // Check if there are any fields to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields to update", isSuccess: false },
                { status: 400 }
            );
        }

        // Set the updated_at timestamp
        updateData.updated_at = new Date();

        // Update the booth
        const result = await dbConnection
            .update(booths)
            .set(updateData)
            .where(eq(booths.booth_id, boothId))
            .returning();

        if (!result || result.length === 0) {
            return NextResponse.json(
                { error: "Failed to update booth", isSuccess: false },
                { status: 500 }
            );
        }

        projectutility.log("Booth updated:", result);
        return NextResponse.json(
            { message: "Booth updated successfully", content: result[0], isSuccess: true },
            { status: 200 }
        );

    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error", isSuccess: false },
            { status: 500 }
        );
    }
}