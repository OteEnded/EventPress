import projectutility from "@/lib/projectutility";
import { getConnection } from "@/lib/dbconnector";
import { users, organizers, events, booths, eventPages, eventPageWidgets, boothPages, boothPageWidgets, choiceWidgetTypes } from "@/database/schema";
import { eq, or, asc, desc, and } from "drizzle-orm";
import Organizer from "./Organizer";
import User from "./User";
import Staff from "./Staff";
import Event from "./Event";
import options from "@/ui/widgets/options";

async function createEventPage(eventId) {
    const dbConnection = getConnection();
    
    if (!eventId) {
        console.error("Event ID is required.");
        throw new Error("Event ID is required.");
    }
    
    if (!projectutility.isValidUUID(eventId)) {
        console.error("Invalid Event ID format.");
        throw new Error("Invalid Event ID format.");
    }
    
    const existingEventPage = await dbConnection
        .select()
        .from(eventPages)
        .where(eq(eventPages.event, eventId));
    if (existingEventPage.length > 0) {
        return existingEventPage[0];
    }
    
    const newEventPage = (await dbConnection
        .insert(eventPages)
        .values({
            event: eventId,
        })
        .returning())[0];
        
    // create 3 default widgets
    const defaultWidgets = [
        {
            event: eventId,
            widget_type: "INFORMATION",
            options: options.information.default
        },
        {
            event: eventId,
            widget_type: "TEXT",
            options: options.text.default
        },
        {
            event: eventId,
            widget_type: "CHILDREN",
            options: options.children.default
        },
    ];
    
    for (const widget of defaultWidgets) {
        await dbConnection
            .insert(eventPageWidgets)
            .values({
                event: widget.event,
                widget_type: widget.widget_type,
                options: widget.options,
            });
    }
    
    return newEventPage;
    
}

async function getPageOfEvent(eventIdName){
    const event = await Event.getEventByIdName(eventIdName);
    if (!event) {
        throw new Error("Event not found.");
    }
    
    
    const dbConnection = getConnection();
    
    console.log("Event ID:", event.event_id);
    
    const pageQueryResult = await createEventPage(event.event_id);
    
    console.log("Page Query Result:", pageQueryResult);
    if (!pageQueryResult) {
        console.error("Failed to create event page.");
        throw new Error("Failed to create event page.");
    }
    
    const result = pageQueryResult;
    result.event = event;
    
    // eventPageWidgets INFORMATION, TEXT, CHILDREN
    let eventPageWidgets_result = []
    // eventPageWidgets_result.push((await dbConnection
    //     .select()
    //     .from(eventPageWidgets)
    //     .where(
    //         and(
    //             eq(eventPageWidgets.event, event.event_id),
    //             eq(eventPageWidgets.widget_type, "INFORMATION")
    //         )
            
    //     ))[0]);
    // eventPageWidgets_result.push((await dbConnection
    //     .select()
    //     .from(eventPageWidgets)
    //     .where(
    //         and(
    //             eq(eventPageWidgets.event, event.event_id),
    //             eq(eventPageWidgets.widget_type, "TEXT")
    //         )
            
    //     ))[0]);
    // eventPageWidgets_result.push((await dbConnection
    //     .select()
    //     .from(eventPageWidgets)
    //     .where(
    //         and(
    //             eq(eventPageWidgets.event, event.event_id),
    //             eq(eventPageWidgets.widget_type, "CHILDREN")
    //         )
            
    //     ))[0]);
    
    for (const widgetType of ["INFORMATION", "TEXT", "CHILDREN"]) {
        const widget = await dbConnection.select()
            .from(eventPageWidgets)
            .where(
                and(
                    eq(eventPageWidgets.event, event.event_id),
                    eq(eventPageWidgets.widget_type, widgetType)
                )
            );
        if (widget.length > 0) {
            eventPageWidgets_result.push(widget[0]);
        }
        else {
            eventPageWidgets_result.push(
                (await dbConnection
                .insert(eventPageWidgets)
                .values({
                    event: event.event_id,
                    widget_type: widgetType,
                    options: options[widgetType.toLowerCase()].default
                })
                .returning())[0]
                );
        }
    }


        
    result.EventPageWidgets = eventPageWidgets_result;
    
    return result;
    
}

async function updateEventPage(req) {
    const dbConnection = getConnection();
    
    if (!req.event) {
        console.error("Event ID is required.");
        throw new Error("Event ID is required.");
    }
    
    if (!projectutility.isValidUUID(req.event)) {
        console.error("Invalid Event ID format.");
        throw new Error("Invalid Event ID format.");
    }
    
    const existingEventPage = await dbConnection
        .select()
        .from(eventPages)
        .where(eq(eventPages.event, req.event));
        
    if (existingEventPage.length === 0) {
        console.error("Event page not found.");
        throw new Error("Event page not found.");
    }
    
    const updatedEventPage = await dbConnection
        .update(eventPages)
        .set({
            ...req,
        })
        .where(eq(eventPages.event, req.event))
        .returning();
        
    return updatedEventPage;    
}

async function updateEventPageWidget(req) {
    
    const dbConnection = getConnection();
    
    if (!req.event_page_widget_id) {
        console.error("Event ID is required.");
        throw new Error("Event ID is required.");
    }
    
    if (!projectutility.isValidUUID(req.event_page_widget_id)) {
        console.error("Invalid Event ID format.");
        throw new Error("Invalid Event ID format.");
    }
    
    const existingEventPageWidget = await dbConnection
        .select()
        .from(eventPageWidgets)
        .where(eq(eventPageWidgets.event_page_widget_id, req.event_page_widget_id));
        
    if (existingEventPageWidget.length === 0) {
        console.error("Event page widget not found.");
        throw new Error("Event page widget not found.");
    }
    
    const updatedEventPageWidget = await dbConnection
        .update(eventPageWidgets)
        .set({
            options: req.option,
        })
        .where(eq(eventPageWidgets.event_page_widget_id, req.event_page_widget_id))
        .returning();
        
    return updatedEventPageWidget;
    
}


export default {
    getPageOfEvent,
    createEventPage,
    updateEventPage,
    updateEventPageWidget,

    
    
};
