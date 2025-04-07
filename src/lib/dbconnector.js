import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import putil from "./projectutility.js";
import * as models from "@/database/schema.js"; // Import all models

var db = null;

export function getConnection() {
    if (!db) {
        putil.log("dbconnector[getConnection]: Initializing Drizzle ORM...");

        const dbConfig = putil.getDBConnectionConfig();
        const pool = new Pool({
            host: dbConfig["host"],
            port: dbConfig["port"] || 5432,
            user: dbConfig["user"],
            password: dbConfig["password"],
            database: dbConfig["database"],
            ssl: false
        });

        db = drizzle(pool);
        putil.log("dbconnector[getConnection]: Drizzle ORM connected successfully!");
    }
    return db;
}
