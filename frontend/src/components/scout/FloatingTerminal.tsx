import { ArrowsPointingInIcon, ArrowsPointingOutIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { workspaceService } from '../../services/workspaceService';

interface FloatingTerminalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId?: string;
}

export const FloatingTerminal: React.FC<FloatingTerminalProps> = ({ isOpen, onClose, taskId }) => {
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState<{ command: string; output: string }[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new output is added
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input when terminal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim()) return;

        try {
            const output = await workspaceService.executeCommand(command);
            setHistory(prev => [...prev, { command, output }]);
            setCommand('');
        } catch (error) {
            setHistory(prev => [...prev, {
                command,
                output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }]);
        }
    };

    const terminalVariants = {
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
                    variants={terminalVariants}
                    className={`
                        fixed bottom-4 right-4 bg-gray-900 rounded-lg shadow-2xl
                        border border-gray-700 overflow-hidden z-50
                        ${isExpanded ? 'w-[800px] h-[600px]' : 'w-[500px] h-[300px]'}
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
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center space-x-2">
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

                    {/* Terminal Output */}
                    <div
                        ref={terminalRef}
                        className="flex-1 overflow-auto p-4 font-mono text-sm text-green-400"
                        style={{ height: 'calc(100% - 88px)' }}
                    >
                        {history.map((item, index) => (
                            <div key={index} className="mb-2">
                                <div className="flex items-center text-gray-400">
                                    <span className="text-purple-400">$</span>
                                    <span className="ml-2">{item.command}</span>
                                </div>
                                <div className="mt-1 whitespace-pre-wrap">{item.output}</div>
                            </div>
                        ))}
                    </div>

                    {/* Command Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center px-4 py-2 bg-gray-800 border-t border-gray-700"
                    >
                        <span className="text-purple-400 mr-2">$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            className="flex-1 bg-transparent text-green-400 focus:outline-none font-mono"
                            placeholder="Enter command..."
                        />
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
