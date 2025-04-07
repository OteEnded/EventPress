import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/emailservice";
import { getConnection } from "@/lib/dbconnector";
import { events, organizers } from "@/database/schema";
import { eq, or, and, not } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import Events from "@/lib/models/Event";

export async function POST(req) {

    try {
        let request_body;
        try {
            request_body = await req.json();
        } catch (error) {
            console.error("API ERROR: Failed to parse JSON body", error, req);
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
        const requiredFields = ["staff_ticket_id"];
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }
        
        // Check if staff_ticket_id is a valid UUID
        if (!projectutility.isValidUUID(request_body.staff_ticket_id)) {
            console.error("API ERROR: Invalid staff_ticket_id UUID");
            return NextResponse.json(
                { error: "Invalid staff_ticket_id UUID" },
                { status: 400 }
            );
        }

        const x = await sendEmail(email, "", "<></>");

        console.log("Email sent successfully:", x);

        projectutility.log("Staff invite send Email:", result);
        return NextResponse.json(
            {
                message: "Staff invite send Email successfully sent",
                content: result[0],
                isSuccess: true,
            },
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
