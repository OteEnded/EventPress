import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import projectutility from "@/lib/projectutility";
import { getSession } from "next-auth/react";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    
    try {
        
        const session = await getSession({ req });
    
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
        
        const requiredFields = ["user_id"];
        
        const user = await User.getUserByUserId(request_body.user_id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found", isSuccess: false },
                { status: 404 }
            );
        }

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
