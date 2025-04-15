import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { eventAttendees } from "@/database/schema";
import { eq } from "drizzle-orm";
import projectutility from "@/lib/projectutility";
import Event from "@/lib/models/Event";
import { sendEmail } from "@/lib/emailservice";

/* res template
{ message: "", content: {}, isSuccess: true }
*/

export async function POST(req) {
    try {
        // No authentication check for public attendance registration
        
        const dbConnection = getConnection();
        
        let request_body;
        try {
            request_body = await req.json();
            projectutility.log("Attendee create request body:", request_body);
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
            "event",
            "firstname",
            "lastname",
            "email",
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
        
        const event = await Event.getEventByIdName(
            request_body.event
        );
        if (!event) {
            return NextResponse.json(
                { error: "Event not found", isSuccess: false },
                { status: 404 }
            );
        }
        
        const newAttendee = {
            event: event.event_id, // Using event_id as per your db schema
            firstname: request_body.firstname,
            lastname: request_body.lastname,
            email: request_body.email,
        };
        
        const result = await dbConnection.insert(eventAttendees).values(newAttendee).returning();
        if (result.length === 0) {
            return NextResponse.json(
                { error: "Failed to create attendee", isSuccess: false },
                { status: 500 }
            );
        }
        
        // Send a confirmation email here
        try {
            const attendeeEmail = request_body.email;
            const subject = `ยืนยันการลงทะเบียนเข้าร่วมกิจกรรม ${event.name}`;
            
            // Create HTML email body
            const body = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ยืนยันการลงทะเบียน</title>
                    <style>
                        body {
                            font-family: 'Prompt', 'Helvetica Neue', Arial, sans-serif;
                            line-height: 1.6;
                            color: #333333;
                            background-color: #ffffff;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #5E9BD6;
                            padding: 20px;
                            color: #ffffff;
                            border-radius: 8px 8px 0 0;
                            text-align: center;
                        }
                        .content {
                            background-color: #f8fafc;
                            padding: 30px;
                            border-left: 1px solid #e2e8f0;
                            border-right: 1px solid #e2e8f0;
                            color: #1e293b;
                        }
                        .footer {
                            background-color: #f1f5f9;
                            padding: 15px;
                            color: #475569;
                            font-size: 14px;
                            text-align: center;
                            border-radius: 0 0 8px 8px;
                            border: 1px solid #e2e8f0;
                        }
                        .event-name {
                            font-weight: bold;
                            color: #5E9BD6;
                            font-size: 18px;
                        }
                        .success-box {
                            background-color: #dcfce7;
                            border-left: 4px solid #22c55e;
                            padding: 15px;
                            margin: 20px 0;
                            color: #166534;
                        }
                        .event-details {
                            background-color: #f1f5f9;
                            padding: 15px;
                            border-radius: 6px;
                            margin: 20px 0;
                        }
                        .attendee-info {
                            margin-top: 20px;
                            padding-top: 20px;
                            border-top: 1px dashed #cbd5e1;
                        }
                        h1, h2, p {
                            color: inherit;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="color: #ffffff;">ยืนยันการลงทะเบียนเข้าร่วมกิจกรรม</h1>
                    </div>
                    
                    <div class="content">
                        <h2>เรียน คุณ${request_body.firstname} ${request_body.lastname}</h2>
                        
                        <div class="success-box">
                            <p>การลงทะเบียนเข้าร่วมกิจกรรมของคุณสำเร็จแล้ว</p>
                        </div>
                        
                        <p>คุณได้ลงทะเบียนเข้าร่วมกิจกรรม: <span class="event-name">${event.name}</span></p>
                        
                        <div class="event-details">
                            <p><strong>รายละเอียดกิจกรรม:</strong></p>
                            <ul>
                                <li><strong>ชื่อกิจกรรม:</strong> ${event.name}</li>
                                ${event.description ? `<li><strong>รายละเอียด:</strong> ${event.description}</li>` : ''}
                                ${event.location ? `<li><strong>สถานที่:</strong> ${event.location}</li>` : ''}
                                ${event.start_date ? `<li><strong>วันที่:</strong> ${new Date(event.start_date).toLocaleDateString('th-TH')}</li>` : ''}
                                ${event.start_time ? `<li><strong>เวลาเริ่ม:</strong> ${event.start_time}</li>` : ''}
                            </ul>
                        </div>
                        
                        <div class="attendee-info">
                            <p><strong>ข้อมูลผู้ลงทะเบียน:</strong></p>
                            <ul>
                                <li>ชื่อ: ${request_body.firstname} ${request_body.lastname}</li>
                                <li>อีเมล: ${request_body.email}</li>
                            </ul>
                        </div>
                        
                        <p>อีเมลนี้ใช้สำหรับยืนยันการเข้าร่วมกิจกรรมและแจ้งเตือนเมื่อใกล้ถึงเวลากิจกรรม เราจะไม่ส่งโฆษณาหรือขายข้อมูลอีเมลของคุณให้กับบริษัทอื่น</p>
                        
                        <p>หากคุณมีข้อสงสัยใดๆ เกี่ยวกับกิจกรรม กรุณาติดต่อผู้จัดงานโดยตรง</p>
                    </div>
                    
                    <div class="footer">
                        <p>ขอบคุณที่ลงทะเบียนเข้าร่วมกิจกรรมกับเรา</p>
                        <p>&copy; ${new Date().getFullYear()} EventPress - ระบบจัดการกิจกรรมมืออาชีพ</p>
                    </div>
                </body>
                </html>
            `;
            
            await sendEmail(attendeeEmail, subject, body);
            console.log("Confirmation email sent to:", attendeeEmail);
            
        } catch (emailError) {
            // Don't fail the registration if email sending fails
            console.error("Failed to send confirmation email:", emailError);
        }
        
        return NextResponse.json(
            { message: "Attendee registered successfully", content: result[0], isSuccess: true },
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
