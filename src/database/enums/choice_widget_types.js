import { pgEnum } from "drizzle-orm/pg-core";

export const choiceWidgetTypes = pgEnum("choice_widget_types", [
    "GALLERY",
    "INFORMATION",
    "CHILDREN",
    "TEXT",
]);
