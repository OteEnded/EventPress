import Event from "@/lib/models/Event";
import Page from "@/lib/models/Page";
import Link from "next/link";

export default async function EventLayout({ children, params }) {
  const eventIdName = params.eventIdName;
  
  // Fetch event data
  const event = await Event.getEventByIdName(eventIdName);
  if (!event) {
    return <div>Event not found</div>;
  }
  
  // Get page configuration to access theme colors
  const page = await Page.getPageOfEvent(event.event_id);
  
  // Get theme colors or use defaults
  const backgroundColor = page.background_color || "#FFFFFF";
  const primaryColor = page.primary_color || "#333333";
  const accentColor = page.accent_color || "#3B82F6";
  
  return (
    <div style={{ backgroundColor }} className="min-h-screen">
      {/* Fixed position button for registration */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link 
          href={`/${eventIdName}/attend`}
          style={{ 
            backgroundColor: accentColor,
            color: "#FFFFFF"
          }}
          className="flex items-center px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          ลงทะเบียนเข้าร่วม
        </Link>
      </div>
      
      {/* Main content */}
      {children}
    </div>
  );
}