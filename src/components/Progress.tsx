import React from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'success' | 'warning' | 'error';
    showPercentage?: boolean;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    label,
    size = 'md',
    color = 'primary',
    showPercentage = true,
    className = ''
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    const colorClasses = {
        primary: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };

    return (
        <div className={`w-full ${className}`}>
            {(label || showPercentage) && (
                <div className="flex items-center justify-between mb-2">
                    {label && (
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                    )}
                    {showPercentage && (
                        <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                    )}
                </div>
            )}
            <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
                <div
                    className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
