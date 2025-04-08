import Information from "../widgets/event/information";
import Text from "../widgets/event/text";
import Children from "../widgets/event/children";

import Page from "@/lib/models/Page";

export default async function EventPage({ event }) {
    // Get the page configuration for this event
    const page = await Page.getPageOfEvent(event.event_id);
    
    // Get background color from page settings or use default
    const backgroundColor = page.background_color || "#FFFFFF";
    
    // Parse colors from page theme settings
    const primaryColor = page.primary_color || "#333333";
    const accentColor = page.accent_color || "#3B82F6";
    
    // Get banner image URL if available
    const bannerImageUrl = event.banner ? `/api/data/file/load?id=${event.banner}` : null;
    
    console.log("HERE ",page.EventPageWidgets)
    
    // Initialize widget stack and sort widgets by position
    const widgets = [...(page.EventPageWidgets || [])];
    
    // Create array of rendered widget components
    const widgetStack = [];
    
    // Track widget ids to ensure unique keys
    let widgetCounter = 0;
    
    // Process each widget and add to stack
    for (const widget of widgets) {
        const key = `widget-${widget.event_page_widget_id || widgetCounter++}`;
        
        // Parse widget options from JSON if it exists
        const widgetOptions = widget.options;
        
        if (widget.widget_type === "INFORMATION") {
            widgetStack.push(
                <div className="mb-8" key={key}>
                    <Information 
                        event={event} 
                        option={widgetOptions}
                        primary_color={primaryColor}
                        accent_color={accentColor}
                    />
                </div>
            );
        } else if (widget.widget_type === "TEXT") {
            widgetStack.push(
                <div className="mb-8" key={key}>
                    <Text 
                        event={event} 
                        option={widgetOptions}
                        primary_color={primaryColor}
                        accent_color={accentColor}
                    />
                </div>
            );
        } else if (widget.widget_type === "CHILDREN") {
            widgetStack.push(
                <div className="mb-8" key={key}>
                    <Children 
                        event={event} 
                        option={widgetOptions}
                        primary_color={primaryColor}
                        accent_color={accentColor}
                    />
                </div>
            );
        }
    }
    
    // If there are no widgets, display a default message or fallback content
    if (widgetStack.length === 0) {
        widgetStack.push(
            <div className="bg-white p-8 rounded-lg shadow-md text-center" key="no-widgets">
                <h2 className="text-2xl font-bold mb-4">ยังไม่มีการออกแบบเนื้อหา</h2>
                <p className="text-gray-600">
                    ผู้จัดอีเวนต์ยังไม่ได้เพิ่มข้อมูลแสดงผล กรุณาลองกลับมาอีกครั้งในภายหลัง
                </p>
            </div>
        );
    }
    
    // Return the complete page with banner and all widgets in a container
    return (
        <div style={{ backgroundColor }} className="min-h-screen pb-12">
            <div className="container mx-auto px-4 py-8">
                {/* Banner Image (if available) */}
                {bannerImageUrl && (
                    <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                        <img 
                            src={bannerImageUrl} 
                            alt={`${event.name} banner`} 
                            className="w-full h-auto object-cover" 
                            style={{ maxHeight: '400px' }}
                            // onError={(e) => {
                            //     e.target.style.display = 'none'; // Hide if image fails to load
                            // }}
                        />
                    </div>
                )}
                
                {/* Main content container with widgets */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Event title */}
                    <h1 
                        className="text-4xl font-bold mb-8 text-center" 
                        style={{ color: primaryColor }}
                    >
                        {event.name}
                    </h1>
                    
                    {/* Widgets */}
                    {widgetStack}
                </div>
            </div>
        </div>
    );
}