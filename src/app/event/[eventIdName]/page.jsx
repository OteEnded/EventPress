

export default async function EventPage({ params }) {
    const event = params.eventIdName;

    return (
        <div>
            <h1>{event}</h1>
            <p>Location: event_{event}_location</p>
            <p>Date: event_{event}_date</p>
        </div>
    );
}