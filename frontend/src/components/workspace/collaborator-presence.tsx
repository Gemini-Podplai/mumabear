import { motion, useMotionValue } from 'framer-motion';
import { Mic, MicOff, User, Video, VideoOff, X } from 'lucide-react';
import React, { useEffect } from 'react';

interface CollaboratorPresenceProps {
  collaborator: {
    id: string;
    name: string;
    avatar?: string;
    isTyping?: boolean;
    isSpeaking?: boolean;
    hasVideo?: boolean;
    hasMic?: boolean;
    cursorPosition?: { x: number; y: number };
  };
  className?: string;
  onToggleVideo?: () => void;
  onToggleMic?: () => void;
  onClose?: () => void;
}

export const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({
  collaborator,
  className = '',
  onToggleVideo,
  onToggleMic,
  onClose
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Update position when cursor position changes
  useEffect(() => {
    if (collaborator.cursorPosition) {
      x.set(collaborator.cursorPosition.x);
      y.set(collaborator.cursorPosition.y);
    }
  }, [collaborator.cursorPosition]);

  return (
    <motion.div
      style={{ x, y }}
      transition={{ type: "spring", damping: 20 }}
      className={`fixed pointer-events-none ${className}`}
    >
      {/* Cursor indicator */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-3 h-3 bg-blue-500 rounded-full" />
        <div className="ml-4 bg-blue-500 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
          {collaborator.name}
          {collaborator.isTyping && <span className="ml-2">typing...</span>}
        </div>
      </motion.div>

      {/* Video bubble */}
      <motion.div
        drag
        dragMomentum={false}
        className="fixed bottom-4 right-4 bg-gray-900 rounded-lg overflow-hidden shadow-lg pointer-events-auto"
      >
        <div className="relative w-48">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-white hover:text-red-500"
          >
            <X size={16} />
          </button>

          {/* Video feed or avatar */}
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            {collaborator.hasVideo ? (
              <video autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                {collaborator.avatar ? (
                  <img src={collaborator.avatar} className="w-full h-full rounded-full" />
                ) : (
                  <User size={24} className="text-white" />
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="px-3 py-2 flex items-center gap-2 bg-gray-900/90">
            <span className="text-white text-sm flex-1">{collaborator.name}</span>
            <button
              onClick={onToggleVideo}
              className="p-1.5 hover:bg-gray-700 rounded-full text-gray-300"
            >
              {collaborator.hasVideo ? <Video size={16} /> : <VideoOff size={16} />}
            </button>
            <button
              onClick={onToggleMic}
              className="p-1.5 hover:bg-gray-700 rounded-full text-gray-300"
            >
              {collaborator.hasMic ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
