import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', message, className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const messageClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`${sizeClasses[size]} animate-spin`}>
                <svg
                    className="w-full h-full text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>
            {message && (
                <p className={`mt-2 text-gray-600 ${messageClasses[size]}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

// Additional loading components for better UX
export const LoadingSpinner: React.FC<{size?: 'sm' | 'md' | 'lg'; className?: string}> = ({ 
    size = 'md', 
    className = '' 
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    return (
        <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
            <svg 
                className="w-full h-full text-current" 
                fill="none" 
                viewBox="0 0 24 24"
            >
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                />
                <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
};

export const LoadingSkeleton: React.FC<{rows?: number; className?: string}> = ({ 
    rows = 3, 
    className = '' 
}) => {
    return (
        <div className={`animate-pulse space-y-4 ${className}`}>
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
};

export const TableSkeleton: React.FC<{rows?: number; columns?: number; className?: string}> = ({ 
    rows = 5, 
    columns = 4, 
    className = '' 
}) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {/* Table Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }, (_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded w-24"></div>
                    ))}
                </div>
            </div>
            
            {/* Table Rows */}
            {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="border-b border-gray-200 px-6 py-4">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                        {Array.from({ length: columns }, (_, colIndex) => (
                            <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Loading;
