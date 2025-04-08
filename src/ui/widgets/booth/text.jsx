import options from "../options";
import Link from "next/link";

export default function WidgetBoothText({ booth, option, primary_color, accent_color }) {
    // Default option values
    const defaultOptions = options.text.default;
    
    // Merge default options with provided options
    const finalOptions = { ...defaultOptions, ...option };
    
    // If the widget is set to be hidden, return null (don't render anything)
    if (finalOptions.hidden === true) {
        return null;
    }
    
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
            case 's': return 'text-xl font-bold';
            case 'l': return 'text-4xl font-bold';
            case 'm':
            default: return 'text-2xl font-bold';
        }
    };
    
    const getContentSizeClass = () => {
        switch (finalOptions.textSize) {
            case 's': return 'text-sm';
            case 'l': return 'text-xl';
            case 'm':
            default: return 'text-base';
        }
    };
    
    // Process content for line breaks and links
    const processContent = (content) => {
        if (!content) return null;
        
        // Process URLs into clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        
        // Split by newlines first to preserve paragraph breaks
        const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
        
        return paragraphs.map((paragraph, paragraphIndex) => {
            // Process URLs within each paragraph
            const parts = [];
            let lastIndex = 0;
            let match;
            
            // Replace URLs with links
            while ((match = urlRegex.exec(paragraph)) !== null) {
                const url = match[0];
                const beforeUrl = paragraph.substring(lastIndex, match.index);
                
                if (beforeUrl) {
                    parts.push(<span key={`text-${paragraphIndex}-${lastIndex}`}>{beforeUrl}</span>);
                }
                
                parts.push(
                    <Link 
                        href={url} 
                        key={`link-${paragraphIndex}-${match.index}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-words"
                    >
                        {url}
                    </Link>
                );
                
                lastIndex = match.index + url.length;
            }
            
            // Add any remaining text after the last URL
            if (lastIndex < paragraph.length) {
                parts.push(
                    <span key={`text-${paragraphIndex}-end`}>
                        {paragraph.substring(lastIndex)}
                    </span>
                );
            }
            
            // If no URLs were found, just return the paragraph as is
            if (parts.length === 0) {
                parts.push(<span key={`text-${paragraphIndex}`}>{paragraph}</span>);
            }
            
            return (
                <p className="mb-4 last:mb-0" key={`paragraph-${paragraphIndex}`}>
                    {parts}
                </p>
            );
        });
    };
    
    const processedContent = processContent(finalOptions.content);
    
    return (
        <div style={containerStyles} className="booth-text-widget">
            {/* Header */}
            {finalOptions.header && (
                <h2 
                    className={`${getTitleSizeClass()} mb-4`}
                    style={{ color: primary_color || 'inherit' }}
                >
                    {finalOptions.header}
                </h2>
            )}
            
            {/* Content */}
            {processedContent ? (
                <div className={getContentSizeClass()}>
                    {processedContent}
                </div>
            ) : (
                <div className={`${getContentSizeClass()} text-gray-500 italic`}>
                    ไม่มีเนื้อหา
                </div>
            )}
        </div>
    );
}