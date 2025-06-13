import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { io } from 'socket.io-client';
import { useMamaBearChatStore } from '../../state/mamaBearChatStore';

const socket = io('http://localhost:5000'); // Your backend server clearly specified

const MamaBearChatOverlay = () => {
  const { overlayVisible, toggleOverlay } = useMamaBearChatStore();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on('mama_bear_response', (message: string) => {
      setMessages(prev => [...prev.slice(-4), message]); // limit to last 5 messages clearly
    });

    return () => { socket.off('mama_bear_response'); };
  }, []);

  const sendMessage = () => {
    socket.emit('mama_bear_chat', input);
    setMessages(prev => [...prev.slice(-4), input]);
    setInput("");
  };

  return (
    <>
      {overlayVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 right-8 z-50 w-96 rounded-xl bg-neutral-900 p-5 shadow-2xl"
        >
          <XMarkIcon onClick={toggleOverlay} className="absolute top-2 right-2 h-6 w-6 cursor-pointer text-white" />
          <div className="max-h-64 space-y-2 overflow-auto text-white">
            {messages.map((msg, index) => <p key={index}>{msg}</p>)}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              className="flex-grow rounded-l-lg bg-neutral-800 p-2 text-white outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Talk with Mama Bear..."
              aria-label="Your message"
            />
            <button
              onClick={sendMessage}
              className="rounded-r-lg bg-purple-700 px-4 text-white hover:bg-purple-800"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MamaBearChatOverlay;