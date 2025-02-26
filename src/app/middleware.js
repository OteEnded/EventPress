import { NextResponse } from "next/server";

export async function middleware(req) {
    const urlPath = req.nextUrl.pathname.split("/")[1]; // Get first segment

    // Allow "/organizer" to load as normal
    if (urlPath === "organizer") {
        return NextResponse.next();
    }

    // Get theme from cookies (default to "light" if not set)
    const theme = req.cookies.get("theme")?.value || "light";

    // Create a response and pass the theme as a header
    const res = NextResponse.next();
    res.headers.set("X-Theme", theme);

    return res;
}

// Apply middleware to all routes
export const config = {
    matcher: "/:path*",
};
