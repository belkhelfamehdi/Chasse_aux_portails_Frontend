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
                <div className="flex justify-between items-center mb-2">
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
                {/* Hidden progress element for accessibility */}
                <progress
                    value={value}
                    max={max}
                    className="sr-only"
                    aria-label={label || `Progress: ${percentage.toFixed(0)}%`}
                />
            </div>
        </div>
    );
};

interface StepProgressProps {
    steps: string[];
    currentStep: number;
    completedSteps?: number[];
    className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
    steps,
    currentStep,
    completedSteps = [],
    className = ''
}) => {
    const getStepClassName = (isCompleted: boolean, isCurrent: boolean, isActive: boolean) => {
        if (isCompleted) return 'bg-green-500 text-white';
        if (isCurrent) return 'bg-primary text-white';
        if (isActive) return 'bg-primary-light text-white';
        return 'bg-gray-200 text-gray-500';
    };

    const getTextClassName = (isActive: boolean) => {
        return isActive ? 'text-gray-900' : 'text-gray-500';
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(index);
                    const isCurrent = index === currentStep;
                    const isActive = index <= currentStep || isCompleted;

                    return (
                        <div key={`step-${step}-${index}`} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${getStepClassName(isCompleted, isCurrent, isActive)}`}
                                >
                                    {isCompleted ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`mt-2 text-xs font-medium ${getTextClassName(isActive)}`}>
                                    {step}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${isActive ? 'bg-primary' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    showValue?: boolean;
    className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    color = '#23B2A4',
    backgroundColor = '#f3f4f6',
    showValue = true,
    className = ''
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                        {percentage.toFixed(0)}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;
