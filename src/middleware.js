import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getConfig } from "@/lib/projectutility"
// import { checkIfEventExists } from "@/lib/eventService"; // Function to check event existence

export async function middleware(req) {
    
    // Get the first segment of the URL path
    const urlPath = req.nextUrl.pathname.split("/"); // Get first segment

    // console.log("MIDDLEWARE: " + JSON.stringify(req.cookies.getAll()));
    // console.log("MIDDLEWARE: " + getConfig(false));

    if (
        (urlPath[1] != "api" && urlPath[2] != "log-request") && 
        urlPath[1] != "_next" && 
        urlPath[1] != "favicon.ico" && 
        (getConfig(false))["is_log_request"]
        // && false
        // || true
    ) {
        const logData = {
            request_from: req.headers.get("x-forwarded-for") || req.ip || "Unknown",
            request_to: req.nextUrl.pathname, // Use pathname instead of full URL
            request_protocol: req.headers.get("x-forwarded-proto") || "https",
            request_method: req.method,
            request_header: JSON.stringify(Object.fromEntries(req.headers.entries())), // Convert headers to JSON
            request_body:  JSON.stringify({}), //Object.fromEntries(req.bodies.entries())), // Convert headers to JSON
            cookies: JSON.stringify(req.cookies.getAll() || {}), // Convert cookies safely
        };
        
        // console.log("MIDDLEWARE: " + JSON.stringify(logData));

        // ✅ Ensure fetch request sends a valid JSON object
        fetch(`${req.nextUrl.origin}/api/log-request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logData),
        }).catch((err) => console.error("Log request failed:", err));
    }

    const staticBaseRoutes = [
        "api",
        "organizer",
        "_next",
        "favicon.ico",
        "manifest.json",
        "robots.txt",
        "sitemap.xml",
        "service-worker.js",
        "sw.js",
        "workbox-.*",
        "assets",
        "event",
        "events",
        "organizers",
        "login",
        "logout",
        "register",
        "set-theme",
        "theme",
        ""
    ];
    const isStaticBaseRoute = staticBaseRoutes.includes(urlPath[1]);

    // Check if event exists in the database but if urlPath[1] is in staticBaseRoutes, just return false
    const isEvent = isStaticBaseRoute ? false : true; // await checkIfEventExists(urlPath[1]);

    if (!isStaticBaseRoute && isEvent) {
        const newPath = req.nextUrl.pathname.replace(
            `/${urlPath[1]}`,
            `/event/${urlPath[1]}`
        );
        console.log("MIDDLEWARE: " + newPath);
        return NextResponse.rewrite(new URL(newPath, req.url));
    }

    // console.log("MIDDLEWARE: " + req.cookies);
    // console.log(req.cookies.get("theme")?.value);
    const theme = req.cookies.get("theme")?.value || "dark";
    const res = NextResponse.next();
    res.headers.set("X-Theme", theme);
    return res;
}

// Apply middleware to all routes
export const config = {
    matcher: "/:path*",
};
