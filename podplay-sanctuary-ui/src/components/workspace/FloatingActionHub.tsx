import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CommandLineIcon,
  GlobeAltIcon,
  FolderIcon,
  CameraIcon,
  MicrophoneIcon,
  ShareIcon,
  BoltIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  FireIcon,
  BeakerIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  DocumentIcon,
  CodeBracketIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface FloatingActionHubProps {
  onOpenTerminal: () => void;
  onOpenBrowser: () => void;
  onOpenFileManager: () => void;
  onStartScreenShare: () => void;
  onStartVoiceChat: () => void;
  onQuickShare: () => void;
  workspaceId?: string;
  className?: string;
}

interface ActionButton {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  gradient: string;
  action: () => void;
  hotkey?: string;
  category: 'primary' | 'secondary' | 'advanced';
}

const FloatingActionHub: React.FC<FloatingActionHubProps> = ({
  onOpenTerminal,
  onOpenBrowser,
  onOpenFileManager,
  onStartScreenShare,
  onStartVoiceChat,
  onQuickShare,
  workspaceId,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'primary' | 'secondary' | 'advanced'>('primary');
  const [isRecording, setIsRecording] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>([]);

  // Define all available actions
  const actions: ActionButton[] = [
    // Primary actions
    {
      id: 'terminal',
      icon: CommandLineIcon,
      label: 'Terminal',
      color: 'text-green-400',
      gradient: 'from-green-500 to-emerald-500',
      action: onOpenTerminal,
      hotkey: 'Ctrl+`',
      category: 'primary'
    },
    {
      id: 'browser',
      icon: GlobeAltIcon,
      label: 'Browser',
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
      action: onOpenBrowser,
      hotkey: 'Ctrl+B',
      category: 'primary'
    },
    {
      id: 'files',
      icon: FolderIcon,
      label: 'Files',
      color: 'text-yellow-400',
      gradient: 'from-yellow-500 to-orange-500',
      action: onOpenFileManager,
      hotkey: 'Ctrl+E',
      category: 'primary'
    },
    {
      id: 'share',
      icon: ShareIcon,
      label: 'Quick Share',
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-500',
      action: onQuickShare,
      hotkey: 'Ctrl+S',
      category: 'primary'
    },
    
    // Secondary actions
    {
      id: 'screen-share',
      icon: CameraIcon,
      label: 'Screen Share',
      color: 'text-red-400',
      gradient: 'from-red-500 to-pink-500',
      action: onStartScreenShare,
      category: 'secondary'
    },
    {
      id: 'voice-chat',
      icon: MicrophoneIcon,
      label: 'Voice Chat',
      color: 'text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500',
      action: onStartVoiceChat,
      category: 'secondary'
    },
    {
      id: 'ai-assistant',
      icon: SparklesIcon,
      label: 'AI Assistant',
      color: 'text-cyan-400',
      gradient: 'from-cyan-500 to-blue-500',
      action: () => console.log('AI Assistant'),
      category: 'secondary'
    },
    {
      id: 'code-gen',
      icon: CodeBracketIcon,
      label: 'Code Generator',
      color: 'text-emerald-400',
      gradient: 'from-emerald-500 to-green-500',
      action: () => console.log('Code Generator'),
      category: 'secondary'
    },
    
    // Advanced actions
    {
      id: 'performance',
      icon: BoltIcon,
      label: 'Performance Monitor',
      color: 'text-yellow-400',
      gradient: 'from-yellow-500 to-red-500',
      action: () => console.log('Performance Monitor'),
      category: 'advanced'
    },
    {
      id: 'deployment',
      icon: RocketLaunchIcon,
      label: 'Deploy',
      color: 'text-orange-400',
      gradient: 'from-orange-500 to-red-500',
      action: () => console.log('Deploy'),
      category: 'advanced'
    },
    {
      id: 'analytics',
      icon: BeakerIcon,
      label: 'Analytics',
      color: 'text-teal-400',
      gradient: 'from-teal-500 to-cyan-500',
      action: () => console.log('Analytics'),
      category: 'advanced'
    },
    {
      id: 'automation',
      icon: CpuChipIcon,
      label: 'Automation',
      color: 'text-violet-400',
      gradient: 'from-violet-500 to-purple-500',
      action: () => console.log('Automation'),
      category: 'advanced'
    }
  ];

  const filteredActions = actions.filter(action => action.category === activeCategory);

  const handleActionClick = useCallback((action: ActionButton) => {
    action.action();
    
    // Add to quick actions if not already there
    if (!quickActions.includes(action.id)) {
      setQuickActions(prev => [action.id, ...prev.slice(0, 3)]);
    }
    
    // Auto-collapse after action
    setTimeout(() => setIsExpanded(false), 300);
  }, [quickActions]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const getQuickActionButtons = useCallback(() => {
    return quickActions.map(actionId => 
      actions.find(action => action.id === actionId)
    ).filter(Boolean) as ActionButton[];
  }, [quickActions]);

  return (
    <div className={`fixed bottom-6 left-6 z-40 ${className}`}>
      {/* Quick Actions (Always Visible) */}
      <div className="flex flex-col space-y-3 mb-4">
        <div>
          {getQuickActionButtons().map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleActionClick(action)}
              className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.gradient} shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center group relative`}
              title={action.label}
            >
              <action.icon className="w-6 h-6 text-white" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {action.label}
                {action.hotkey && (
                  <span className="ml-2 text-gray-400">({action.hotkey})</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Expanded Action Grid */}
      {isExpanded && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-black/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-4 min-w-80"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Quick Actions</h3>
              <div className="flex items-center space-x-1">
                {(['primary', 'secondary', 'advanced'] as const).map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleActionClick(action)}
                  className={`flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r ${action.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200 group`}
                >
                  <action.icon className="w-5 h-5 text-white flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">{action.label}</div>
                    {action.hotkey && (
                      <div className="text-white/70 text-xs">{action.hotkey}</div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Workspace Info */}
            {workspaceId && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <CpuChipIcon className="w-4 h-4" />
                  <span>Workspace: {workspaceId.slice(0, 8)}...</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
        </motion.div>
      )}

      {/* Main Action Button */}
      <motion.button
        onClick={toggleExpanded}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 shadow-xl hover:shadow-2xl transform transition-all duration-300 flex items-center justify-center group relative ${
          isExpanded ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? (
            <PlusIcon className="w-8 h-8 text-white" />
          ) : (
            <SparklesIcon className="w-8 h-8 text-white" />
          )}
        </motion.div>

        {/* Pulse Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-ping opacity-20"></div>
        
        {/* Status Indicators */}
        {(isRecording || isSharing) && (
          <div className="absolute -top-1 -right-1 flex space-x-1">
            {isRecording && (
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
            {isSharing && (
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute left-full ml-4 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isExpanded ? 'Close Actions' : 'Open Quick Actions'}
          <div className="text-xs text-gray-400 mt-1">
            🐻 Muma Bear Power Tools
          </div>
        </div>
      </motion.button>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              y: [-20, -60],
              x: [0, Math.random() * 40 - 20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
            style={{
              left: `${50 + Math.random() * 20}%`,
              bottom: '100%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingActionHub;