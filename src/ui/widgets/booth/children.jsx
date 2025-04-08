import options from "../options";

export default function WidgetBoothChildren({ booth, option, primary_color, accent_color }) {
    // Default option values
    const defaultOptions = options.children.default;
    defaultOptions.header = `กิจกรรมภายในบูธ ${booth.name || ''}`;
    
    // Merge default options with provided options
    const finalOptions = { ...defaultOptions, ...option };
    
    // Get activities data from booth
    const activities = booth.Activities || [];
    
    // Format price
    const formatPrice = (price) => {
        if (price === null || price === undefined) return "ฟรี";
        
        if (price === 0) return "ฟรี";
        
        return `${Number(price).toLocaleString()} บาท`;
    };
    
    // Dynamic styles based on options
    const containerStyles = {
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
    
    const getItemTitleSizeClass = () => {
        switch (finalOptions.textSize) {
            case 's': return 'text-lg font-semibold';
            case 'l': return 'text-2xl font-semibold';
            case 'm':
            default: return 'text-xl font-semibold';
        }
    };
    
    const getTextSizeClass = () => {
        switch (finalOptions.textSize) {
            case 's': return 'text-xs';
            case 'l': return 'text-base';
            case 'm':
            default: return 'text-sm';
        }
    };
    
    // Generate item styles
    const itemStyle = {
        backgroundColor: '#f9fafb',
        borderRadius: '0.375rem',
        border: `1px solid ${accent_color || '#e5e7eb'}`,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
    };

    return (
        <div style={containerStyles} className="booth-children-widget">
            {/* Header */}
            {finalOptions.header && (
                <h2 
                    className={`${getTitleSizeClass()} mb-6 text-center`} 
                    style={{ color: primary_color || 'inherit' }}
                >
                    {finalOptions.header}
                </h2>
            )}
            
            {/* Empty state */}
            {activities.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className={`${getTextSizeClass()} text-gray-500`}>ยังไม่มีกิจกรรมในบูธนี้</p>
                </div>
            )}
            
            {/* Activities display - Grid or List view based on option */}
            {activities.length > 0 && (
                finalOptions.style === 'list' ? (
                    <ul className="space-y-4">
                        {activities.map((activity) => (
                            <li 
                                key={activity.activity_id} 
                                className="transition-all hover:shadow-md"
                                style={itemStyle}
                            >
                                <div className="p-4">
                                    <h3 
                                        className={getItemTitleSizeClass()}
                                        style={{ color: primary_color || 'inherit' }}
                                    >
                                        <span className="mr-2">🎯</span>
                                        {activity.name}
                                    </h3>
                                    
                                    {activity.description && (
                                        <p className={`${getTextSizeClass()} mt-2 text-gray-700 dark:text-gray-300`}>
                                            {activity.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex flex-wrap gap-4 mt-3">
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
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {activities.map((activity) => (
                            <div 
                                key={activity.activity_id} 
                                className="group transition-all h-full"
                                style={itemStyle}
                            >
                                <div className="p-4 flex flex-col h-full">
                                    <h3 
                                        className={`${getItemTitleSizeClass()} mb-2`}
                                        style={{ color: primary_color || 'inherit' }}
                                    >
                                        <span className="mr-2">🎯</span>
                                        {activity.name}
                                    </h3>
                                    
                                    {activity.description && (
                                        <p className={`${getTextSizeClass()} mb-4 text-gray-700 dark:text-gray-300 flex-grow`}>
                                            {activity.description}
                                        </p>
                                    )}
                                    
                                    <div className="mt-auto">
                                        <div className="flex flex-wrap gap-2 border-t pt-3">
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
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}