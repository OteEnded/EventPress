import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import putil from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, userCredentials } from "@/database/schema";
import { eq, lt, gte, ne } from 'drizzle-orm';
import bcrypt from "bcryptjs";

const config = putil.getConfig(false);
if (!config["next_auth_secret"]) {
    throw new Error("NextAuth secret is not defined in the config file.");
}
const secret = config["next_auth_secret"] || "default-secret"; // Ensure a default secret is provided

const authOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {},
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
               
                const { email, password } = credentials;
                
                try {
                    
                    const dbConnection = getConnection();
                    const selectedUser = await dbConnection.select().from(users).where(eq(users.identity_email, email));
                    if (selectedUser.length > 1) {
                        console.error(`Multiple users found with the same email address. Email: ${email}`);
                        return null;
                    }
                    if (selectedUser.length === 0) {
                        console.error(`Cannot find the user with email: ${email}`);
                        return null;
                    }
                    const targetUser = selectedUser[0];
                    const targetUserCredential = (await dbConnection.select().from(userCredentials).where(eq(userCredentials.user_id, targetUser.user_id)))[0];
                    if (!targetUserCredential) {
                        console.error(`Cannot find the user credentials for user with email: ${email}`);
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, targetUserCredential.password_hash);
                    if (!passwordMatch) {
                        console.error(`Password does not match for user with email: ${email}`);
                        return null;
                    }

                    console.log("User authenticated:", targetUser);

                    return {email: targetUser.identity_email};

                }
                catch (error) {
                    console.error(error);
                    return null;
                }

            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: secret,
    pages: {
        signIn: "/organizer/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };