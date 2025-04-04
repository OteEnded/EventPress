import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, userProfiles, userCredentials, userSigninMethods, choiceSigninMethods } from "@/database/schema";
import { eq, is } from "drizzle-orm";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";


async function registerAsOrganizer(req) {

    if (!req || typeof req !== "object") {
        console.error("API ERROR: Invalid request body", req);
        return { error: "Invalid request body" };
    }
    
    const dbConnection = getConnection();
    
    const requiredFields = [
        "indentity_email",
        "password",
        "firstname",
        "lastname",
        // "display_name",
        // "contact_email",
        // "phone_number",
        // "age",
    ];
    
    // Check if all required fields are present
    for (const field of requiredFields) {
        if (!req[field]) {
            console.error(`API ERROR: Missing required field: ${field}`, req);
            return { error: `Missing required field: ${field}` };
        }
    }
    
    // // Check if the email is valid
    // if (!projectutility.isValidEmail(req.indentity_email)) {
    //     console.error("API ERROR: Invalid email address", req.indentity_email);
    //     return { error: "Invalid email address" };
    // }
    
    // select user by email
    const usersInDB = dbConnection.select().from(users).where(eq(users.identity_email, req.indentity_email));
    if (usersInDB.length > 0) {
        console.error("API ERROR: This email address is already registered.", req.indentity_email);
        return { error: "This email address is already registered." };
    }
    
    // create user in users table
    // hash the password
    const hashedPassword = bcrypt.hashSync(req.password, 10);
    const newUser = (await dbConnection.insert(users).values({
        identity_email: req.indentity_email,
        identity_password: hashedPassword
    }).returning())[0];
    
    console.log("New user created:", newUser);
    
    // create user credentials in userCredentials table
    const newUserCredential = (await dbConnection.insert(userCredentials).values({
        user: newUser.user_id,
        password_hash: hashedPassword,
    }).returning())[0];
    
    console.log("New user credential created:", newUserCredential);

    // create user signin method in userSigninMethods table
    const newUserSigninMethod = (await dbConnection.insert(userSigninMethods).values({
        user: newUser.user_id,
        method: "CREDENTIALS",
    }).returning())[0];
    
    console.log("New user signin method created:", newUserSigninMethod);
    
    // create user profile in userProfiles table
    const newUserProfile = (await dbConnection.insert(userProfiles).values({
        user: newUser.user_id,
        firstname: req.firstname,
        lastname: req.lastname,
        display_name: req.display_name,
        contact_email: req.contact_email,
        phone_number: req.phone_number,
        age: req.age
    }).returning())[0];
    
    console.log("New user profile created:", newUserProfile);
    
    return {
        isSuccess: true,
        message: "User registered successfully.",
        content: await User.getUserByUserId(newUser.user_id),
    };
}

async function registerAsAttendee() {
    
}

async function login() {}

export default {
    registerAsOrganizer,
    registerAsAttendee,
    login
};