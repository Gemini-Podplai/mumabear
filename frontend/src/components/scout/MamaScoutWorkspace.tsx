import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, CommandLineIcon, ComputerDesktopIcon, DocumentIcon, EyeIcon, FolderIcon, PlusIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion, useAnimationControls, Variants } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { workspaceService } from '../../services/workspaceService';
import { FilePreview } from './FilePreview';
import { FileTree } from './FileTree';
import { FileUpload } from './FileUpload';
import { FloatingBrowser } from './FloatingBrowser';
import { FloatingTerminal } from './FloatingTerminal';

// Animation variants for the workspace transitions
const landingVariants: Variants = {
    initial: {
        scale: 0.9,
        opacity: 0
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.01, -0.05, 0.95]
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: {
            duration: 0.5
        }
    }
};

const workspaceVariants: Variants = {
    initial: {
        opacity: 0,
        y: 50
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    }
};

const sidebarVariants: Variants = {
    open: (width: number) => ({
        width: width,
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    }),
    closed: {
        width: 0,
        opacity: 0,
        x: -20,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    }
};

const timelineItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3
        }
    }
};

interface TimelineEvent {
    id: string;
    type: 'web' | 'terminal' | 'code' | 'file';
    description: string;
    timestamp: number;
    details?: string;
}

interface Task {
    id: string;
    title: string;
    status: 'running' | 'completed' | 'error';
    progress: number;
    startTime: number;
    endTime?: number;
}

