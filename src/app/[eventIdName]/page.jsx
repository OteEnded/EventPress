import Event from "@/lib/models/Event";

import EventPageBuilder from "@/ui/pages/event";

export default async function EventPage({ params }) {
    const param = await params;
    const event = await param.eventIdName;
    
    console.log("Event ID Name:", event);
    
    const eventData = await Event.getEventByIdName(event);
    console.log("Event data:", eventData);
    if (!eventData) {
        return <div>Event not found</div>;
    }

    return (
        <EventPageBuilder event={eventData} /> // Pass the eventIdName prop to EventPage component
    );
}