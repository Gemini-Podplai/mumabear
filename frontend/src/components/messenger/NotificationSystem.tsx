import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BellOff, MessageCircle, Users, X } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Notification {
  id: string;
  type: 'message' | 'group_invite' | 'mention' | 'system' | 'model_update';
  title: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  conversationId?: string;
  groupId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: {
    modelName?: string;
    groupName?: string;
    messageCount?: number;
  };
}

interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  emailEnabled: boolean;
  messageNotifications: boolean;
  groupNotifications: boolean;
  mentionNotifications: boolean;
  systemNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  priority: {
    low: boolean;
    medium: boolean;
    high: boolean;
    urgent: boolean;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    soundEnabled: true,
    desktopEnabled: false,
    emailEnabled: false,
    messageNotifications: true,
    groupNotifications: true,
    mentionNotifications: true,
    systemNotifications: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    priority: {
      low: true,
      medium: true,
      high: true,
      urgent: true
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  // Check quiet hours
  const isQuietHours = (): boolean => {
    if (!settings.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = settings.quietHoursEnd.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Crosses midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  };

  // Play notification sound
  const playNotificationSound = (priority: string) => {
    if (!settings.soundEnabled || isQuietHours()) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different priorities
    const frequencies = {
      low: 400,
      medium: 600,
      high: 800,
      urgent: 1000
    };

    oscillator.frequency.setValueAtTime(frequencies[priority as keyof typeof frequencies] || 600, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Show desktop notification
  const showDesktopNotification = (notification: Notification) => {
    if (!settings.desktopEnabled || isQuietHours() || Notification.permission !== 'granted') return;

    const options: NotificationOptions = {
      body: notification.content,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
      silent: !settings.soundEnabled
    };

    const desktopNotification = new Notification(notification.title, options);

    desktopNotification.onclick = () => {
      window.focus();
      if (notification.actionUrl) {
        // Handle navigation to specific conversation/group
      }
      desktopNotification.close();
    };

    // Auto-close after 5 seconds unless urgent
    if (notification.priority !== 'urgent') {
      setTimeout(() => {
        desktopNotification.close();
      }, 5000);
    }
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    if (!settings.enabled) return;

    // Check if notification type is enabled
    const typeEnabled = {
      message: settings.messageNotifications,
      group_invite: settings.groupNotifications,
      mention: settings.mentionNotifications,
      system: settings.systemNotifications,
      model_update: settings.systemNotifications
    };

    if (!typeEnabled[notificationData.type]) return;

    // Check if priority is enabled
    if (!settings.priority[notificationData.priority]) return;

    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 99)]); // Keep only 100 notifications

    // Play sound and show desktop notification
    playNotificationSound(notification.priority);
    showDesktopNotification(notification);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

    // Store in localStorage
    localStorage.setItem('messenger-notification-settings', JSON.stringify({ ...settings, ...newSettings }));
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('messenger-notification-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    settings,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    updateSettings,
    requestPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Panel Component
export const NotificationPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'messages' | 'groups'>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'messages':
        return notification.type === 'message';
      case 'groups':
        return notification.type === 'group_invite' || (notification.groupId && notification.type === 'message');
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'group_invite': return <Users className="w-4 h-4" />;
      case 'mention': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <div className="flex space-x-2">
                  {notifications.some(n => !n.isRead) && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex mt-4 space-x-1 bg-gray-700 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'messages', label: 'Messages' },
                  { key: 'groups', label: 'Groups' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${filter === tab.key
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[60vh]">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer ${!notification.isRead ? 'bg-blue-500/5 border-l-4 border-l-blue-500' : ''
                        }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg border ${getPriorityColor(notification.priority)}`}>
                          {getTypeIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white truncate">{notification.title}</h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {notification.content}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              {notification.senderName && (
                                <span className="text-xs text-gray-500">
                                  from {notification.senderName}
                                </span>
                              )}
                              {notification.metadata?.groupName && (
                                <span className="text-xs text-gray-500">
                                  in {notification.metadata.groupName}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications yet</p>
                    <p className="text-sm mt-1">You'll see updates here when something happens</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification Bell Component
export const NotificationBell: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const { unreadCount, settings } = useNotifications();

  return (
    <motion.button
      className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {settings.enabled ? (
        <Bell className="w-5 h-5 text-gray-300" />
      ) : (
        <BellOff className="w-5 h-5 text-gray-500" />
      )}

      {unreadCount > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <span className="text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
};

// Notification Settings Component
export const NotificationSettings: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, requestPermission } = useNotifications();
  const [hasPermission, setHasPermission] = useState(Notification.permission === 'granted');

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    setHasPermission(granted);
    if (granted) {
      updateSettings({ desktopEnabled: true });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* General Settings */}
              <div>
                <h3 className="font-medium text-white mb-3">General</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Enable notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => updateSettings({ enabled: e.target.checked })}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Sound notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                      className="toggle"
                    />
                  </label>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Desktop notifications</span>
                    <div className="flex items-center space-x-2">
                      {!hasPermission && (
                        <button
                          onClick={handleRequestPermission}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Allow
                        </button>
                      )}
                      <input
                        type="checkbox"
                        checked={settings.desktopEnabled && hasPermission}
                        onChange={(e) => updateSettings({ desktopEnabled: e.target.checked })}
                        disabled={!hasPermission}
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="font-medium text-white mb-3">Notification Types</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Message notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.messageNotifications}
                      onChange={(e) => updateSettings({ messageNotifications: e.target.checked })}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Group notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.groupNotifications}
                      onChange={(e) => updateSettings({ groupNotifications: e.target.checked })}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Mention notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.mentionNotifications}
                      onChange={(e) => updateSettings({ mentionNotifications: e.target.checked })}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">System notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.systemNotifications}
                      onChange={(e) => updateSettings({ systemNotifications: e.target.checked })}
                      className="toggle"
                    />
                  </label>
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <h3 className="font-medium text-white mb-3">Quiet Hours</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Enable quiet hours</span>
                    <input
                      type="checkbox"
                      checked={settings.quietHoursEnabled}
                      onChange={(e) => updateSettings({ quietHoursEnabled: e.target.checked })}
                      className="toggle"
                    />
                  </label>

                  {settings.quietHoursEnabled && (
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">Start</label>
                        <input
                          type="time"
                          value={settings.quietHoursStart}
                          onChange={(e) => updateSettings({ quietHoursStart: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">End</label>
                        <input
                          type="time"
                          value={settings.quietHoursEnd}
                          onChange={(e) => updateSettings({ quietHoursEnd: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
