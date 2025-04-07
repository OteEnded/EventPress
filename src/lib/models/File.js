import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { files } from "@/database/schema";
import { eq } from "drizzle-orm";

import path from "path";
import fs from "fs/promises";
import formidable from "formidable";

async function uploadFile(file) {
    const dbConnection = getConnection();
    const filePath = path.join(process.cwd(), "public", "uploads", file.file_id, file.name);
    const fileDir = path.dirname(filePath);

    try {
        await fs.mkdir(fileDir, { recursive: true });
        await fs.writeFile(filePath, file.data);
    } catch (error) {
        console.error("Error writing file:", error);
        throw error;
    }

    return await dbConnection.insert(files).values({
        name: file.name,
        type: file.type,
        file_name_extension: path.extname(file.name),
        size: file.size,
        description: file.description,
    }).returning();
}