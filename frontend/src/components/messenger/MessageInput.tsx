import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'audio' | 'video' | 'code' | 'location', metadata?: any) => void;
  onFileUpload: (files: FileList) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  expressMode: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onFileUpload,
  onStartRecording,
  onStopRecording,
  isRecording,
  expressMode
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const emojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '✨', '🚀'];

  const attachmentOptions = [
    { icon: '📁', label: 'File', action: () => fileInputRef.current?.click() },
    { icon: '🖼️', label: 'Image', action: () => imageInputRef.current?.click() },
    { icon: '📍', label: 'Location', action: () => shareLocation() },
    { icon: '💻', label: 'Code', action: () => insertCodeBlock() },
  ];

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          };
          onSendMessage('📍 Location shared', 'location', { location });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
    setShowAttachments(false);
  };

  const insertCodeBlock = () => {
    const codeTemplate = '```javascript\n// Your code here\n```';
    setMessage(prev => prev + codeTemplate);
    setShowAttachments(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <div className="relative">
          <motion.button
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAttachments(!showAttachments)}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
          </motion.button>

          {/* Attachment Options */}
          <AnimatePresence>
            {showAttachments && (
              <motion.div
                className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: expressMode ? 0.1 : 0.2 }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {attachmentOptions.map((option, index) => (
                    <motion.button
                      key={index}
                      className="flex flex-col items-center p-2 hover:bg-gray-700 rounded-lg text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={option.action}
                    >
                      <span className="text-xl mb-1">{option.icon}</span>
                      <span className="text-xs">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-gray-700 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 min-h-[44px] max-h-[120px]"
            rows={1}
          />

          {/* Emoji Button */}
          <div className="absolute right-3 bottom-3">
            <motion.button
              className="text-gray-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            </motion.button>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-3"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: expressMode ? 0.1 : 0.2 }}
                >
                  <div className="grid grid-cols-6 gap-2">
                    {emojis.map((emoji, index) => (
                      <motion.button
                        key={index}
                        className="p-2 hover:bg-gray-700 rounded text-xl"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                          textareaRef.current?.focus();
                        }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Voice Recording / Send Button */}
        <div className="flex space-x-2">
          {/* Voice Recording Button */}
          <motion.button
            className={`p-2 rounded-lg ${isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isRecording ? onStopRecording : onStartRecording}
          >
            {isRecording ? (
              <motion.svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </motion.svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </motion.button>

          {/* Send Button */}
          <motion.button
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: message.trim() ? 1.1 : 1 }}
            whileTap={{ scale: message.trim() ? 0.9 : 1 }}
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="mt-3 flex items-center justify-center space-x-2 text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm">Recording voice message...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        onChange={(e) => {
          if (e.target.files) {
            onFileUpload(e.target.files);
            setShowAttachments(false);
          }
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        hidden
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            onFileUpload(e.target.files);
            setShowAttachments(false);
          }
        }}
      />
    </div>
  );
};

export default MessageInput;
