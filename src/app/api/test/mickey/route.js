import { NextResponse } from "next/server";

import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import User from "@/lib/models/User";
import Organizer from "@/lib/models/Organizer";
import Event from "@/lib/models/Event";

export async function GET(req) {
    
    try {
        
        const user = await User.getUserByUserId("dc966575-5a90-4335-9926-729c671dca98")
        const x = await user.expand();
        
        console.log("Test API");
        console.log(x);
        
        
        return NextResponse.json(
            { message: "Test API", content: x },
            { status: 200 }
        );
        
        
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
