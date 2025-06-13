import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  ArrowLeftRight,
  MessageSquare,
  Video,
  Mic,
  Users,
  Settings,
  Code
} from 'lucide-react';

interface FloatingToolbarProps {
  isVisible: boolean;
  position?: { x: number; y: number };
  activeTools?: string[];
  onToolClick?: (tool: string) => void;
  className?: string;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  isVisible,
  position,
  activeTools = [],
  onToolClick,
  className = ''
}) => {
  const tools = [
    {
      id: 'command',
      icon: <Command size={16} />,
      label: 'Command Palette'
    },
    {
      id: 'switch',
      icon: <ArrowLeftRight size={16} />,
      label: 'Switch Workspace'
    },
    {
      id: 'chat',
      icon: <MessageSquare size={16} />,
      label: 'Team Chat'
    },
    {
      id: 'video',
      icon: <Video size={16} />,
      label: 'Video Call'
    },
    {
      id: 'voice',
      icon: <Mic size={16} />,
      label: 'Voice Call'
    },
    {
      id: 'participants',
      icon: <Users size={16} />,
      label: 'Participants'
    },
    {
      id: 'terminal',
      icon: <Code size={16} />,
      label: 'Terminal'
    },
    {
      id: 'settings',
      icon: <Settings size={16} />,
      label: 'Settings'
    }
  ];

  const handleToolClick = (toolId: string) => {
    onToolClick?.(toolId);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={position ? {
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)'
          } : undefined}
          className={`flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
        >
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolClick(tool.id)}
              className={`p-2 rounded ${
                activeTools.includes(tool.id)
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              } transition-colors relative group`}
            >
              {tool.icon}
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {tool.label}
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
