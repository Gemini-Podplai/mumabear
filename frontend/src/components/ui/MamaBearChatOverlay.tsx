import { ChevronLeftIcon, ChevronRightIcon, QrCodeIcon, FolderIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion, useAnimationControls, type Variants } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000');

interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'mama-bear';
    timestamp: number;
}

interface FileTreeItem {
    name: string;
    type: 'file' | 'directory';
    children?: FileTreeItem[];
}

const mockFileTree: FileTreeItem[] = [
    {
        name: 'src',
        type: 'directory',
        children: [
            {
                name: 'components', type: 'directory', children: [
                    {
                        name: 'ui', type: 'directory', children: [
                            { name: 'Button.tsx', type: 'file' },
                            { name: 'Input.tsx', type: 'file' },
                            { name: 'Card.tsx', type: 'file' }
                        ]
                    },
                    {
                        name: 'layout', type: 'directory', children: [
                            { name: 'Sidebar.tsx', type: 'file' },
                            { name: 'Header.tsx', type: 'file' }
                        ]
                    }
                ]
            },
            { name: 'App.tsx', type: 'file' },
            { name: 'main.tsx', type: 'file' }
        ]
    },
    {
        name: 'public',
        type: 'directory',
        children: [
            { name: 'index.html', type: 'file' },
            { name: 'favicon.ico', type: 'file' }
        ]
    }
];

const terminalLogs = [
    "Starting development server...",
    "Compiling...",
    "✓ Compiled successfully",
    "Server running at http://localhost:3000"
];

// Animation variants
const overlayVariants: Variants = {
    chat: {
        width: '100%',
        maxWidth: '28rem',  // 448px
        height: 'auto',
        borderRadius: '1rem',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4
        }
    },
    workspace: {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        borderRadius: '0.5rem',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4
        }
    },
    exit: {
        opacity: 0,
        y: 40,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

const sidebarVariants: Variants = {
    open: {
        x: 0,
        opacity: 1,
        width: '20%',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    },
    closed: {
        x: -20,
        opacity: 0,
        width: 0,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30
        }
    }
};

const rightSidebarVariants: Variants = {
    open: {
        x: 0,
        opacity: 1,
        width: '30%',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    },
    closed: {
        x: 20,
        opacity: 0,
        width: 0,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30
        }
    }
};

// Terminal animation staggered effect
const terminalLineVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.5
        }
    })
};

// File tree animation variants
const fileTreeItemVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: {
            duration: 0.3,
            when: "beforeChildren",
            staggerChildren: 0.05
        }
    }
};

