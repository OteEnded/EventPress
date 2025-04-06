import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, userProfiles, userCredentials, userSigninMethods, systemAdmins } from "@/database/schema";
import { eq } from "drizzle-orm";
import Organizer from "./Organizer";

/**
 * @description This function is used to get the user by user id.
 * @param {string} userId - The user id.
 * @returns {object} - The user object.
*/
async function getUserByUserId(userId) {
    const dbConnection = getConnection();
    
    if (!userId) {
        throw new Error("User ID is required.");
    }
    
    if (!projectutility.isValidUUID(userId)) {
        // console.error("Invalid User ID format.", userId);
        throw new Error(`Invalid User ID format. Found ${userId} as user_id.`);
    }
    
    const userQueryResult = await dbConnection.select().from(users).where(eq(users.user_id, userId));
    if (userQueryResult.length === 0) {
        return null;
    }
    
    let userSystemAdmin = null;
    const systemAdminQueryResult = await dbConnection.select().from(systemAdmins).where(eq(systemAdmins.user, userId));
    if (systemAdminQueryResult.length > 0) {
        userSystemAdmin = systemAdminQueryResult[0];
    }
    
    return {
        ...userQueryResult[0],
        UserProfile: await getUserProfileByUserId(userId),
        SystemAdmin: userSystemAdmin,
        expand: async function() {
            return await expandUser(this.user_id);
        }
    };
}

async function expandUser(user) {
    if (!user) {
        return null;
    }
    
    // check if user is object or string
    if (typeof user === "string") {
        // chech if user is valid uuid
        if (!projectutility.isValidUUID(user)) {
            return null;
        }
        return expandUser({user_id: user});
    }
    else if (typeof user !== "object") {
        return null;
    }
    
    if (!user.user_id) {
        throw new Error("User ID is required. Didn't find user_id in the user object.");
    }
    
    if (!projectutility.isValidUUID(user.user_id)) {
        throw new Error(`Invalid User ID format. Found ${user.user_id} as user_id in the user object.`);
    }

    const userQueryResult = await getUserByUserId(user.user_id);
    if (!userQueryResult) {
        return null;
    }
    
    const expandedUser = {
        ...(await getUserByUserId(user.user_id)),
        Organizers: (await Organizer.getOrganizersByOwnerUserId(user.user_id)) || [],
    };
    
    return expandedUser;
}

/**
 * @description This function is used to get the user by identity email.
 * @param {string} identityEmail - The identity email.
 * @returns {object} - The user object.
*/
async function getUserByIdentityEmail(identityEmail) {
    const dbConnection = getConnection();
    
    const user = await dbConnection.select({user_id: users.user_id}).from(users).where(eq(users.identity_email, identityEmail));
    if (user.length === 0) {
        return null;
    }
    return await getUserByUserId(user[0].user_id);
}

async function getUserProfileByUserId(userId) {
    const dbConnection = getConnection();
    
    const userProfileQueryResult = await dbConnection.select().from(userProfiles).where(eq(userProfiles.user, userId));
    if (userProfileQueryResult.length === 0) {
        return null;
    }
    return userProfileQueryResult[0];
}


export default {
    getUserByUserId,
    getUserByIdentityEmail,
}