import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";
import User from "@/lib/models/User";
import Organizer from "@/lib/models/Organizer";

export async function POST(req, { params }) {
    try {
        
        const param = await params;
        
        const { organizerId } = param;
        
        // Check if user is authenticated and is SystemAdmin
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ 
                isSuccess: false, 
                message: "Unauthorized: Please log in" 
            }, { status: 401 });
        }
        
        // Get user data from session
        const user = await User.getUserByIdentityEmail(session.user.email);
        
        if (!user) {
            return NextResponse.json({ 
                isSuccess: false, 
                message: "User not found" 
            }, { status: 404 });
        }
        
        // Check if user is SystemAdmin
        if (!user.SystemAdmin) {
            return NextResponse.json({ 
                isSuccess: false, 
                message: "Unauthorized: Only SystemAdmin can approve organizers" 
            }, { status: 403 });
        }
        
        // Update organizer approval status
        const updatedOrganizer = await Organizer.approveOrganizer(organizerId, user.user_id);
        
        if (!updatedOrganizer) {
            return NextResponse.json({ 
                isSuccess: false, 
                message: "Failed to approve organizer" 
            }, { status: 500 });
        }
        
        return NextResponse.json({ 
            isSuccess: true, 
            message: "Organizer approved successfully",
            content: updatedOrganizer
        });
        
    } catch (error) {
        console.error("Error in organizer approval endpoint:", error);
        return NextResponse.json({ 
            isSuccess: false, 
            message: `Error in organizer approval: ${error.message}` 
        }, { status: 500 });
    }
}