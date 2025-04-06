import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { booths, activities } from "@/database/schema";
import { eq, and } from "drizzle-orm";
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
        
        console.log("Session:", session);
    
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized access", isSuccess: false },
                { status: 401 }
            );
        }
        
        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Booth id_name request body:", request_body);
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
        
        const requiredFields = ["booth_id_name", "event_id"];
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }
        
        const { booth_id_name, event_id } = request_body;
        
        // First try to get booth by booth_id (in case booth_id_name is a UUID)
        let booth = null;
        if (projectutility.isValidUUID(booth_id_name)) {
            const boothById = await dbConnection
                .select()
                .from(booths)
                .where(eq(booths.booth_id, booth_id_name));
                
            if (boothById.length > 0) {
                booth = boothById[0];
            }
        }
        
        // If not found by UUID, try by id_name and event_id (for scoped uniqueness)
        if (!booth) {
            const boothByIdName = await dbConnection
                .select()
                .from(booths)
                .where(
                    and(
                        eq(booths.id_name, booth_id_name),
                        eq(booths.event, event_id)
                    )
                );
                
            if (boothByIdName.length > 0) {
                booth = boothByIdName[0];
            }
        }
        
        if (!booth) {
            return NextResponse.json(
                { message: "Booth not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        // Fetch activities associated with the booth
        const activitiesList = await dbConnection
            .select()
            .from(activities)
            .where(eq(activities.booth, booth.booth_id));
        
        booth.Activities = activitiesList;
        
        projectutility.log("Booth data:", booth);

        return NextResponse.json(
            { message: "Booth retrieved successfully", content: booth, isSuccess: true },
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