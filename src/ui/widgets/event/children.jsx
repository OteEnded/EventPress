import options from "../options";
import Link from "next/link";

export default function WidgetEventChildren({ event, option, primary_color, accent_color }) {
    // Default option values
    const defaultOptions = options.children.default;
    defaultOptions.header = `บูธภายในอีเวนต์ ${event.name || ''}`;
    
    // Merge default options with provided options
    const finalOptions = { ...defaultOptions, ...option };
    
    // Get booths data from event
    const booths = event.Booths || [];
    
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
        height: '100%',
    };

    // Generate hover style
    const itemHoverStyle = {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transform: 'translateY(-2px)'
    };

    return (
        <div style={containerStyles} className="event-children-widget">
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
            {booths.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className={`${getTextSizeClass()} text-gray-500`}>ยังไม่มีบูธในอีเวนต์นี้</p>
                </div>
            )}
            
            {/* Booths display - Grid or List view based on option */}
            {booths.length > 0 && (
                finalOptions.style === 'list' ? (
                    <ul className="space-y-4">
                        {booths.map((booth) => (
                            <li 
                                key={booth.booth_id} 
                                className="transition-all hover:shadow-md"
                                style={itemStyle}
                            >
                                <Link href={`/booth/${booth.id_name || booth.booth_id}`} className="block no-underline text-inherit">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Booth image/banner (if available) */}
                                        {booth.banner && (
                                            <div className="h-40 md:h-auto md:w-1/3 flex-shrink-0">
                                                <img 
                                                    src={`/api/data/file/load?id=${booth.banner}`} 
                                                    alt={booth.name} 
                                                    className="w-full h-full object-cover"
                                                    // onError={(e) => {
                                                    //     e.target.onerror = null;
                                                    //     e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                    // }}
                                                />
                                            </div>
                                        )}
                                        
                                        {/* Booth details */}
                                        <div className={`p-4 ${booth.banner ? 'md:w-2/3' : 'w-full'}`}>
                                            <h3 className={getItemTitleSizeClass()} style={{ color: primary_color || 'inherit' }}>
                                                {booth.name}
                                            </h3>
                                            {booth.description && (
                                                <p className={`${getTextSizeClass()} mt-2 text-gray-700 line-clamp-2`}>
                                                    {booth.description}
                                                </p>
                                            )}
                                            <div className={`${getTextSizeClass()} mt-3 flex items-center text-gray-500`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                                </svg>
                                                <span>
                                                    {booth.Registrations && booth.Registrations.length ? 
                                                        `${booth.Registrations.length} คนลงทะเบียนแล้ว` : 
                                                        'ยังไม่มีคนลงทะเบียน'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {booths.map((booth) => (
                            <div 
                                key={booth.booth_id} 
                                className="group transition-all" 
                                style={itemStyle}
                            >
                                <Link href={`/booth/${booth.id_name || booth.booth_id}`} className="block no-underline text-inherit h-full">
                                    {/* Booth image/banner */}
                                    <div className="h-40 overflow-hidden">
                                        {booth.banner ? (
                                            <img 
                                                src={`/api/data/file/load?id=${booth.banner}`} 
                                                alt={booth.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                // onError={(e) => {
                                                //     e.target.onerror = null;
                                                //     e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                // }}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Booth details */}
                                    <div className="p-4">
                                        <h3 className={`${getItemTitleSizeClass()} truncate`} style={{ color: primary_color || 'inherit' }}>
                                            {booth.name}
                                        </h3>
                                        {booth.description && (
                                            <p className={`${getTextSizeClass()} mt-2 text-gray-700 line-clamp-2`}>
                                                {booth.description}
                                            </p>
                                        )}
                                        <div className={`${getTextSizeClass()} mt-3 flex items-center text-gray-500`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                            </svg>
                                            <span>
                                                {booth.Registrations && booth.Registrations.length ? 
                                                    `${booth.Registrations.length} คนลงทะเบียนแล้ว` : 
                                                    'ยังไม่มีคนลงทะเบียน'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}