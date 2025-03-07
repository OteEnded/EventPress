import { NextResponse } from "next/server";

export async function POST(req) {
  const { theme } = await req.json();

  // Create a new response and set the theme cookie
  const res = NextResponse.json({ message: "Theme updated" });
  res.cookies.set("theme", theme, {
    httpOnly: false, // Allow JavaScript access
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  return res;
}
