import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { organizers, users } from "@/database/schema";
import { eq, and, not } from "drizzle-orm";
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

        const { organizerId } = param;
        if (!projectutility.isValidUUID(organizerId)) {
            console.error("API ERROR: Invalid organizer ID");
            return NextResponse.json(
                { error: "Invalid organizer ID" },
                { status: 400 }
            );
        }

        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Organizer update request body:", request_body);
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

        // Check if owner is a valid UUID
        if (!projectutility.isValidUUID(request_body.owner)) {
            console.error("API ERROR: Invalid owner UUID");
            return NextResponse.json(
                { error: "Invalid owner UUID" },
                { status: 400 }
            );
        }

        // Check if the owner exists in the database
        const userExists = await dbConnection.select()
            .from(users)
            .where(eq(users.user_id, request_body.owner));
        if (userExists.length === 0) {
            console.error("API ERROR: Owner user does not exist");
            return NextResponse.json(
                { error: "Owner user does not exist" },
                { status: 400 }
            );
        }

        // Update the organizer in the database
        const organizerData = {};

        // Only include fields that were provided in the request
        if (request_body.owner!== undefined) organizerData.owner = request_body.owner;
        if (request_body.name!== undefined) organizerData.name = request_body.name;
        if (request_body.description !== undefined) organizerData.description = request_body.description;
        if (request_body.website !== undefined) organizerData.website = request_body.website;
        if (request_body.email !== undefined) organizerData.email = request_body.email;
        if (request_body.phone_number !== undefined) organizerData.phone_number = request_body.phone_number;
        if (request_body.address !== undefined) organizerData.address = request_body.address;

        const result = await dbConnection.update(organizers)
            .set(organizerData)
            .where(eq(organizers.organizer_id, organizerId))
            .returning();

        if (result.length === 0) {
            console.error("API ERROR: Failed to update organizer");
            return NextResponse.json(
                { error: "Failed to update organizer" },
                { status: 500 }
            );
        }

        projectutility.log("Organizer updated:", result);
        return NextResponse.json(
            { message: "Organizer updated successfully", content: result[0], isSuccess: true },
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