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
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized access", isSuccess: false },
                { status: 401 }
            );
        }
        
        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Activity ID request body:", request_body);
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
        
        if (!request_body.activity_id) {
            console.error("API ERROR: Missing activity_id field");
            return NextResponse.json(
                { error: "Missing required field: activity_id" },
                { status: 400 }
            );
        }
        
        const { activity_id } = request_body;
        
        if (!projectutility.isValidUUID(activity_id)) {
            console.error("API ERROR: Invalid activity ID format");
            return NextResponse.json(
                { error: "Invalid activity ID format" },
                { status: 400 }
            );
        }
        
        // Fetch the activity data
        const activityData = await dbConnection
            .select()
            .from(activities)
            .where(eq(activities.activity_id, activity_id));
        
        if (activityData.length === 0) {
            return NextResponse.json(
                { message: "Activity not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        const activity = activityData[0];
        
        projectutility.log("Activity data:", activity);

        return NextResponse.json(
            { message: "Activity retrieved successfully", content: activity, isSuccess: true },
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