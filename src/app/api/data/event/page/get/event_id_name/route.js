import { NextResponse } from "next/server";
import projectutility from "@/lib/projectutility";
import Event from "@/lib/models/Event";
import Organizer from "@/lib/models/Organizer";
import User from "@/lib/models/User";
import Page from "@/lib/models/Page";

import { getConnection } from "@/lib/dbconnector";
import { events, organizers, users } from "@/database/schema";
import { eq } from "drizzle-orm";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    
    try {
        
        const session = await getServerSession(authOptions);
        
        console.log("Session:", session);
    
        if (!session || !session.user) {
            console.error("API ERROR: Unauthorized access", session);
            return NextResponse.json(
                { message: "Unauthorized access", isSuccess: false },
                { status: 401 }
            );
        }
        
        const currentUser = await User.getUserByIdentityEmail(session.user.email);
        if (!currentUser) {
            console.error("API ERROR: Unauthorized access, user not found", session.user.email);
            return NextResponse.json(
                { message: "Unauthorized access, user not found", isSuccess: false },

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
        
        const requiredFields = ["event_id_name"];
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing required field: ${field}`);
                return NextResponse.json(
                    { message: `Missing required field: ${field}`, isSuccess: false },
                    { status: 400 }
                );
            }
        }
        
        const page = await Page.getPageOfEvent(request_body.event_id_name);
        if (!page) {
            console.error("API ERROR: Event not found", request_body.event_id_name);
            return NextResponse.json(
                { message: "Event not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        console.log("Event data:", page);

        return NextResponse.json(
            { message: "Event page retrieved successfully", content: page, isSuccess: true },
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