export const MamaScoutWorkspace: React.FC = () => {
    // State for the workspace view
    const [view, setView] = useState<'landing' | 'planning' | 'workspace'>('landing');
    const [leftSidebarWidth, setLeftSidebarWidth] = useState(300);
    const [rightSidebarWidth, setRightSidebarWidth] = useState(400);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'files' | 'timeline' | 'preview'>('files');
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<string | null>(null);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isBrowserOpen, setIsBrowserOpen] = useState(false);
    const [browserUrl, setBrowserUrl] = useState('');
    const [isBrowserShared, setIsBrowserShared] = useState(false);
    const [filePreview, setFilePreview] = useState<{
        path: string;
        content: string;
        position: { x: number; y: number };
    } | null>(null);

    // Animation controls
    const controls = useAnimationControls();
    const timelineRef = useRef<HTMLDivElement>(null);

    // Handle the initial landing page animation
    const handleStart = async () => {
        await controls.start("exit");
        setView('planning');
    };

    // Handle resizing sidebars
    const handleLeftSidebarResize = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = leftSidebarWidth;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(200, Math.min(600, startWidth + (e.clientX - startX)));
            setLeftSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Similar handler for right sidebar...
    const handleRightSidebarResize = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = rightSidebarWidth;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(200, Math.min(600, startWidth - (e.clientX - startX)));
            setRightSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Add a new timeline event
    const addTimelineEvent = (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
        const newEvent = {
            ...event,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
        };
        setEvents(prev => [newEvent, ...prev]);
    };

    // Update task progress
    const updateTaskProgress = (taskId: string, progress: number) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, progress, status: progress === 100 ? 'completed' : 'running' }
                : task
        ));
    };

    const handleFilePreview = (path: string, content: string, event: { clientX: number; clientY: number }) => {
        setFilePreview({
            path,
            content,
            position: { x: event.clientX, y: event.clientY }
        });
    };

    // Render the landing page
    const renderLanding = () => (
        <motion.div
            variants={landingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900"
        >
            <div className="text-center text-white">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-6xl mb-6"
                >
                    🐻
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold mb-4"
                >
                    MamaBear Scout
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl mb-8 text-purple-200"
                >
                    Your autonomous research and development companion
                </motion.p>
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStart}
                    className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-purple-100 transition-colors"
                >
                    Let's Begin
                </motion.button>
            </div>
        </motion.div>
    );

    // Render the workspace view
    const renderWorkspace = () => (
        <motion.div
            variants={workspaceVariants}
            initial="initial"
            animate="animate"
            className="fixed inset-0 bg-gray-900 text-white flex overflow-hidden"
        >
            {/* Left Sidebar */}
            <motion.div
                variants={sidebarVariants}
                initial={false}
                animate={isLeftSidebarOpen ? { width: leftSidebarWidth } : "closed"}
                className="bg-gray-800 border-r border-gray-700 flex flex-col"
            >
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="font-semibold">File Explorer</h2>
                    <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                            <PlusIcon className="w-5 h-5" />
                        </button>
                        <button
                            className="p-1 hover:bg-gray-700 rounded"
                            onClick={() => setIsLeftSidebarOpen(false)}
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <FileTree
                        initialData={[]} // You'll need to populate this with real data
                        onFileSelect={(path) => {
                            // Open file in editor
                            const fileName = path.split('/').pop();
                            if (fileName) {
                                setActiveTab(fileName);
                                if (!tabs.includes(fileName)) {
                                    setTabs([...tabs, fileName]);
                                }
                            }
                        }}
                        onFileShare={async (path) => {
                            try {
                                const shareUrl = await workspaceService.shareFile(path);
                                // Show in browser
                                setBrowserUrl(shareUrl);
                                setIsBrowserShared(true);
                                setIsBrowserOpen(true);
                            } catch (error) {
                                console.error('Failed to share file:', error);
                            }
                        }}
                        onFilePreview={async (path, content, event) => {
                            handleFilePreview(path, content, event);
                        }}
                    />
                    <FileUpload
                        targetPath=""
                        onComplete={() => {
                            // Refresh file tree
                            // You'll need to implement this
                        }}
                    />
                    <AnimatePresence>
                        {filePreview && (
                            <FilePreview
                                filePath={filePreview.path}
                                content={filePreview.content}
                                position={filePreview.position}
                                onClose={() => setFilePreview(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>
                <div
                    className="absolute right-0 h-full w-1 cursor-col-resize"
                    onMouseDown={handleLeftSidebarResize}
                />
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        {!isLeftSidebarOpen && (
                            <button
                                className="p-1 hover:bg-gray-700 rounded"
                                onClick={() => setIsLeftSidebarOpen(true)}
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        )}
                        <h1 className="text-xl font-semibold">MamaBear Scout Workspace</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {activeTask && (
                            <div className="flex items-center space-x-2">
                                <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full" />
                                <span className="text-sm text-green-400">Task in progress...</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    {/* Main content will go here */}
                </div>
            </div>

            {/* Right Sidebar */}
            <motion.div
                variants={sidebarVariants}
                initial={false}
                animate={isRightSidebarOpen ? { width: rightSidebarWidth } : "closed"}
                className="bg-gray-800 border-l border-gray-700 flex flex-col"
            >
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setSelectedTab('timeline')}
                            className={`p-2 rounded ${selectedTab === 'timeline' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                        >
                            <ClockIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setSelectedTab('preview')}
                            className={`p-2 rounded ${selectedTab === 'preview' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        className="p-1 hover:bg-gray-700 rounded"
                        onClick={() => setIsRightSidebarOpen(false)}
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-auto">
                    {selectedTab === 'timeline' && (
                        <div className="p-4 space-y-4">
                            <AnimatePresence>
                                {events.map(event => (
                                    <motion.div
                                        key={event.id}
                                        variants={timelineItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="flex items-start space-x-3 p-3 bg-gray-700 rounded"
                                    >
                                        <div className="mt-1">
                                            {event.type === 'web' && <ComputerDesktopIcon className="w-5 h-5 text-blue-400" />}
                                            {event.type === 'terminal' && <DocumentIcon className="w-5 h-5 text-green-400" />}
                                            {event.type === 'code' && <DocumentIcon className="w-5 h-5 text-purple-400" />}
                                            {event.type === 'file' && <FolderIcon className="w-5 h-5 text-yellow-400" />}
                                        </div>
                                        <div>
                                            <p className="text-sm">{event.description}</p>
                                            {event.details && (
                                                <p className="text-xs text-gray-400 mt-1">{event.details}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                    {selectedTab === 'preview' && (
                        <div className="p-4">
                            {/* Preview content will go here */}
                        </div>
                    )}
                </div>
                <div
                    className="absolute left-0 h-full w-1 cursor-col-resize"
                    onMouseDown={handleRightSidebarResize}
                />
            </motion.div>

            {/* Floating Terminal */}
            {isTerminalOpen && (
                <FloatingTerminal
                    onClose={() => setIsTerminalOpen(false)}
                    onCommandExecute={(command) => {
                        // Handle command execution
                    }}
                />
            )}

            {/* Floating Browser */}
            {isBrowserOpen && (
                <FloatingBrowser
                    url={browserUrl}
                    onUrlChange={setBrowserUrl}
                    onShareToggle={() => setIsBrowserShared(prev => !prev)}
                    onClose={() => setIsBrowserOpen(false)}
                    isShared={isBrowserShared}
                />
            )}

            {/* File Preview Component */}
            {filePreview && (
                <FilePreview
                    path={filePreview.path}
                    content={filePreview.content}
                    position={filePreview.position}
                    onClose={() => setFilePreview(null)}
                />
            )}
        </motion.div>
    );

    return (
        <>
            <AnimatePresence mode="wait">
                {view === 'landing' && renderLanding()}
                {view === 'workspace' && renderWorkspace()}
            </AnimatePresence>

            {/* Floating Terminal */}
            <FloatingTerminal
                isOpen={isTerminalOpen}
                onClose={() => setIsTerminalOpen(false)}
                taskId={activeTask}
            />

            {/* Floating Browser */}
            <FloatingBrowser
                isOpen={isBrowserOpen}
                onClose={() => setIsBrowserOpen(false)}
                url={browserUrl}
                isShared={isBrowserShared}
            />

            {/* Quick Action Buttons */}
            <motion.div
                className="fixed bottom-4 left-4 flex space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTerminalOpen(true)}
                    className="p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700"
                >
                    <CommandLineIcon className="w-5 h-5 text-white" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setBrowserUrl('http://localhost:3000');
                        setIsBrowserOpen(true);
                    }}
                    className="p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700"
                >
                    <ComputerDesktopIcon className="w-5 h-5 text-white" />
                </motion.button>
            </motion.div>
        </>
    );
};
