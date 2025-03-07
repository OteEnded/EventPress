import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { users } from "@/database/schema";
import { eq, lt, gte, ne } from 'drizzle-orm';
import bcrypt from "bcrypt";

export async function POST(req) {

    const dbConnection = getConnection();
    
    try {
        const { email, password } = await req.json();

        console.log(email, password);

        // drizzle-orm
        let usersInDB = await dbConnection.select().from(users).where(eq(users.identity_email, email));
        if (usersInDB.length > 1) {
            console.error(`Multiple users found with the same email address. Email: ${email}`);
            return NextResponse.json({ message: "Internal server error." }, { status: 500 });
        }
        if (usersInDB.length > 0) {
            return NextResponse.json({ message: "This email address is already registered." }, { status: 400 });
        }
        console.log(usersInDB);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // // Create the new user
        await dbConnection.insert(users).values({
            identity_email: email,
            identity_password: hashedPassword
        });

        usersInDB = await dbConnection.select().from(usersInDB).where(eq(users.identity_email, email));
        if (usersInDB.length > 1) {
            console.error(`Multiple users found with the same email address. Email: ${email}, Wonder if this may cause by race condition.`);
            return NextResponse.json({ message: "Internal server error." }, { status: 500 });
        }
        if (usersInDB.length === 0) {
            console.error(`Cannot find the user after registration. Email: ${email}`);
            return NextResponse.json({ message: "Internal server error." }, { status: 500 });
        }
        const newUser = usersInDB[0];

        console.log("New User:", newUser);

        return NextResponse.json({ message: "Registration successful." }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "An error occurred while registering.", error: error.message }, { status: 500 });
    }
}