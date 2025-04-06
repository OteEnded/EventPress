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
            projectutility.log("Organizer delete request body:", request_body);
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
        
        // check if organizer exist
        const organizer = await dbConnection.select().from(organizers).where(eq(organizers.organizer_id, organizerId));
        if (organizer.length === 0) {
            return NextResponse.json(
                { error: "Organizer not found" },
                { status: 404 }
            );
        }
        
        const deleteResult = await dbConnection.delete(organizers).where(eq(organizers.organizer_id, organizerId)).returning();
        if (deleteResult.length === 0) {
            return NextResponse.json(
                { error: "Failed to delete organizer" },
                { status: 500 }
            );
        }

        projectutility.log("Organizer updated:", deleteResult);
        return NextResponse.json(
            { message: "Organizer updated successfully", content: deleteResult[0], isSuccess: true },
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