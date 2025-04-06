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

        const { activityId } = param;
        if (!projectutility.isValidUUID(activityId)) {
            console.error("API ERROR: Invalid activity ID");
            return NextResponse.json(
                { error: "Invalid activity ID" },
                { status: 400 }
            );
        }

        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Activity update request body:", request_body);
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

        // Check if activity exists
        const activityExists = await dbConnection
            .select({ activity_id: activities.activity_id })
            .from(activities)
            .where(eq(activities.activity_id, activityId));

        if (activityExists.length === 0) {
            return NextResponse.json(
                { error: "Activity not found", isSuccess: false },
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
        
        if (request_body.start_time !== undefined) {
            updateData.start_time = request_body.start_time;
        }
        
        if (request_body.end_time !== undefined) {
            updateData.end_time = request_body.end_time;
        }
        
        if (request_body.price !== undefined) {
            updateData.price = request_body.price;
        }

        // If booth is being updated, validate that the booth exists
        if (request_body.booth !== undefined) {
            if (!projectutility.isValidUUID(request_body.booth)) {
                return NextResponse.json(
                    { error: "Invalid booth ID format" },
                    { status: 400 }
                );
            }

            const boothExists = await dbConnection
                .select({ booth_id: booths.booth_id })
                .from(booths)
                .where(eq(booths.booth_id, request_body.booth));

            if (boothExists.length === 0) {
                return NextResponse.json(
                    { error: "Booth not found", isSuccess: false },
                    { status: 404 }
                );
            }

            updateData.booth = request_body.booth;
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

        // Update the activity
        const result = await dbConnection
            .update(activities)
            .set(updateData)
            .where(eq(activities.activity_id, activityId))
            .returning();

        if (!result || result.length === 0) {
            return NextResponse.json(
                { error: "Failed to update activity", isSuccess: false },
                { status: 500 }
            );
        }

        projectutility.log("Activity updated:", result);
        return NextResponse.json(
            { message: "Activity updated successfully", content: result[0], isSuccess: true },
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