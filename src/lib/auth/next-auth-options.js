import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getConnection } from "@/lib/dbconnector";
import { users, userCredentials } from "@/database/schema";
import { eq } from 'drizzle-orm';
import bcrypt from "bcryptjs";
import projectutility from "@/lib/projectutility";
import Auth from "@/lib/models/Auth";


const config = projectutility.getConfig(false);
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
            async authorize(req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
               
                return await Auth.login(req)

            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: secret,
    // pages: {
    //     signIn: "/organizer/login",
    // },
};

export default authOptions;
export { authOptions };