export const MamaBearChatOverlay: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [audio, setAudio] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);
    const [uploading, setUploading] = useState(false);
    const [workspaceMode, setWorkspaceMode] = useState(false);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [tabs, setTabs] = useState<string[]>([]);
    const [currentTheme, setCurrentTheme] = useState<string>('default');

    // Animation controls
    const leftSidebarControls = useAnimationControls();
    const rightSidebarControls = useAnimationControls();
    const chatControls = useAnimationControls();

    // Theme options
    const themes = {
        default: 'bg-gradient-to-br from-gray-900 to-gray-800',
        purple: 'bg-gradient-to-br from-purple-900 to-indigo-800',
        ocean: 'bg-gradient-to-br from-blue-900 to-cyan-800',
        forest: 'bg-gradient-to-br from-green-900 to-emerald-800',
        sunset: 'bg-gradient-to-br from-red-900 to-amber-800',
        galaxy: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-black to-blue-900',
        furry: 'bg-gradient-to-br from-amber-700 to-yellow-600 border-2 border-amber-500'
    };

    useEffect(() => {
        if (!open) return;
        // Join Mama Bear room for real-time updates
        socket.emit('join_mama_bear', { user_id: 'default_user' });
        socket.on('mama_bear_response', (msg: { response: { content: string } }) => {
            let content = '';
            if (typeof msg.response === 'string') {
                content = msg.response;
            } else if (msg.response && typeof msg.response.content === 'string') {
                content = msg.response.content;
            }
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), content, sender: 'mama-bear', timestamp: Date.now() },
            ]);
            setIsTyping(false);
        });
        socket.on('mama_bear_thinking', () => setIsTyping(true));
        return () => {
            socket.emit('leave_mama_bear', { user_id: 'default_user' });
            socket.off('mama_bear_response');
            socket.off('mama_bear_thinking');
        };
    }, [open]);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    // Toggle workspace mode with animation
    const toggleWorkspaceMode = async () => {
        if (workspaceMode) {
            // Closing workspace, first close sidebars
            await Promise.all([
                leftSidebarControls.start('closed'),
                rightSidebarControls.start('closed')
            ]);
            // Then shrink the main container
            await chatControls.start('chat');
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
        } else {
            // Opening workspace, first expand the main container
            await chatControls.start('workspace');
            // Then open sidebars
            setLeftSidebarOpen(true);
            setRightSidebarOpen(true);
            await Promise.all([
                leftSidebarControls.start('open'),
                rightSidebarControls.start('open')
            ]);
        }
        setWorkspaceMode(!workspaceMode);
    };

    // Toggle individual sidebars
    const toggleLeftSidebar = () => {
        if (leftSidebarOpen) {
            leftSidebarControls.start('closed');
        } else {
            leftSidebarControls.start('open');
        }
        setLeftSidebarOpen(!leftSidebarOpen);
    };

    const toggleRightSidebar = () => {
        if (rightSidebarOpen) {
            rightSidebarControls.start('closed');
        } else {
            rightSidebarControls.start('open');
        }
        setRightSidebarOpen(!rightSidebarOpen);
    };

    // Toggle folder expansion in file tree
    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };

    // Open a file in the editor
    const openFile = (filename: string) => {
        if (!tabs.includes(filename)) {
            setTabs([...tabs, filename]);
        }
        setActiveTab(filename);
    };

    // Close a tab
    const closeTab = (e: React.MouseEvent, filename: string) => {
        e.stopPropagation();
        const newTabs = tabs.filter(tab => tab !== filename);
        setTabs(newTabs);
        if (activeTab === filename) {
            setActiveTab(newTabs.length > 0 ? newTabs[0] : null);
        }
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Handle audio selection
    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudio(e.target.files[0]);
        }
    };

    // Handle video selection
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    // Handle RAG/web search (simple demo: prompt for query)
    const handleRAGSearch = async () => {
        const query = prompt('Enter your research/web search query:');
        if (query && query.trim()) {
            setIsTyping(true);
            socket.emit('mama_bear_chat', {
                message: '',
                user_id: 'default_user',
                page_context: 'main_chat',
                rag_query: query.trim(),
            });
        }
    };

    // Updated sendMessage for multimodal (text, file, image, audio, video)
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !file && !image && !audio && !video) return;
        const msg: ChatMessage = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, msg]);
        setInput('');
        setIsTyping(true);
        // Helper to send with base64
        const sendWithBase64 = (type: 'file' | 'image' | 'audio' | 'video', fileObj: File) => {
            setUploading(true);
            const reader = new FileReader();
            reader.onload = () => {
                socket.emit('mama_bear_chat', {
                    message: input,
                    user_id: 'default_user',
                    page_context: 'main_chat',
                    [type]: {
                        name: fileObj.name,
                        fileType: fileObj.type,
                        data: reader.result,
                    },
                });
                setUploading(false);
                if (type === 'file') setFile(null);
                if (type === 'image') setImage(null);
                if (type === 'audio') setAudio(null);
                if (type === 'video') setVideo(null);
            };
            reader.readAsDataURL(fileObj);
        };
        if (file) return sendWithBase64('file', file);
        if (image) return sendWithBase64('image', image);
        if (audio) return sendWithBase64('audio', audio);
        if (video) return sendWithBase64('video', video);
        socket.emit('mama_bear_chat', {
            message: msg.content,
            user_id: 'default_user',
            page_context: 'main_chat',
        });
    };

    // Drag-and-drop support for files/images/audio/video
    useEffect(() => {
        const dropArea = dropRef.current;
        if (!dropArea) return;
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            dropArea.classList.add('ring-2', 'ring-purple-400');
        };
        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            dropArea.classList.remove('ring-2', 'ring-purple-400');
        };
        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            dropArea.classList.remove('ring-2', 'ring-purple-400');
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) setImage(file);
                else if (file.type.startsWith('audio/')) setAudio(file);
                else if (file.type.startsWith('video/')) setVideo(file);
                else setFile(file);
            }
        };
        dropArea.addEventListener('dragover', handleDragOver);
        dropArea.addEventListener('dragleave', handleDragLeave);
        dropArea.addEventListener('drop', handleDrop);
        return () => {
            dropArea.removeEventListener('dragover', handleDragOver);
            dropArea.removeEventListener('dragleave', handleDragLeave);
            dropArea.removeEventListener('drop', handleDrop);
        };
    }, []);

    // Copy-paste image support
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData) {
                const items = e.clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) setImage(file);
                    }
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    // Emoji for each chat message (user/agent)
    const getMessageEmoji = (sender: 'user' | 'mama-bear') => sender === 'user' ? '🧑‍💻' : '🐻';

    // Recursive file tree component
    const renderFileTree = (items: FileTreeItem[], basePath = '') => {
        return items.map((item, index) => {
            const fullPath = `${basePath}/${item.name}`;
            const isExpanded = expandedFolders.has(fullPath);

            if (item.type === 'directory') {
                return (
                    <div key={fullPath} className="ml-2">
                        <div
                            className="flex items-center py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"
                            onClick={() => toggleFolder(fullPath)}
                        >
                            <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="mr-1 text-gray-400"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </motion.div>
                            <FolderIcon className="w-4 h-4 mr-1 text-blue-400" />
                            <span className="text-sm text-gray-300">{item.name}</span>
                        </div>
                        <AnimatePresence>
                            {isExpanded && item.children && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={fileTreeItemVariants}
                                >
                                    {renderFileTree(item.children, fullPath)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            } else {
                return (
                    <div
                        key={fullPath}
                        onClick={() => openFile(item.name)}
                        className={`
                            flex items-center py-1 px-2 ml-6 hover:bg-gray-700 rounded cursor-pointer
                            ${activeTab === item.name ? 'bg-gray-700' : ''}
                        `}
                    >
                        <CodeIcon className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                );
            }
        });
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit="exit"
                    variants={overlayVariants}
                    className="fixed inset-0 bg-black bg-opacity-40 z-[200] flex items-end md:items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        className={`w-full ${workspaceMode ? 'max-w-screen-2xl h-[90vh]' : 'max-w-md'} ${themes[currentTheme as keyof typeof themes]} rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
                        variants={overlayVariants}
                        initial="chat"
                        animate={chatControls}
                    >
                        {/* Main Header */}
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-opacity-90 backdrop-blur-sm">
                            <span className="font-semibold text-lg text-white flex items-center">
                                <span className="mr-2">🐻</span>
                                Mama Bear {workspaceMode ? 'Workspace' : 'Chat'}
                            </span>
                            <div className="flex items-center space-x-2">
                                {/* Theme Selector Dropdown */}
                                <select
                                    value={currentTheme}
                                    onChange={(e) => setCurrentTheme(e.target.value)}
                                    className="bg-gray-700 text-white text-sm rounded px-2 py-1 border-none"
                                >
                                    <option value="default">Default Theme</option>
                                    <option value="purple">Purple Haze</option>
                                    <option value="ocean">Ocean Depths</option>
                                    <option value="forest">Forest Green</option>
                                    <option value="sunset">Sunset Glow</option>
                                    <option value="galaxy">Galaxy</option>
                                    <option value="furry">Furry Gold</option>
                                </select>
                                {/* Workspace Toggle Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleWorkspaceMode}
                                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                    {workspaceMode ? 'Chat Mode' : 'Workspace'}
                                </motion.button>
                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    aria-label="Close chat"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Workspace Layout */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left Sidebar (File Explorer) */}
                            <motion.div
                                initial="closed"
                                animate={leftSidebarControls}
                                variants={sidebarVariants}
                                className="border-r dark:border-gray-700 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex flex-col overflow-hidden"
                            >
                                <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <h3 className="text-sm font-medium text-gray-300">Explorer</h3>
                                    <motion.button
                                        onClick={toggleLeftSidebar}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <ChevronLeftIcon className="w-4 h-4" />
                                    </motion.button>
                                </div>
                                <div className="overflow-y-auto flex-1 p-2">
                                    {renderFileTree(mockFileTree)}
                                </div>
                                {/* Terminal Panel */}
                                <div className="h-1/3 border-t dark:border-gray-700 flex flex-col">
                                    <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                        <h3 className="text-sm font-medium text-gray-300">Terminal</h3>
                                    </div>
                                    <div className="flex-1 bg-black p-2 overflow-y-auto font-mono text-xs text-green-500">
                                        {terminalLogs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                custom={i}
                                                initial="hidden"
                                                animate="visible"
                                                variants={terminalLineVariants}
                                                className="mb-1"
                                            >
                                                $ {log}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Central Content Area */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Tabs (only in workspace mode) */}
                                {workspaceMode && tabs.length > 0 && (
                                    <div className="flex border-b dark:border-gray-700 bg-gray-800 overflow-x-auto">
                                        {tabs.map(tab => (
                                            <div
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`
                                                    flex items-center px-3 py-2 border-r dark:border-gray-700 cursor-pointer
                                                    ${activeTab === tab ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}
                                                `}
                                            >
                                                <span className="text-sm text-gray-300">{tab}</span>
                                                <XMarkIcon
                                                    className="w-4 h-4 ml-2 text-gray-500 hover:text-gray-300"
                                                    onClick={(e) => closeTab(e, tab)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Editor or Chat Content */}
                                {workspaceMode && activeTab ? (
                                    <div className="flex-1 bg-gray-800 p-4 overflow-auto">
                                        <div className="text-gray-300 font-mono">
                                            {/* Mock file content */}
                                            <pre>{`// ${activeTab}
import React from 'react';

export const ${activeTab.replace('.tsx', '')} = () => {
    return (
        <div className="container">
            <h1>Welcome to Podplay Scout Alpha</h1>
            <p>This is a placeholder for ${activeTab}</p>
        </div>
    );
};

export default ${activeTab.replace('.tsx', '')};
`}</pre>
                                        </div>
                                    </div>
                                ) : (
                                    // Chat Messages Area
                                    <div ref={dropRef} className="flex-1 overflow-y-auto p-4 space-y-2" style={{ minHeight: workspaceMode ? 'auto' : 320, maxHeight: workspaceMode ? 'none' : 400 }}>
                                        {messages.map((m) => (
                                            <motion.div
                                                key={m.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`rounded-lg px-4 py-2 max-w-[80%] flex items-center gap-2 ${m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                                                    <span className="text-xl select-none">{getMessageEmoji(m.sender)}</span>
                                                    <span>
                                                        {m.content && m.content.startsWith('data:image') && (
                                                            <img src={m.content} alt="uploaded" className="max-w-xs rounded mb-1" />
                                                        )}
                                                        {m.content && m.content.startsWith('data:audio') && (
                                                            <audio controls src={m.content} className="mb-1" />
                                                        )}
                                                        {m.content && m.content.startsWith('data:video') && (
                                                            <video controls src={m.content} className="max-w-xs mb-1" />
                                                        )}
                                                        {!m.content.startsWith('data:image') && !m.content.startsWith('data:audio') && !m.content.startsWith('data:video') && m.content}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex items-center space-x-2">
                                                <motion.span
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.5, 1, 0.5]
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1.5
                                                    }}
                                                    className="w-2 h-2 bg-purple-400 rounded-full"
                                                />
                                                <span className="text-xs text-gray-500">Mama Bear is thinking...</span>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="flex items-center space-x-2 mt-2">
                                                <motion.span
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.5, 1, 0.5]
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1
                                                    }}
                                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                                />
                                                <span className="text-xs text-blue-500">Uploading...</span>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}

                                {/* Message Input Area */}
                                <form onSubmit={sendMessage} className="flex items-center p-4 border-t dark:border-gray-700 space-x-2">
                                    {/* File upload button */}
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 text-gray-400 hover:text-purple-600"
                                        title="Attach File"
                                        onClick={() => fileInputRef.current?.click()}
                                        aria-label="Attach file"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.656-5.657l-7.07 7.07a6 6 0 108.485 8.485L19 13" /></svg>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                    </motion.button>
                                    {/* Image upload button */}
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 text-gray-400 hover:text-pink-600"
                                        title="Attach Image"
                                        onClick={() => imageInputRef.current?.click()}
                                        aria-label="Attach image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={imageInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                        />
                                    </motion.button>
                                    {/* Audio upload button */}
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 text-gray-400 hover:text-green-600"
                                        title="Attach Audio"
                                        onClick={() => audioInputRef.current?.click()}
                                        aria-label="Attach audio"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="6" height="6" rx="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 15V9a3 3 0 016 0v6a3 3 0 01-6 0z" /></svg>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            ref={audioInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleAudioChange}
                                        />
                                    </motion.button>
                                    {/* Video upload button */}
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 text-gray-400 hover:text-blue-600"
                                        title="Attach Video"
                                        onClick={() => videoInputRef.current?.click()}
                                        aria-label="Attach video"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 9l5 3-5 3V9z" /></svg>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            ref={videoInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleVideoChange}
                                        />
                                    </motion.button>
                                    {/* RAG/Web search button */}
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 text-gray-400 hover:text-purple-600"
                                        title="Web Search / Research"
                                        onClick={handleRAGSearch}
                                        aria-label="Web search"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
                                    </motion.button>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Type your message…"
                                        className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        autoFocus
                                    />
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        aria-label="Send message"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </motion.button>
                                </form>
                            </div>

                            {/* Right Sidebar (Preview / Details) */}
                            <motion.div
                                initial="closed"
                                animate={rightSidebarControls}
                                variants={rightSidebarVariants}
                                className="border-l dark:border-gray-700 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex flex-col"
                            >
                                <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <motion.button
                                        onClick={toggleRightSidebar}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </motion.button>
                                    <h3 className="text-sm font-medium text-gray-300">Preview</h3>
                                </div>
                                <div className="flex-1 p-4 overflow-auto">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                        <div className="p-4 border-b dark:border-gray-700">
                                            <h4 className="font-medium text-gray-800 dark:text-white">File Preview</h4>
                                        </div>
                                        <div className="p-4">
                                            {activeTab ? (
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    Previewing {activeTab}...
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">
                                                    Select a file to preview
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                        <div className="p-4 border-b dark:border-gray-700">
                                            <h4 className="font-medium text-gray-800 dark:text-white">Information</h4>
                                        </div>
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-600 dark:text-gray-400">Status:</div>
                                                <div className="text-gray-800 dark:text-white">Ready</div>

                                                <div className="text-gray-600 dark:text-gray-400">Agent:</div>
                                                <div className="text-gray-800 dark:text-white">Mama Bear</div>

                                                <div className="text-gray-600 dark:text-gray-400">Messages:</div>
                                                <div className="text-gray-800 dark:text-white">{messages.length}</div>

                                                <div className="text-gray-600 dark:text-gray-400">Files open:</div>
                                                <div className="text-gray-800 dark:text-white">{tabs.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Ticker */}
                                <div className="p-2 border-t dark:border-gray-700">
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                            ease: "linear"
                                        }}
                                        className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                    />
                                    <div className="mt-2 text-xs text-gray-400 overflow-hidden whitespace-nowrap">
                                        <motion.span
                                            initial={{ x: "100%" }}
                                            animate={{ x: "-100%" }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 10,
                                                ease: "linear"
                                            }}
                                            className="inline-block"
                                        >
                                            Live agent activity: Processing documents • Analyzing code • Preparing responses • Monitoring environment • Loading tools
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MamaBearChatOverlay;
