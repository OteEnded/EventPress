import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import File from "@/lib/models/File";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Get file from form data
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json(
        { isSuccess: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Get description if provided
    const description = formData.get("description") || "";

    let fileInDatabase = null;

    try {
      // Create a temp filename with original extension
      const originalName = file.name;
      const ext = path.extname(originalName);
      
      // Define the uploads folder path
      const uploadDir = path.join(process.cwd(), "uploads");
      // Ensure the uploads directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Convert the file to a buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create file entry in database
      fileInDatabase = await File.createFile({
        name: originalName,
        type: file.type,
        file_name_extension: ext,
        size: file.size.toString(),
        description: description,
      });

      const fileId = fileInDatabase.file_id;
      const newFileName = `${fileId}${ext}`;
      const filePath = path.join(uploadDir, newFileName);
      
      // Write file to disk
      await writeFile(filePath, buffer);

      return NextResponse.json({ 
        isSuccess: true, 
        content: fileInDatabase
      });
    } catch (error) {
      // Revert the file creation in the database if needed
      if (fileInDatabase) {
        await File.deleteFile(fileInDatabase.file_id);
      }

      console.error("Upload error:", error);
      return NextResponse.json(
        { isSuccess: false, error: "Server error during file upload" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Form parsing error:", error);
    return NextResponse.json(
      { isSuccess: false, error: "Error parsing form data" },
      { status: 500 }
    );
  }
}
