import { choiceSigninMethods } from "./enums/choice_signin_methods.js";
import { choicePermissionTypes } from "./enums/choice_permission_types.js";
import { choiceEventLayers } from "./enums/choice_event_layers.js";

import { users } from "./entities/users.js";
import { userProfiles } from "./entities/user_profiles.js";
import { userCredentials } from "./entities/user_credentials.js";
import { userSigninMethods } from "./entities/user_signin_methods.js";
import { requestLogs } from "./entities/request_logs.js";

// Define relationships
userProfiles.user = users;
users.profile = userProfiles;

userCredentials.user = users;
users.credentials = userCredentials;

userSigninMethods.user = users;
users.signinMethods = userSigninMethods;

export { choiceSigninMethods, choicePermissionTypes, choiceEventLayers, users, userProfiles, userCredentials, userSigninMethods, requestLogs };
