import { getDB } from "../../lib/dbconnector.js";
import { users } from "../entities/users.js";

async function seed() {
    const db = getDB();

    console.log("🌱 Seeding database...");

    await db.insert(users).values([
        { identity_email: "admin@example.com" },
        { identity_email: "user@example.com" }
    ]);

    console.log("✅ Seeding complete!");
    process.exit();
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
