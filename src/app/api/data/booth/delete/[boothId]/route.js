import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { booths } from "@/database/schema";
import { eq } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req, { params }) {
    
    const param = await params;
    
    const dbConnection = getConnection();

    try {
        // Authentication check
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", isSuccess: false },
                { status: 401 }
            );
        }

        const { boothId } = param;
        if (!projectutility.isValidUUID(boothId)) {
            console.error("API ERROR: Invalid booth ID");
            return NextResponse.json(
                { error: "Invalid booth ID" },
                { status: 400 }
            );
        }

        // Check if booth exists before attempting to delete
        const boothExists = await dbConnection
            .select({ booth_id: booths.booth_id })
            .from(booths)
            .where(eq(booths.booth_id, boothId));

        if (boothExists.length === 0) {
            return NextResponse.json(
                { error: "Booth not found", isSuccess: false },
                { status: 404 }
            );
        }

        // Delete the booth
        const deleteResult = await dbConnection
            .delete(booths)
            .where(eq(booths.booth_id, boothId))
            .returning();

        if (deleteResult.length === 0) {
            return NextResponse.json(
                { error: "Failed to delete booth", isSuccess: false },
                { status: 500 }
            );
        }

        projectutility.log("Booth deleted:", deleteResult);
        return NextResponse.json(
            { message: "Booth deleted successfully", content: deleteResult[0], isSuccess: true },
            { status: 200 }
        );

    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error", isSuccess: false },
            { status: 500 }
        );
    }
}