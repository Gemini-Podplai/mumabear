import { motion } from 'framer-motion';
import { BarChart3, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { useCollaborativeWorkspace } from '../../hooks/use-collaborative-workspace';
import { AIAnalytics } from './AIAnalytics';
import { AIModelMessenger } from './AIModelMessenger';
import { NotificationBell, NotificationPanel, NotificationProvider, NotificationSettings } from './NotificationSystem';

const MessengerPanel: React.FC = () => {
    const { isConnected } = useCollaborativeWorkspace({
        sessionId: 'messenger-session',
        userId: 'user-1',
        userName: 'User'
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);

    // Express mode based on connection status for faster interactions
    const expressMode = isConnected;

    return (
        <NotificationProvider>
            <motion.div
                className="h-full flex flex-col bg-gray-900 text-white rounded-lg overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: expressMode ? 0.2 : 0.4 }}
            >
                {/* Enhanced Header with Controls */}
                <div className="absolute top-4 right-4 z-40 flex items-center space-x-2">
                    <motion.button
                        className="p-2 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 rounded-lg transition-colors shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAnalytics(true)}
                        title="AI Analytics"
                    >
                        <BarChart3 className="w-5 h-5 text-gray-300" />
                    </motion.button>

                    <motion.button
                        className="p-2 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 rounded-lg transition-colors shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowNotificationSettings(true)}
                        title="Notification Settings"
                    >
                        <Settings className="w-5 h-5 text-gray-300" />
                    </motion.button>

                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg">
                        <NotificationBell onClick={() => setShowNotifications(true)} />
                    </div>
                </div>

                {/* Main Messenger */}
                <AIModelMessenger />

                {/* Notification Panel */}
                <NotificationPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />

                {/* Analytics Panel */}
                <AIAnalytics
                    isOpen={showAnalytics}
                    onClose={() => setShowAnalytics(false)}
                    models={[]} // Will be passed from AIModelMessenger
                    conversations={[]} // Will be passed from AIModelMessenger
                    groupChats={[]} // Will be passed from AIModelMessenger
                />

                {/* Notification Settings */}
                <NotificationSettings
                    isOpen={showNotificationSettings}
                    onClose={() => setShowNotificationSettings(false)}
                />

                {/* Performance Indicator */}
                <motion.div
                    className="absolute bottom-4 left-4 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg">
                        <div className={`w-2 h-2 rounded-full ${expressMode ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <span className="text-xs text-gray-300 font-medium">
                            {expressMode ? 'Express Mode' : 'Standard Mode'}
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </NotificationProvider>
    );
};

export default MessengerPanel;
