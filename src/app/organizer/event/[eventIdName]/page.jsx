

export default async function OrganizerEventManagePage({ params }) {
    
    const param = await params;
    const event = await param.eventIdName;
    
    if (event == "create") {
        // Create event page
        return <h1>Create Event</h1>;
    }
    
    return 
    <>
    </>;
}
