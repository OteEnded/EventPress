import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { users, userCredentials } from "@/database/schema";
import { eq, lt, gte, ne } from 'drizzle-orm';
import bcrypt from "bcryptjs";

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
            "first_name",
            "last_name",
            // "display_name",
            // "contact_email",
            // "phone_number",
            // "age"
        ];
        
        // const { email, password } = request_body;

        console.log(request_body.indentity_email, request_body.password);

        // drizzle-orm
        let usersInDB = await dbConnection.select().from(users).where(eq(users.identity_email, request_body.indentity_email));
        if (usersInDB.length > 1) {
            console.error(`Multiple users found with the same email address. Email: ${request_body.indentity_email}`);
            return NextResponse.json({ message: "Internal server error." }, { status: 500 });
        }
        if (usersInDB.length > 0) {
            return NextResponse.json({ message: "This email address is already registered." }, { status: 400 });
        }
        console.log(usersInDB);

        // Hash the password
        const hashedPassword = await bcrypt.hash(request_body.password, 10);

        // // Create the new user
        const newUser = (await dbConnection.insert(users).values({
            identity_email: request_body.indentity_email,
            identity_password: hashedPassword
        }).returning())[0];

        usersInDB = await dbConnection.select().from(users).where(eq(users.identity_email, request_body.indentity_email));
        if (usersInDB.length > 1) {
            console.error(`Multiple users found with the same email address. Email: ${request_body.indentity_email}, Wonder if this may cause by race condition.`);
            return NextResponse.json({ message: "Internal server error." }, { status: 500 });
        }
        if (usersInDB.length === 0) {
            console.error(`Cannot find the user after registration. Email: ${request_body.indentity_email}`);
            return NextResponse.json({ message: "Internal server error." }, { status: 500 });
        }
        // const newUser = usersInDB[0];

        console.log("New User:", newUser);

        // Create the user credentials
        const newUserCredentials = (await dbConnection.insert(userCredentials).values({
            user_id: newUser.user_id,
            password_hash: hashedPassword
        }).returning())[0];

        console.log("New User Credentials:", newUserCredentials);

        return NextResponse.json({ message: "Registration successful." }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "An error occurred while registering.", error: error.message }, { status: 500 });
    }
}