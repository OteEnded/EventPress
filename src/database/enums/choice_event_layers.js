import { pgEnum } from "drizzle-orm/pg-core";

export const choiceEventLayers = pgEnum("choice_event_layers", [
    "EVENT",
    "BOOTH",
    "ACTIVITY",
    "ACTIVITY_SLOT",
]);
