import { pgEnum } from "drizzle-orm/pg-core";

export const choicePermissionTypes = pgEnum("choice_permission_types", [
    "READ_HEADER",
    "EDIT_HEADER",
    "READ_RECURRIVE",
    "EDIT_RECURRIVE",
    "READ_STAFF",
    "EDIT_STAFF",
]);
