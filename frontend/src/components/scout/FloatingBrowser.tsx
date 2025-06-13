import { ArrowsPointingInIcon, ArrowsPointingOutIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface FloatingBrowserProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    isShared?: boolean;
}

export const FloatingBrowser: React.FC<FloatingBrowserProps> = ({ isOpen, onClose, url, isShared = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(url);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setCurrentUrl(url);
    }, [url]);

    const browserVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            y: 50,
            scale: 0.9,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={browserVariants}
                    className={`
                        fixed bottom-4 right-4 bg-gray-900 rounded-lg shadow-2xl
                        border border-gray-700 overflow-hidden z-40
                        ${isExpanded ? 'w-[1200px] h-[800px]' : 'w-[600px] h-[400px]'}
                    `}
                    drag
                    dragConstraints={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }}
                    dragElastic={0.1}
                >
                    {/* Browser Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center flex-1 max-w-2xl">
                            <div className="flex items-center space-x-2 mr-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <input
                                type="text"
                                value={currentUrl}
                                onChange={(e) => setCurrentUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setIsLoading(true);
                                        // Handle URL navigation
                                    }
                                }}
                                className="flex-1 bg-gray-700 text-white px-3 py-1 rounded text-sm"
                            />
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                            {isShared && (
                                <div className="flex items-center space-x-1 text-green-400 text-sm px-2 py-1 bg-green-400/10 rounded">
                                    <ShareIcon className="w-4 h-4" />
                                    <span>Shared</span>
                                </div>
                            )}
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 hover:bg-gray-700 rounded"
                            >
                                {isExpanded ? (
                                    <ArrowsPointingInIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ArrowsPointingOutIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-700 rounded"
                            >
                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Browser Content */}
                    <div className="w-full h-[calc(100%-40px)] bg-white">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        )}
                        <iframe
                            src={currentUrl}
                            className="w-full h-full"
                            onLoad={() => setIsLoading(false)}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            title="Preview"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
