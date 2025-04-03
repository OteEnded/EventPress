import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, userProfiles, userCredentials, userSigninMethods } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";


function registerAsOrganizer(req) {
    const dbConnection = getConnection();
    
    const requiredFields = [
        "email",
        "password",
        "first_name",
        "last_name",
        "phone_number",
        "company_name",
        "company_address",
        "company_registration_number"
    ];
    
}

function registerAsAttendee() {
    
}

function login() {}