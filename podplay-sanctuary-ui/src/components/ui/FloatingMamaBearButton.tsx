import React from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { useMamaBearChatStore } from '../../state/mamaBearChatStore';

export const FloatingMamaBearButton = () => {
  const toggleChatOverlay = useMamaBearChatStore((state) => state.toggleOverlay);

  return (
    <button
      onClick={toggleChatOverlay}
      className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl transition-transform hover:scale-105 hover:bg-purple-700"
      aria-label="Chat with Mama Bear"
      draggable="true"
    >
      <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
    </button>
  );
};

export default FloatingMamaBearButton;