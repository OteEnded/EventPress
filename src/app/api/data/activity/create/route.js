import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { activities, booths } from "@/database/schema";
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
            projectutility.log("Activity create request body:", request_body);
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
        const requiredFields = ["booth", "name"];
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate booth ID
        const boothId = request_body.booth;
        if (!projectutility.isValidUUID(boothId)) {
            console.error("API ERROR: Invalid booth ID format");
            return NextResponse.json(
                { error: "Invalid booth ID format" },
                { status: 400 }
            );
        }

        // Check if the booth exists
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

        // Prepare activity data for insertion
        const activityData = {
            booth: request_body.booth,
            name: request_body.name,
            description: request_body.description || null,
            location: request_body.location || null,
            start_time: request_body.start_time || null,
            end_time: request_body.end_time || null,
            price: request_body.price !== undefined ? request_body.price : 0,
        };

        // Insert the activity
        const result = await dbConnection
            .insert(activities)
            .values(activityData)
            .returning();

        if (!result || result.length === 0) {
            return NextResponse.json(
                { error: "Failed to create activity", isSuccess: false },
                { status: 500 }
            );
        }

        projectutility.log("Activity created:", result);
        return NextResponse.json(
            { message: "Activity created successfully", content: result[0], isSuccess: true },
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