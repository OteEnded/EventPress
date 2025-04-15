import { NextResponse } from "next/server";
import { getConnection } from "@/lib/dbconnector";
import { eventAttendees, events } from "@/database/schema";
import { eq, and, lt, gt } from "drizzle-orm";
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
        
        //check api key from request header
        const apiKey = req.headers.get("api-key");
        if (!apiKey) {
            console.error("API ERROR: Missing API key in request header");
            return NextResponse.json(
                { error: "Missing API key" },
                { status: 401 }
            );
        }
        const apiKeyFromEnv = projectutility.getConfig(false)["api_key"];
        if (apiKey !== apiKeyFromEnv) {
            
            console.error("API ERROR: Invalid API key in request header");
            return NextResponse.json(
                { error: "Invalid API key" },
                { status: 401 }
            );
            
        }

        // Ensure required fields exist
        const requiredFields = []; // no required fields
        
        for (const field of requiredFields) {
            if (!request_body[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }
        
        const twoDayAhead = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        const today = new Date(Date.now());
        
        const upcomingEvents = await dbConnection.select().from(events).where(
            and(
                lt(events.start_date, twoDayAhead),
                gt(events.start_date, today)
            )
        );
        
        console.log("Upcoming events:", upcomingEvents);
        
        for (const event of upcomingEvents) {
            
            const attendees = await dbConnection
                .select()
                .from(eventAttendees)
                .where(
                    and(
                        eq(eventAttendees.event, event.event_id),
                    )
                );
            
            for (const attendee of attendees) {
            
                try {
                    const attendeeEmail = attendee.email;
                    const subject = `แจ้งเตือน: กิจกรรม ${event.name} กำลังจะเริ่มเร็วๆ นี้!`;
                    
                    // Format event date in Thai locale
                    const eventDate = event.start_date ? new Date(event.start_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                    }) : 'ไม่ระบุ';
                    
                    // Create HTML email body
                    const body = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>แจ้งเตือนกิจกรรมที่กำลังจะมาถึง</title>
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
                                    background-color: #FF9800;
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
                                    color: #FF9800;
                                    font-size: 22px;
                                    margin-bottom: 10px;
                                }
                                .reminder-box {
                                    background-color: #FFF3E0;
                                    border-left: 4px solid #FF9800;
                                    padding: 15px;
                                    margin: 20px 0;
                                    color: #E65100;
                                }
                                .event-details {
                                    background-color: #f1f5f9;
                                    padding: 15px;
                                    border-radius: 6px;
                                    margin: 20px 0;
                                }
                                .countdown {
                                    font-size: 20px;
                                    font-weight: bold;
                                    color: #FF5722;
                                    text-align: center;
                                    margin: 20px 0;
                                }
                                .info-label {
                                    font-weight: bold;
                                    color: #1e293b;
                                }
                                h1, h2, p {
                                    color: inherit;
                                }
                                .button {
                                    display: inline-block;
                                    background-color: #FF9800;
                                    color: #ffffff !important;
                                    padding: 12px 24px;
                                    text-decoration: none;
                                    border-radius: 6px;
                                    margin: 20px 0;
                                    font-weight: bold;
                                    text-align: center;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <h1 style="color: #ffffff;">แจ้งเตือนกิจกรรม</h1>
                            </div>
                            
                            <div class="content">
                                <h2>เรียน คุณ${attendee.firstname} ${attendee.lastname}</h2>
                                
                                <div class="reminder-box">
                                    <p>เราขอแจ้งให้ทราบว่ากิจกรรมที่คุณได้ลงทะเบียนไว้กำลังจะเริ่มในอีก 1-2 วัน</p>
                                </div>
                                
                                <div class="event-name">${event.name}</div>
                                
                                <div class="countdown">
                                    ใกล้ถึงวันกิจกรรมแล้ว!
                                </div>
                                
                                <div class="event-details">
                                    <p><span class="info-label">รายละเอียดกิจกรรม:</span></p>
                                    <ul>
                                        <li><span class="info-label">วันที่:</span> ${eventDate}</li>
                                        ${event.start_time ? `<li><span class="info-label">เวลาเริ่ม:</span> ${event.start_time}</li>` : ''}
                                        ${event.location ? `<li><span class="info-label">สถานที่:</span> ${event.location}</li>` : ''}
                                        ${event.description ? `<li><span class="info-label">รายละเอียด:</span> ${event.description}</li>` : ''}
                                    </ul>
                                </div>
                                
                                <p>หากคุณมีข้อสงสัยหรือต้องการข้อมูลเพิ่มเติม กรุณาติดต่อผู้จัดงานโดยตรง</p>
                                
                                ${event.contact_info ? `<p>ข้อมูลติดต่อผู้จัด: ${event.contact_info}</p>` : ''}
                            </div>
                            
                            <div class="footer">
                                <p>อีเมลนี้ถูกส่งอัตโนมัติเพื่อแจ้งเตือนกิจกรรมที่คุณลงทะเบียน</p>
                                <p>&copy; ${new Date().getFullYear()} EventPress - ระบบจัดการกิจกรรมมืออาชีพ</p>
                            </div>
                        </body>
                        </html>
                    `;
                    
                    await sendEmail(attendeeEmail, subject, body);
                    console.log("Reminder email sent to:", attendeeEmail);
                    
                } catch (emailError) {
                    // Don't fail the process if email sending fails
                    console.error("Failed to send reminder email:", emailError);
                }
            }
        }
        
        return NextResponse.json(
            { message: "Remainder emails sent.", content: "", isSuccess: true },
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
