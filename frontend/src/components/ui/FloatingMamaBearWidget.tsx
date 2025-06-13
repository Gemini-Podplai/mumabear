import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React from 'react';

const FloatingMamaBearWidget: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-purple-700 rounded-full shadow-xl hover:bg-purple-800 z-50"
            onClick={onOpen}
            aria-label="Open Mama Bear Chat"
            role="button"
            aria-haspopup="dialog"
        >
            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-white" aria-hidden="true" />
        </motion.button>
    );
};

export default FloatingMamaBearWidget;
