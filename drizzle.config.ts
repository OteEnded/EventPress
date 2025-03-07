import { defineConfig } from "drizzle-kit";

import putil from "@/lib/projectutility.js";

const dbConnectionConfig = putil.getDBConnectionConfig();

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/database/schema.js",
    out: "./drizzle/migrations",
    dbCredentials: {
        host: dbConnectionConfig["host"],
        port: dbConnectionConfig["port"] || 5432,
        user: dbConnectionConfig["user"],
        password: dbConnectionConfig["password"],
        database: dbConnectionConfig["database"],
        ssl: false
    },
});
