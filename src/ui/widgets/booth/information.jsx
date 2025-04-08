import options from "../options";

export default function WidgetBoothInformation({ booth, option, primary_color, accent_color }) {
    // Default option values
    const defaultOptions = options.information.default;
    defaultOptions.header = `ข้อมูลบูธ ${booth.name || ""}`;
    
    // Merge default options with provided options
    const finalOptions = { ...defaultOptions, ...option, };
    
    // Format price for activities if needed
    const formatPrice = (price) => {
        if (price === null || price === undefined) return "ฟรี";
        
        if (price === 0) return "ฟรี";
        
        return `${Number(price).toLocaleString()} บาท`;
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
        <div style={containerStyles} className="booth-information-widget">
            {/* Header */}
            {finalOptions.header && (
                <h2 className={getTitleSizeClass()} style={{ color: primary_color || 'inherit', marginBottom: '1rem' }}>
                    {finalOptions.header}
                </h2>
            )}
            
            {/* Booth Description */}
            {finalOptions.showDescription && booth.description && (
                <div className="mb-4">
                    <p className={getTextSizeClass()}>
                        {booth.description}
                    </p>
                </div>
            )}
            
            <div className="flex flex-col gap-3">
                {/* Location */}
                {finalOptions.showLocation && booth.location && (
                    <div className="flex items-start">
                        <span style={iconStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className={getSubtitleSizeClass()}>สถานที่</h3>
                            <p className={getTextSizeClass()}>{booth.location}</p>
                        </div>
                    </div>
                )}
                
                {/* Contact Info */}
                {finalOptions.showContact && booth.contact_info && (
                    <div className="flex items-start">
                        <span style={iconStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className={getSubtitleSizeClass()}>ข้อมูลติดต่อ</h3>
                            <p className={getTextSizeClass()}>{booth.contact_info}</p>
                        </div>
                    </div>
                )}
                
                {/* Activities Section */}
                {booth.Activities && booth.Activities.length > 0 && (
                    <div className="mt-4">
                        <h3 className={getSubtitleSizeClass()} style={{ color: primary_color || 'inherit', marginBottom: '0.5rem' }}>
                            กิจกรรมภายในบูธ
                        </h3>
                        <div className="space-y-3 mt-2">
                            {booth.Activities.map(activity => (
                                <div key={activity.activity_id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className={`font-semibold ${getTextSizeClass()}`}>
                                        <span className="mr-2">🎯</span>
                                        {activity.name}
                                    </h4>
                                    
                                    {activity.description && (
                                        <p className={`${getTextSizeClass()} mt-1 text-gray-600 dark:text-gray-300`}>
                                            {activity.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex flex-wrap gap-x-4 mt-2">
                                        {activity.location && (
                                            <div className={`${getTextSizeClass()} text-gray-500 dark:text-gray-400 flex items-center`}>
                                                <span className="mr-1">📍</span>
                                                <span>{activity.location}</span>
                                            </div>
                                        )}
                                        
                                        {(activity.start_time || activity.end_time) && (
                                            <div className={`${getTextSizeClass()} text-gray-500 dark:text-gray-400 flex items-center`}>
                                                <span className="mr-1">🕒</span>
                                                <span>
                                                    {activity.start_time && activity.end_time ? 
                                                        `${activity.start_time.slice(0, 5)} - ${activity.end_time.slice(0, 5)}` : 
                                                        activity.start_time ? activity.start_time.slice(0, 5) : activity.end_time.slice(0, 5)}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className={`${getTextSizeClass()} ${activity.price > 0 ? 'text-gray-500 dark:text-gray-400' : 'text-green-500 dark:text-green-400'} flex items-center`}>
                                            <span className="mr-1">{activity.price > 0 ? '💰' : '✓'}</span>
                                            <span>{formatPrice(activity.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}