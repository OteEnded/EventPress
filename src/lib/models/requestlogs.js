import { prisma } from "../prismaconnector";

export async function createRequestLog(requestLog) {
    return await prisma.request_logs.create({
        data: requestLog,
    });
}

export async function logRequest(req) {
    const createRecordRequest = {
        request_from: req.headers.get("x-forwarded-for") || req.ip || "Unknown",
        request_to: req.nextUrl.pathname, // Use pathname instead of full URL to avoid long data
        request_protocol: req.headers.get("x-forwarded-proto") || "https", // Edge functions don’t have `req.protocol`
        request_method: req.method,
        request_headers: JSON.stringify(Object.fromEntries(req.headers.entries())), // Convert headers to JSON
        request_body: null, // Middleware cannot read body; set this for API logs later
        cookies: JSON.stringify(req.cookies.getAll() || {}), // Convert cookies safely
    };
    return await createRequestLog(createRecordRequest);
}