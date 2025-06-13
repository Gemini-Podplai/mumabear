import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'code' | 'location';
  reactions?: { emoji: string; users: string[] }[];
  isTyping?: boolean;
  isRead?: boolean;
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    codeLanguage?: string;
    location?: { lat: number; lng: number; address: string };
    replyTo?: string;
  };
}

interface AIModel {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

interface MessageBubbleProps {
  message: Message;
  model?: AIModel;
  isUser: boolean;
  expressMode: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  model,
  isUser,
  expressMode
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '💯', '🎉'];

  const addReaction = (emoji: string) => {
    console.log('Adding reaction:', emoji);
    setShowReactions(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessageContent = () => {
    if (message.isTyping) {
      return <TypingIndicator />;
    }

    switch (message.type) {
      case 'text':
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        );

      case 'code':
        return (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-700 text-xs">
              <span className="text-gray-300 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>{message.metadata?.codeLanguage || 'Code'}</span>
              </span>
              <motion.button
                className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded text-xs"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigator.clipboard.writeText(message.content)}
              >
                Copy
              </motion.button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto text-gray-100">
              <code>{message.content}</code>
            </pre>
          </div>
        );

      case 'image':
        return (
          <div className="relative group">
            <motion.img
              src={message.metadata?.fileUrl}
              alt="Shared image"
              className="max-w-xs rounded-lg cursor-pointer shadow-lg"
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                // Open in modal/lightbox
                console.log('Open image in modal');
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
          </div>
        );

      case 'file':
        return (
          <motion.div
            className="bg-gray-700 rounded-lg p-4 border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              // Download file
              const link = document.createElement('a');
              link.href = message.metadata?.fileUrl || '';
              link.download = message.metadata?.fileName || 'download';
              link.click();
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {message.metadata?.fileName || 'Unknown file'}
                </p>
                <p className="text-sm text-gray-400">
                  {message.metadata?.fileSize ? formatFileSize(message.metadata.fileSize) : 'Unknown size'}
                </p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        );

      case 'audio':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg min-w-[200px]">
            <motion.button
              className={`p-2 rounded-full ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </motion.button>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-1 bg-gray-600 rounded-full">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: '30%' }}
                    animate={{ width: isPlaying ? ['30%', '80%', '30%'] : '30%' }}
                    transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {message.metadata?.duration ? formatDuration(message.metadata.duration) : '0:00'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative group">
            <video
              src={message.metadata?.fileUrl}
              className="max-w-xs rounded-lg shadow-lg"
              controls
              poster={message.metadata?.fileUrl} // Thumbnail
            />
          </div>
        );

      case 'location':
        return (
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">
                  {message.metadata?.location?.address || 'Location'}
                </p>
                <p className="text-sm text-gray-400">
                  {message.metadata?.location?.lat}, {message.metadata?.location?.lng}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-400">Unsupported message type</div>;
    }
  };

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: expressMode ? 0.2 : 0.4 }}
      layout
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <div className={`flex items-end space-x-2 max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar for AI models */}
        {!isUser && model && (
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-lg"
            style={{ backgroundColor: model.color }}
            whileHover={{ scale: 1.1 }}
          >
            {model.avatar || model.name.slice(0, 2).toUpperCase()}
          </motion.div>
        )}

        <div className="relative">
          {/* Message bubble */}
          <motion.div
            className={`px-4 py-3 rounded-2xl relative shadow-lg ${
              isUser
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                : 'bg-gray-700 text-white rounded-bl-md border border-gray-600'
            } ${message.isTyping ? 'animate-pulse' : ''}`}
            whileHover={{ y: -1 }}
          >
            {renderMessageContent()}

            {/* Timestamp and read status */}
            <div className={`text-xs mt-2 flex items-center space-x-1 ${
              isUser ? 'text-blue-100 justify-end' : 'text-gray-400'
            }`}>
              <span>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {isUser && (
                <span className="text-xs">
                  {message.isRead ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </motion.div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex space-x-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 rounded-full px-2 py-1 text-xs flex items-center space-x-1 border border-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-400">{reaction.users.length}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reaction picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                className="absolute bottom-0 left-0 bg-gray-800 rounded-lg p-2 flex space-x-2 shadow-lg border border-gray-700 z-10"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {commonReactions.map(emoji => (
                  <motion.button
                    key={emoji}
                    className="p-1 hover:bg-gray-700 rounded text-lg"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addReaction(emoji)}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className={`flex space-x-1 ${isUser ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, x: isUser ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isUser ? 10 : -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className="p-1 hover:bg-gray-700 rounded"
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowReactions(!showReactions)}
              >
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                </svg>
              </motion.button>

              <motion.button
                className="p-1 hover:bg-gray-700 rounded"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  // Reply functionality
                  console.log('Reply to message:', message.id);
                }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.button>

              <motion.button
                className="p-1 hover:bg-gray-700 rounded"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  // Forward functionality
                  console.log('Forward message:', message.id);
                }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          y: [0, -8, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
);

export default MessageBubble;
