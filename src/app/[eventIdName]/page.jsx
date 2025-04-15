import Event from "@/lib/models/Event";
import EventPageBuilder from "@/ui/pages/event";
import Link from "next/link";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const eventIdName = params.eventIdName;
    const eventData = await Event.getEventByIdName(eventIdName);
    
    // If event doesn't exist or isn't published, return minimal metadata
    if (!eventData || !eventData.published) {
        return {
            title: 'Event Not Found',
            description: 'The event you are looking for does not exist or is not published yet.'
        };
    }
    
    // Default image path - replace with your default event image if needed
    let imageUrl = '/images/default-event-banner.jpg';
    
    // If event has a banner, use it
    if (eventData.banner) {
        imageUrl = `/api/data/file/load?id=${eventData.banner}`;
    }
    
    return {
        title: eventData.name,
        description: eventData.description || `Join us at ${eventData.name}`,
        openGraph: {
            title: eventData.name,
            description: eventData.description || `Join us at ${eventData.name}`,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: eventData.name,
                }
            ],
            locale: 'th_TH',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: eventData.name,
            description: eventData.description || `Join us at ${eventData.name}`,
            images: [imageUrl],
        },
    };
}

export default async function EventPage({ params }) {
    const param = await params;
    const event = await param.eventIdName;
    
    console.log("Event ID Name:", event);
    
    const eventData = await Event.getEventByIdName(event);
    console.log("Event data:", eventData);
    
    // Check if event exists
    if (!eventData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] dark:bg-gray-900 px-4 py-16">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900 flex items-center justify-center rounded-full mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">อีเวนต์ไม่พบ</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        ไม่พบอีเวนต์ที่คุณกำลังค้นหา โปรดตรวจสอบ URL อีกครั้งหรือติดต่อผู้จัดอีเวนต์
                    </p>
                    <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        กลับไปยังหน้าแรก
                    </Link>
                </div>
            </div>
        );
    }
    
    // Check if event is published
    if (!eventData.published) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] dark:bg-gray-900 px-4 py-16">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900 flex items-center justify-center rounded-full mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">อีเวนต์ยังไม่เปิดให้เข้าชม</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        อีเวนต์นี้อยู่ในสถานะยังไม่เผยแพร่ โปรดติดต่อผู้จัดอีเวนต์สำหรับข้อมูลเพิ่มเติม
                    </p>
                    <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        กลับไปยังหน้าแรก
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <EventPageBuilder event={eventData} />
    );
}