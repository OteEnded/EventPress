import { pgEnum } from "drizzle-orm/pg-core";

export const choiceFileTypes = pgEnum("choice_file_types", [
    "IMAGE",
    "VIDEO",
    "DOCUMENT",
    "AUDIO",
    "OTHER",
]);