import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

interface AIModel {
  id: string;
  name: string;
  fullName: string;
  provider: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing' | 'busy';
  lastSeen?: Date;
  personality: string;
  capabilities: string[];
  color: string;
  description: string;
  pricing: 'free' | 'premium' | 'enterprise';
  responseTime: number;
  contextWindow: number;
  languages: string[];
  tier: 'basic' | 'advanced' | 'premium' | 'enterprise';
  specialty: string;
  bio: string;
  isMultimodal: boolean;
  isExpress: boolean;
}

interface Conversation {
  id: string;
  modelId: string;
  modelName: string;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  tags: string[];
  createdAt: Date;
}

interface ChatHeaderProps {
  model: AIModel;
  conversation: Conversation;
  typingUsers: string[];
  expressMode: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  model,
  conversation,
  typingUsers,
  expressMode
}) => {
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'typing': return 'bg-blue-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (typingUsers.includes(model.id)) return 'typing...';
    if (model.status === 'online') return 'online';
    if (model.status === 'busy') return 'busy';
    if (model.lastSeen) return `last seen ${model.lastSeen.toLocaleTimeString()}`;
    return 'offline';
  };

  const getPricingBadge = () => {
    switch (model.pricing) {
      case 'free': return { text: 'Free', color: 'bg-green-600' };
      case 'premium': return { text: 'Premium', color: 'bg-blue-600' };
      case 'enterprise': return { text: 'Enterprise', color: 'bg-purple-600' };
      default: return null;
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  return (
    <div className="p-4 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between">
        {/* Model Info */}
        <div className="flex items-center space-x-3">
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModelInfo(!showModelInfo)}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
              style={{ backgroundColor: model.color }}
            >
              {model.avatar || model.name.slice(0, 2).toUpperCase()}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(model.status)}`} />
            {model.isExpress && (
              <div className="absolute -top-1 -right-1 text-yellow-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-white text-lg">{model.name}</h2>
              {getPricingBadge() && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPricingBadge()!.color}`}>
                  {getPricingBadge()!.text}
                </span>
              )}
              {model.isMultimodal && (
                <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                  Multimodal
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 flex items-center space-x-1">
              <span>{getStatusText()}</span>
              <span>•</span>
              <span>{model.provider}</span>
              {model.responseTime && (
                <>
                  <span>•</span>
                  <span>{formatResponseTime(model.responseTime)}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Video Call */}
          <motion.button
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => console.log('Start video call')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </motion.button>

          {/* Voice Call */}
          <motion.button
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => console.log('Start voice call')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </motion.button>

          {/* More Actions */}
          <div className="relative">
            <motion.button
              className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowActions(!showActions)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </motion.button>

            {/* Actions Dropdown */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 min-w-[200px] z-10"
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: expressMode ? 0.1 : 0.2 }}
                >
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{conversation.isPinned ? 'Unpin' : 'Pin'} Conversation</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{conversation.isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>Clear Chat History</span>
                  </button>
                  <hr className="my-2 border-gray-700" />
                  <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Archive Conversation</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Model Details Expansion */}
      <AnimatePresence>
        {showModelInfo && (
          <motion.div
            className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: expressMode ? 0.2 : 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model Bio */}
              <div>
                <h4 className="font-medium text-white mb-2">About {model.name}</h4>
                <p className="text-sm text-gray-300 mb-3">{model.bio}</p>
                <p className="text-xs text-gray-400">{model.description}</p>
              </div>

              {/* Technical Specs */}
              <div>
                <h4 className="font-medium text-white mb-2">Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Context Window:</span>
                    <span className="text-white">{formatContextWindow(model.contextWindow)} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time:</span>
                    <span className="text-white">{formatResponseTime(model.responseTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tier:</span>
                    <span className="text-white capitalize">{model.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Languages:</span>
                    <span className="text-white">{model.languages.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="mt-4">
              <h4 className="font-medium text-white mb-2">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {model.capabilities.map((capability, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs"
                  >
                    {capability.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Specialty */}
            <div className="mt-4">
              <h4 className="font-medium text-white mb-2">Specialty</h4>
              <p className="text-sm text-gray-300">{model.specialty}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHeader;
