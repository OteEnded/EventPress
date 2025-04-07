import { NextResponse } from "next/server";
import projectutility from "@/lib/projectutility";
import Event from "@/lib/models/Event";
import Organizer from "@/lib/models/Organizer";
import User from "@/lib/models/User";

import Staff from "@/lib/models/Staff";

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
        
        const requiredFields = ["invitation_code"];
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { message: `Missing field ${field}`, isSuccess: false },
                    { status: 400 }
                );
            }
        }
        
        
        const staff = await Staff.getStaffByInvitationCode(request_body.invitation_code);
        if (staff.length === 0) {
            console.error("API ERROR: Staff not found", request_body.invitation_code);
            return NextResponse.json(
                { message: "Staff not found", isSuccess: false },
                { status: 404 }
            );
        }
        if (staff.length > 1) {
            console.error("API ERROR: Multiple staff found with the same invitation code", request_body.invitation_code);
            return NextResponse.json(
                { message: "Error: Multiple staff found with the same invitation code, Please contact support", isSuccess: false },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Event retrieved successfully", content: staff[0], isSuccess: true },
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
