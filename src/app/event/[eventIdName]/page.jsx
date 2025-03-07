

export default async function EventPage({ params }) {
    const param = await params;
    const event = await param.eventIdName;

    return (
        <div>
            <h1>{event}</h1>
            <p>Location: event_{event}_location</p>
            <p>Date: event_{event}_date</p>
        </div>
    );
}