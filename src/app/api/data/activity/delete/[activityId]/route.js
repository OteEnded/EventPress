import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { activities } from "@/database/schema";
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

        // Check if activity exists before attempting to delete
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

        // Delete the activity
        const deleteResult = await dbConnection
            .delete(activities)
            .where(eq(activities.activity_id, activityId))
            .returning();

        if (deleteResult.length === 0) {
            return NextResponse.json(
                { error: "Failed to delete activity", isSuccess: false },
                { status: 500 }
            );
        }

        projectutility.log("Activity deleted:", deleteResult);
        return NextResponse.json(
            { message: "Activity deleted successfully", content: deleteResult[0], isSuccess: true },
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