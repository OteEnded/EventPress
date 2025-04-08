import options from "../options";

export default function WidgetEventInformation({ event, option, primary_color, accent_color }) { // white background for widget
    // Default option values
    const defaultOptions = options.information.default;
    defaultOptions.header = `ข้อมูลอีเวนต์ ${event.name || ""}`;
    
    // Merge default options with provided options
    const finalOptions = { ...defaultOptions, ...option, };
    
    // Date utility functions for formatting to Thai format
    const formatDateToThaiDisplay = (isoDateString) => {
        if (!isoDateString) return "";
        
        const date = new Date(isoDateString);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear() + 543; // Convert to Buddhist Era (BE)
        
        const thaiMonths = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        
        return `${day} ${thaiMonths[month]} ${year}`;
    };
    
    // Format time (if available)
    const formatTime = (timeString) => {
        if (!timeString) return "";
        
        // Check if time is in HH:MM format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(timeString)) return timeString;
        
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes} น.`;
    };
    
    // Format date range
    const formatDateRange = () => {
        if (!event.start_date) return "";
        
        const startDate = formatDateToThaiDisplay(event.start_date);
        const endDate = event.end_date ? formatDateToThaiDisplay(event.end_date) : null;
        
        if (!endDate || event.start_date === event.end_date) {
            return startDate;
        }
        
        return `${startDate} - ${endDate}`;
    };
    
    // Format time range
    const formatTimeRange = () => {
        if (!event.start_time) return "";
        
        const startTime = formatTime(event.start_time);
        const endTime = event.end_time ? formatTime(event.end_time) : null;
        
        if (!endTime) {
            return `เวลา ${startTime}`;
        }
        
        return `เวลา ${startTime} - ${endTime}`;
    };

    // Format price
    const formatPrice = () => {
        if (!event.price && event.price !== 0) return "ฟรี";
        
        if (event.price === 0) return "ฟรี";
        
        return `${Number(event.price).toLocaleString()} บาท`;
    };
    
    // Dynamic styles based on options
    const containerStyles = {
        textAlign: finalOptions.alignment || 'left',
        backgroundColor: 'white',
        color: primary_color || '#333',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: `1px solid ${accent_color || '#e5e7eb'}`,
    };
    
    // Dynamic class for text size
    const getTitleSizeClass = () => {
        switch (finalOptions.textSize) {
            case 's': return 'text-2xl font-bold';
            case 'l': return 'text-5xl font-bold';
            case 'm':
            default: return 'text-3xl font-bold';
        }
    };

    const getSubtitleSizeClass = () => {
        switch (finalOptions.textSize) {
            case 's': return 'text-base font-semibold';
            case 'l': return 'text-2xl font-semibold';
            case 'm':
            default: return 'text-xl font-semibold';
        }
    };

    const getTextSizeClass = () => {
        switch (finalOptions.textSize) {
            case 's': return 'text-sm';
            case 'l': return 'text-lg';
            case 'm':
            default: return 'text-base';
        }
    };

    // Generate icon styles
    const iconStyle = {
        color: accent_color || '#4B5563',
        marginRight: '0.5rem',
    };
    
    return (
        <div style={containerStyles} className="event-information-widget">
            {/* Header */}
            {finalOptions.header && (
                <h2 className={getTitleSizeClass()} style={{ color: primary_color || 'inherit', marginBottom: '1rem' }}>
                    {finalOptions.header}
                </h2>
            )}
            
            {/* Event Description */}
            {finalOptions.showDescription && event.description && (
                <div className="mb-4">
                    <p className={getTextSizeClass()}>
                        {event.description}
                    </p>
                </div>
            )}
            
            <div className="flex flex-col gap-3">
                {/* Date and Time */}
                {finalOptions.showDateTime && (event.start_date || event.start_time) && (
                    <div className="flex items-start">
                        <span style={iconStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className={getSubtitleSizeClass()}>วันและเวลา</h3>
                            <p className={getTextSizeClass()}>
                                {formatDateRange()}
                                {event.start_date && event.start_time && <br />}
                                {event.start_time && formatTimeRange()}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Location */}
                {finalOptions.showLocation && event.location && (
                    <div className="flex items-start">
                        <span style={iconStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className={getSubtitleSizeClass()}>สถานที่</h3>
                            <p className={getTextSizeClass()}>{event.location}</p>
                        </div>
                    </div>
                )}
                
                {/* Capacity */}
                {finalOptions.showCapacity && event.capacity && (
                    <div className="flex items-start">
                        <span style={iconStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className={getSubtitleSizeClass()}>จำนวนที่รับ</h3>
                            <p className={getTextSizeClass()}>{event.capacity} คน</p>
                        </div>
                    </div>
                )}
                
                {/* Price */}
                {finalOptions.showPrice && (event.price !== undefined) && (
                    <div className="flex items-start">
                        <span style={iconStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className={getSubtitleSizeClass()}>ค่าใช้จ่าย</h3>
                            <p className={getTextSizeClass()}>{formatPrice()}</p>
                        </div>
                    </div>
                )}
                
                {/* Contact Info */}
                {finalOptions.showContact && event.contact_info && (
                    <div className="flex items-start">
                        <span style={iconStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className={getSubtitleSizeClass()}>ข้อมูลติดต่อ</h3>
                            <p className={getTextSizeClass()}>{event.contact_info}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}