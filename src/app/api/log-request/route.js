import { prisma } from "../../../lib/prismaconnector";

export async function POST(req) {
    try {
        let requestLog;
        try {
            requestLog = await req.json();
        } catch (error) {
            console.error("API ERROR: Failed to parse JSON body", error);
            return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!requestLog || typeof requestLog !== "object") {
            return Response.json({ error: "Invalid request body" }, { status: 400 });
        }

        // ✅ Ensure required fields exist
        const requiredFields = ["request_from", "request_to", "request_protocol", "request_method"];
        for (const field of requiredFields) {
            if (!requestLog[field]) {
                console.error(`API ERROR: Missing field ${field}`);
                return Response.json({ error: `Missing field: ${field}` }, { status: 400 });
            }
        }

        // ✅ Fix JSON fields (Convert JSON strings to objects)
        const headers = typeof requestLog.request_header === "string"
            ? JSON.parse(requestLog.request_header)
            : requestLog.request_header;

        const body = typeof requestLog.request_body === "string"
            ? JSON.parse(requestLog.request_body)
            : requestLog.request_body;

        const cookies = typeof requestLog.cookies === "string"
            ? JSON.parse(requestLog.cookies)
            : requestLog.cookies;

        console.log("PRISMA INSERTING:", {
            request_from: requestLog.request_from,
            request_to: requestLog.request_to,
            request_protocol: requestLog.request_protocol,
            request_method: requestLog.request_method,
            request_header: headers,
            request_body: body,
            cookies: cookies,
        });

        // ✅ Insert into the correct model with proper JSON handling
        const log = await prisma.request_logs.create({
            data: {
                request_from: requestLog.request_from,
                request_to: requestLog.request_to,
                request_protocol: requestLog.request_protocol,
                request_method: requestLog.request_method,
                request_header: headers, // ✅ Ensure this is an object
                request_body: body, // ✅ Ensure this is an object
                cookies: cookies, // ✅ Ensure this is an object
            }
        });

        return Response.json({ success: true, log });
    } catch (error) {
        console.error("Log request failed:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
