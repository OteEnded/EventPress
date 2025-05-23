import { NextResponse } from "next/server";

import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import User from "@/lib/models/User";
import Organizer from "@/lib/models/Organizer";
import Event from "@/lib/models/Event";

export async function GET(req) {
    
    const dbConnection = await getConnection();
    const { searchParams } = new URL(req.url);
    
    try {
        
        const x = await (await User.getUserByUserId("dc966575-5a90-4335-9926-729c671dca98")).expand();
        // const x = await Organizer.getOrganizersByOwnerUserId("dc966575-5a90-4335-9926-729c671dca98");
        
        console.log("Test API");
        console.log(x);
        
        
        return NextResponse.json(
            { message: "Test API", isSussess: true, content: x },
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
