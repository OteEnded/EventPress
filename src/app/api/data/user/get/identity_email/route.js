import { NextResponse } from "next/server";
import User from "@/lib/models/User";
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
        
        const requiredFields = ["identity_email"];
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { message: `Missing field ${field}`, isSuccess: false },
                    { status: 400 }
                );
            }
        }
        
        let user = await User.getUserByIdentityEmail(request_body.identity_email);
        if (!user) {
            return NextResponse.json(
                { message: "User not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        user = await user.expand();

        return NextResponse.json(
            { message: "User retrieved successfully", content: user, isSuccess: true },
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
