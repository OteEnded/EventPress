import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { files } from "@/database/schema";
import { eq } from "drizzle-orm";

import path from "path";
import fs from "fs/promises";
import formidable from "formidable";

async function createFile(req){
    
    const dbConnection = getConnection();
    
    const result = await dbConnection.insert(files).values({
        name: req.name,
        type: req.type,
        file_name_extension: req.file_name_extension,
        size: req.size,
        description: req.description
    }).returning();
    
    return result[0];
    
}

async function deleteFile(fileId) {
    const dbConnection = getConnection();
    const result = (await dbConnection.delete(files).where(eq(files.file_id, fileId)).returning())[0];
    if (!result) {
        throw new Error(`File with ID ${fileId} not found or failed to delete.`);
    }
    
    // file deteleted from database, now delete the file from the filesystem
    const uploadDir = path.join(process.cwd(), "uploads");
    
    return result;
}

async function getFileByFileId(fileId) {
    const dbConnection = getConnection();
    const result = await dbConnection.select().from(files).where(eq(files.file_id, fileId));
    
    if (!result) {
        throw new Error(`File with ID ${fileId} not found.`);
    }
    
    return result[0];
}

export default {
    createFile,
    deleteFile,
    getFileByFileId,
}