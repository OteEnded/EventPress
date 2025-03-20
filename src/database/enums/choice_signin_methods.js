import { pgEnum } from "drizzle-orm/pg-core";

export const choiceSigninMethods = pgEnum("choice_signin_methods", [
    "CREDENTIALS",
    "GOOGLE",
]);
