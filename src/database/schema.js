import { users } from "./entities/users.js";
import { userProfiles } from "./entities/user_profiles.js";
import { userCredentials } from "./entities/user_credentials.js";
import { userSigninMethods, choiceSigninMethods } from "./entities/user_signin_methods.js";
import { requestLogs } from "./entities/request_logs.js";

// Define relationships
userProfiles.user = users;
users.profile = userProfiles;

userCredentials.user = users;
users.credentials = userCredentials;

userSigninMethods.user = users;
users.signinMethods = userSigninMethods;

export { choiceSigninMethods, users, userProfiles, userCredentials, userSigninMethods, requestLogs };
