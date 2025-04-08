import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { users, userProfiles } from "@/database/schema";
import { eq } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";
import User from "@/lib/models/User";


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
        
        const dbConnection = getConnection();
        
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
        
        const requiredFields = ["user"];
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                return NextResponse.json(
                    { message: `${field} is required`, isSuccess: false },
                    { status: 400 }
                );
            }
        }
        
        const user = await User.getUserByUserId(request_body.user);
        if (!user) {
            return NextResponse.json(
                { message: "User not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        
        const updateResult = await dbConnection
            .update(userProfiles)
            .set({ ...request_body })
            .where(eq(userProfiles.user, user.user_id));
        

        return NextResponse.json(
            { message: "User retrieved successfully", content: updateResult, isSuccess: true },
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
