"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        
        // Force a refresh of the current page
        router.refresh();
        
        // Reset the spinning animation after 1 second
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 disabled:opacity-70 transition flex items-center"
            aria-label="Refresh page"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
            </svg>
            รีเฟรช
        </button>
    );
}