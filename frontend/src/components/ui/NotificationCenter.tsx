import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useEffect, useState } from 'react';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: number;
}

const typeStyles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
};

export const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Expose a global function to add notifications
    useEffect(() => {
        (window as any).notify = (type: Notification['type'], message: string) => {
            setNotifications((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + Math.random().toString(36).slice(2),
                    type,
                    message,
                    timestamp: Date.now(),
                },
            ]);
        };
        return () => {
            delete (window as any).notify;
        };
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    // Auto-dismiss after 5 seconds
    useEffect(() => {
        if (notifications.length === 0) return;
        const timer = setTimeout(() => {
            setNotifications((prev) => prev.slice(1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [notifications]);

    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col space-y-2 min-w-[280px] max-w-xs">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-lg ${typeStyles[n.type]} animate-fade-in`}
                    role="alert"
                    aria-live="polite"
                >
                    <span className="flex-1 text-sm font-medium">{n.message}</span>
                    <button
                        onClick={() => removeNotification(n.id)}
                        className="ml-3 text-xl text-gray-500 hover:text-gray-800"
                        aria-label="Dismiss notification"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationCenter;
