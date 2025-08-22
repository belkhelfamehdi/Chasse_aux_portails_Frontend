import React, { createContext, useState, useCallback, useMemo } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    persistent?: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export { NotificationContext };

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString();
        const newNotification: Notification = {
            ...notification,
            id,
            duration: notification.duration ?? 5000,
        };

        setNotifications(prev => [...prev, newNotification]);

        if (!newNotification.persistent && newNotification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }
    }, [removeNotification]);

    const success = useCallback((title: string, message?: string) => {
        addNotification({ type: 'success', title, message });
    }, [addNotification]);

    const error = useCallback((title: string, message?: string) => {
        addNotification({ type: 'error', title, message, persistent: true });
    }, [addNotification]);

    const warning = useCallback((title: string, message?: string) => {
        addNotification({ type: 'warning', title, message });
    }, [addNotification]);

    const info = useCallback((title: string, message?: string) => {
        addNotification({ type: 'info', title, message });
    }, [addNotification]);

    const contextValue = useMemo(() => ({
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
    }), [notifications, addNotification, removeNotification, success, error, warning, info]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

const NotificationContainer: React.FC<{
    notifications: Notification[];
    onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
            {notifications.map((notification) => (
                <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};

const NotificationCard: React.FC<{
    notification: Notification;
    onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
            case 'error':
                return <XCircleIcon className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
            case 'info':
                return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
        }
    };

    const getBackgroundColor = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div
            className={`notification-enter pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${getBackgroundColor()}`}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                        </p>
                        {notification.message && (
                            <p className="mt-1 text-sm text-gray-500">
                                {notification.message}
                            </p>
                        )}
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            onClick={() => onRemove(notification.id)}
                        >
                            <span className="sr-only">Fermer</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationProvider;
