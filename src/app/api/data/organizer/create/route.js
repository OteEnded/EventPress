import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { events, organizers, users } from "@/database/schema";
import { eq, or } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    try {
        // Authentication check
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", isSuccess: false },
                { status: 401 }
            );
        }

        const dbConnection = getConnection();
        
        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Organizer create request body:", request_body);
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
        // owner: uuid().notNull().references(() => users.user_id, { onDelete: "cascade" }),
        // name: text().notNull(),
        // description: text(),
        // website: text(),
        // email: text(),
        // phone_number: text(),
        // address: text(),
        const requiredFields = [
            "owner",
            "name",
            // "description",
            // "website",
            // "email",
            // "phone_number",
            // "address"
        ];
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }
        
        // Check if owner is a valid UUID
        if (!projectutility.isValidUUID(request_body.owner)) {
            console.error("API ERROR: Invalid user UUID");
            return NextResponse.json(
                { error: "Invalid user UUID" },
                { status: 400 }
            );
        }
        
        // Check if the user exists in the database
        const userExists = await dbConnection.select()
            .from(users)
            .where(eq(users.user_id, request_body.owner))
        if (userExists.length === 0) {
            console.error("API ERROR: User does not exist");
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 }
            );
        }
        
        // Insert the event into the database
        const organizerData = {
            owner: request_body.owner,
            name: request_body.name,
            description: request_body.description,
            website: request_body.website,
            email: request_body.email,
            phone_number: request_body.phone_number,
            address: request_body.address
        };
        
        const result = await dbConnection.insert(organizers).values(organizerData).returning();
        if (result.length === 0) {
            console.error("API ERROR: Failed to create organizer");
            return NextResponse.json(
                { error: "Failed to create organizer" },
                { status: 500 }
            );
        }
        
        projectutility.log("Event created:", result);
        return NextResponse.json(
            { message: "Organizer created successfully", content: result[0], isSuccess: true },
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
