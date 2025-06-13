import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { FileOperation } from '../../services/workspaceService';
import { workspaceService } from '../../services/workspaceService';
import AgenticChat from '../ui/AgenticChat';
import { FileTree } from './FileTree';
import { GitPanel } from './GitPanel';
import { Terminal } from './Terminal';
import VSXMarketplacePanel from './VSXMarketplacePanel';
import { WorkspaceSearch } from './WorkspaceSearch';

const mockFiles = [
    {
        name: 'src',
        type: 'directory' as const,
        path: '/src',
        children: [
            {
                name: 'components',
                type: 'directory' as const,
                path: '/src/components',
                children: [
                    {
                        name: 'App.tsx',
                        type: 'file' as const,
                        path: '/src/components/App.tsx',
                    },
                ],
            },
        ],
    },
];

export const IDEWorkspace: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [code, setCode] = useState('// Select a file to start coding');
    const [showGitPanel, setShowGitPanel] = useState(false);
    const [showMarketplace, setShowMarketplace] = useState(false);
    const [showChat, setShowChat] = useState(true);

    const handleFileSelect = async (path: string) => {
        setSelectedFile(path);
        try {
            const content = await workspaceService.readFile(path);
            setCode(content);
        } catch (error) {
            console.error('Failed to read file:', error);
            setCode(`// Error loading ${path}`);
        }
    };

    const handleEditorChange = async (value: string | undefined) => {
        if (!value || !selectedFile) return;
        setCode(value);

        try {
            await workspaceService.writeFile(selectedFile, value);
        } catch (error) {
            console.error('Failed to save file:', error);
        }
    };

    const handleCommand = async (command: string) => {
        try {
            const output = await workspaceService.executeCommand(command);
            // Terminal component will handle the output
            console.log('Command output:', output);
        } catch (error) {
            console.error('Command failed:', error);
        }
    };

    // Set up file change listener
    useEffect(() => {
        const handleFileChange = (operation: FileOperation) => {
            if (operation.path === selectedFile && operation.type === 'write') {
                handleFileSelect(operation.path);
            }
        };

        const cleanup = workspaceService.onFileChange(handleFileChange);
        return () => cleanup();
    }, [selectedFile]);

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="h-12 flex items-center justify-between px-4 border-b dark:border-gray-700 space-x-2">
                <WorkspaceSearch onFileSelect={handleFileSelect} />
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowMarketplace((v) => !v)}
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-700 text-indigo-900 dark:text-white rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {showMarketplace ? 'Hide Extensions' : 'VSX Marketplace'}
                    </button>
                    <button
                        onClick={() => setShowGitPanel(!showGitPanel)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {showGitPanel ? 'Hide Git' : 'Show Git'}
                    </button>
                    <button
                        onClick={() => setShowChat((v) => !v)}
                        className="px-4 py-2 bg-purple-100 dark:bg-purple-700 text-purple-900 dark:text-white rounded-lg hover:bg-purple-200 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {showChat ? 'Hide Agent Chat' : 'Show Agent Chat'}
                    </button>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col">
                    <PanelGroup direction="horizontal">
                        {/* File Tree */}
                        <Panel defaultSize={20} minSize={15}>
                            <div className="h-full border-r dark:border-gray-700">
                                <div className="p-4 border-b dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Files
                                    </h2>
                                </div>
                                <FileTree files={mockFiles} onFileSelect={handleFileSelect} />
                            </div>
                        </Panel>
                        <PanelResizeHandle className="w-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" />
                        {/* Editor */}
                        <Panel defaultSize={60} minSize={30}>
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {selectedFile || 'Editor'}
                                    </h2>
                                </div>
                                <div className="flex-1">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="typescript"
                                        theme="vs-dark"
                                        value={code}
                                        onChange={handleEditorChange}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            roundedSelection: false,
                                            scrollBeyondLastLine: false,
                                            readOnly: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </Panel>
                        <PanelResizeHandle className="w-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" />
                        {/* Terminal/Git/Marketplace Panel */}
                        <Panel defaultSize={20} minSize={15}>
                            <div className="h-full border-l dark:border-gray-700">
                                {showMarketplace ? (
                                    <VSXMarketplacePanel />
                                ) : showGitPanel ? (
                                    <GitPanel />
                                ) : (
                                    <>
                                        <div className="p-4 border-b dark:border-gray-700">
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Terminal
                                            </h2>
                                        </div>
                                        <div className="h-[calc(100%-4rem)]">
                                            <Terminal onCommand={handleCommand} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </Panel>
                    </PanelGroup>
                </div>
                {/* Agentic Chat Panel */}
                {showChat && (
                    <div className="w-full max-w-sm border-l dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                        {/* Ensure the AgenticChat instance here uses the updated multimodal, drag-and-drop, copy-paste, upload progress, emoji, and Socket.IO logic, matching MamaBearChatOverlay. Pass any required context/props for agent identity and page context. */}
                        <AgenticChat agentId="ide_agent" agentName="IDE Agent" features={{ file: true, image: true, audio: true, video: true, rag: true, browser: true }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IDEWorkspace;
