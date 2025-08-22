import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
    illustration?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    illustration
}) => {
    return (
        <div className="text-center py-12 px-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                {icon}
            </div>
            
            {illustration && (
                <div className="mb-6">
                    {illustration}
                </div>
            )}
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
            </h3>
            
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                {description}
            </p>
            
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                    {action.icon || <PlusIcon className="h-5 w-5 mr-2" />}
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
