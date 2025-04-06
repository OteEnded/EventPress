import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { events, organizers, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
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
            projectutility.log("Event delete request body:", request_body);
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

        // Check if the event exists
        const event = await dbConnection.select()
            .from(events)
            .where(eq(events.event_id, eventId));
        
        if (event.length === 0) {
            return NextResponse.json(
                { error: "Event not found", isSuccess: false },
                { status: 404 }
            );
        }

        // Authorization check: Ensure user is the organizer owner
        // First get the organizer ID from the event
        const organizerId = event[0].organizer;
        
        // Then check if the current user is the owner of this organizer
        const organizerData = await dbConnection.select({
            owner: organizers.owner
        })
        .from(organizers)
        .where(eq(organizers.organizer_id, organizerId));
        
        // if (organizerData.length === 0) {
        //     return NextResponse.json(
        //         { error: "Organizer not found", isSuccess: false },
        //         { status: 404 }
        //     );
        // }
        
        // // Get user ID from session email
        // const userData = await dbConnection.query.users.findFirst({
        //     where: eq(users.identity_email, session.user.email),
        //     columns: {
        //         user_id: true
        //     }
        // });
        
        // if (!userData || organizerData[0].owner !== userData.user_id) {
        //     return NextResponse.json(
        //         { error: "Unauthorized - You are not the owner of this organizer", isSuccess: false },
        //         { status: 403 }
        //     );
        // }

        // Delete the event
        const deleteResult = await dbConnection.delete(events)
            .where(eq(events.event_id, eventId))
            .returning();
        
        if (deleteResult.length === 0) {
            return NextResponse.json(
                { error: "Failed to delete event", isSuccess: false },
                { status: 500 }
            );
        }

        projectutility.log("Event deleted:", deleteResult[0]);
        return NextResponse.json(
            { message: "Event deleted successfully", content: deleteResult[0], isSuccess: true },
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