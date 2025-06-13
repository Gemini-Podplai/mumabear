import {
    BoltIcon,
    BookOpenIcon,
    ChatBubbleBottomCenterTextIcon,
    ChevronLeftIcon,
    CodeBracketIcon,
    CommandLineIcon,
    CpuChipIcon,
    CursorArrowIcon,
    GlobeAltIcon,
    PaperClipIcon,
    UsersIcon
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { workspaceService } from '../../services/workspaceService';
import {
    BrowserView,
    CollaborativePresence,
    ResearchContext,
    ResearchMessage,
    VirtualMachine
} from '../../types';
import { FileTree } from './FileTree';
import { FloatingBrowser } from './FloatingBrowser';
import { FloatingTerminal } from './FloatingTerminal';

export const CollaborativeWorkspace: React.FC = () => {
    // Research mode state
    const [researchMessages, setResearchMessages] = useState<ResearchMessage[]>([]);
    const [researchContext, setResearchContext] = useState<ResearchContext>({
        documents: [],
        snippets: [],
        aiInsights: [],
        relatedTopics: []
    });
    const [browserViews, setBrowserViews] = useState<BrowserView[]>([]);

    // Development mode state
    const [collaborators, setCollaborators] = useState<CollaborativePresence[]>([]);
    const [virtualMachine, setVirtualMachine] = useState<VirtualMachine | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // UI State
    const [mode, setMode] = useState<'research' | 'development'>('research');
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isBrowserOpen, setIsBrowserOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [currentUrl, setCurrentUrl] = useState('');

    // Refs and Controls
    const workspaceRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();

    // Development Mode UI
    const renderDevelopmentMode = () => (
        <motion.div
            className="flex h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* File Explorer */}
            <div className="w-64 bg-gray-900 border-r border-gray-700">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="font-semibold text-white">Files</h2>
                </div>
                <FileTree
                    initialData={[]}
                    onFileSelect={() => { }}
                    onFileShare={() => { }}
                />
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col">
                {/* Tabs */}
                <div className="flex items-center p-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-lg">
                        <CodeBracketIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white">main.ts</span>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 bg-gray-900">
                    {/* Monaco Editor will be integrated here */}
                </div>
            </div>

            {/* Tool Panel */}
            <div className="w-80 bg-gray-900 border-l border-gray-700">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="font-semibold text-white">Tools & Documentation</h2>
                </div>
                <div className="p-4">
                    {/* Tool content */}
                </div>
            </div>
        </motion.div>
    );

    // Handle cursor movement sharing
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!workspaceRef.current) return;
            const rect = workspaceRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            workspaceService.updateCollaboratorPosition({ x, y });
        };

        if (mode === 'development') {
            workspaceRef.current?.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            workspaceRef.current?.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mode]);

    // Handle collaborative presence
    useEffect(() => {
        let cleanup = () => { };

        if (workspaceService.onCollaboratorUpdate) {
            cleanup = workspaceService.onCollaboratorUpdate((collaborators) => {
                setCollaborators(collaborators);
            });
        }

        return cleanup;
    }, []);

    // Transition to development mode
    const transitionToDevelopment = async () => {
        setIsTransitioning(true);

        // Animate current UI elements away
        await controls.start({
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.5 }
        });

        // Start virtual machine
        try {
            const vm = await workspaceService.startVirtualMachine();
            setVirtualMachine(vm);
            setMode('development');

            // Animate in development UI
            await controls.start({
                opacity: 1,
                scale: 1,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }
            });
        } catch (error) {
            console.error('Failed to start virtual machine:', error);
        }

        setIsTransitioning(false);
    };

    // Research Mode UI
    const renderResearchMode = () => (
        <motion.div
            className="flex h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Research Chat/Context Panel */}
            <motion.div
                className={`flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300
                    ${isChatOpen ? 'w-1/2' : 'w-0'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-purple-400" />
                        <h2 className="font-semibold text-white">Research & Planning</h2>
                    </div>
                    <button
                        onClick={() => setIsChatOpen(prev => !prev)}
                        className="p-2 hover:bg-gray-700 rounded"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Research Context */}
                <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Research Context</span>
                        <span className="text-xs text-gray-500">{researchContext.documents.length} sources</span>
                    </div>
                    <div className="space-y-2">
                        {researchContext.snippets.map((snippet, i) => (
                            <div key={i} className="text-sm bg-gray-800 rounded p-2">
                                <p className="text-gray-300">{snippet.text}</p>
                                <span className="text-xs text-gray-500">{snippet.source}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {researchMessages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-purple-600' : 'bg-gray-800'
                                }`}>
                                <p className="text-white">{message.content}</p>
                                {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {message.attachments.map((attachment, i) => (
                                            <div key={i} className="flex items-center space-x-2 text-sm text-gray-300">
                                                <PaperClipIcon className="w-4 h-4" />
                                                <a href={attachment.url} className="hover:underline">{attachment.title || 'Attachment'}</a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-2 text-xs text-gray-400">
                                        Sources: {message.sources.join(', ')}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex space-x-2 mb-2">
                        <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                            <PaperClipIcon className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                            <BookOpenIcon className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <textarea
                            className="flex-1 bg-gray-800 rounded p-2 text-white resize-none"
                            placeholder="Ask a research question..."
                            rows={3}
                        />
                        <button className="p-2 bg-purple-600 rounded hover:bg-purple-700">
                            <BoltIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Browser/Preview Area */}
            <div className="flex-1 flex flex-col">
                {/* Browser Tabs */}
                <div className="flex items-center p-2 bg-gray-800 border-b border-gray-700">
                    {browserViews.map(view => (
                        <div
                            key={view.id}
                            className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-lg mr-2"
                        >
                            <GlobeAltIcon className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-white">{view.title}</span>
                            {view.shared && (
                                <UsersIcon className="w-4 h-4 text-green-400" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Browser Content */}
                <div className="flex-1 bg-white">
                    <iframe
                        src={currentUrl}
                        className="w-full h-full border-none"
                        title="Collaborative Browser"
                    />
                </div>
            </div>
        </motion.div>
    );

    // Render workspace
    return (
        <div ref={workspaceRef} className="fixed inset-0 bg-gray-900 text-white">
            {/* Mode Transition Button */}
            {mode === 'research' && !isTransitioning && (
                <motion.button
                    className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg
                             shadow-lg flex items-center space-x-2 hover:bg-purple-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={transitionToDevelopment}
                >
                    <CpuChipIcon className="w-5 h-5" />
                    <span>Start Virtual Development</span>
                </motion.button>
            )}

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {mode === 'research' ? renderResearchMode() : renderDevelopmentMode()}
            </AnimatePresence>

            {/* Floating Components */}
            <FloatingTerminal
                isOpen={isTerminalOpen}
                onClose={() => setIsTerminalOpen(false)}
                taskId={virtualMachine?.id}
            />

            <FloatingBrowser
                isOpen={isBrowserOpen}
                onClose={() => setIsBrowserOpen(false)}
                url={currentUrl}
                isShared={true}
            />

            {/* Collaborator Cursors */}
            {collaborators.map((collaborator) => (
                collaborator.cursor && (
                    <motion.div
                        key={collaborator.id}
                        className="absolute pointer-events-none"
                        animate={{
                            left: `${collaborator.cursor.x}%`,
                            top: `${collaborator.cursor.y}%`
                        }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="relative">
                            <CursorArrowIcon
                                className="w-6 h-6"
                                style={{ color: collaborator.color }}
                            />
                            <span
                                className="absolute left-5 top-0 px-2 py-1 rounded text-xs text-white"
                                style={{ backgroundColor: collaborator.color }}
                            >
                                {collaborator.name}
                            </span>
                        </div>
                    </motion.div>
                )
            ))}

            {/* Quick Access Tools */}
            <motion.div
                className="fixed bottom-4 left-4 flex space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTerminalOpen(true)}
                    className="p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700"
                >
                    <CommandLineIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBrowserOpen(true)}
                    className="p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700"
                >
                    <GlobeAltIcon className="w-5 h-5" />
                </motion.button>
            </motion.div>
        </div>
    );
};
