import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { users, userCredentials } from "@/database/schema";
import { eq, lt, gte, ne } from 'drizzle-orm';
import bcrypt from "bcryptjs";
import Auth from "@/lib/models/Auth";

export async function POST(req) {

    const dbConnection = getConnection();
    
    try {
        
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

        if (!request_body || typeof request_body !== "object") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        // Ensure required fields exist
        const requiredFields = [
            "indentity_email",
            "password",
            "firstname",
            "lastname",
            // "display_name",
            // "contact_email",
            // "phone_number",
            // "age"
        ];
        
        // const { email, password } = request_body;

        await Auth.registerAsOrganizer(request_body);

        return NextResponse.json({ message: "Registration successful." }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "An error occurred while registering.", error: error.message }, { status: 500 });
    }
}