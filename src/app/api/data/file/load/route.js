import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { createReadStream, existsSync } from "fs";
import { eq } from "drizzle-orm";
import File from "@/lib/models/File";

export async function GET(req) {
  try {
    // Get file ID from the query parameters
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { isSuccess: false, error: "File ID is required" },
        { status: 400 }
      );
    }

    // Get file info from the database
    let fileInfo;
    try {
      fileInfo = await File.getFileByFileId(fileId);
    }
    catch (error) {
      console.error("Error fetching file info:", error);
      return NextResponse.json(
        { isSuccess: false, error: "Database error" },
        { status: 500 }
      );
    }

    if (!fileInfo) {
      return NextResponse.json(
        { isSuccess: false, error: "File not found" },
        { status: 404 }
      );
    }

    // Construct the file path
    const fileName = `${fileId}${fileInfo.file_name_extension}`;
    const filePath = path.join(process.cwd(), "uploads", fileName);

    // Check if the file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { isSuccess: false, message: "File does not exist on disk" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);
    
    // Create a new Response with the file content
    const response = new NextResponse(fileBuffer);
    
    // Set appropriate content type and other headers
    response.headers.set("Content-Type", fileInfo.type || "application/octet-stream");
    response.headers.set("Content-Disposition", `inline; filename="${fileInfo.name}"`);
    
    return response;
  } catch (error) {
    console.error("Error loading file:", error);
    return NextResponse.json(
      { isSuccess: false, error: "Server error during file loading" },
      { status: 500 }
    );
  }
}