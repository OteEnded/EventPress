import { NextResponse } from "next/server";
import Event from "@/lib/models/Event";
import Organizer from "@/lib/models/Organizer";
import projectutility from "@/lib/projectutility";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    
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
        } catch (error) {
            console.error("API ERROR: Failed to parse JSON body", error);
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }
        
        const requiredFields = ["organizer_id"];
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                return NextResponse.json(
                    { message: `${field} is required`, isSuccess: false },
                    { status: 400 }
                );
            }
        }
        
        let organizer = await Organizer.getOrganizerByOrganizerId(request_body.organizer_id);
        if (!organizer) {
            return NextResponse.json(
                { message: "Organizer not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        organizer = await organizer.expand()
        
        console.log("Organizer data:", organizer);

        return NextResponse.json(
            { message: "Organizer retrieved successfully", content: organizer, isSuccess: true },
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
