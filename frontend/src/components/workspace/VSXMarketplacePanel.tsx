import { ArrowDownTrayIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const mockExtensions = [
    { id: 'prettier', name: 'Prettier Formatter', description: 'Code formatter for consistent style', installed: false },
    { id: 'eslint', name: 'ESLint', description: 'Find and fix problems in your JavaScript code', installed: false },
    { id: 'theme-dark', name: 'Dark Theme', description: 'A beautiful dark theme for Monaco', installed: true },
];

export const VSXMarketplacePanel: React.FC = () => {
    const [extensions, setExtensions] = useState(mockExtensions);

    const handleInstall = (id: string) => {
        setExtensions(exts => exts.map(e => e.id === id ? { ...e, installed: true } : e));
        window.notify('success', 'Extension installed!');
        // TODO: Integrate with backend for real extension install
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-2">
                <PuzzlePieceIcon className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">VSX Marketplace</h3>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {extensions.map(ext => (
                    <div key={ext.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">{ext.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-300">{ext.description}</div>
                        </div>
                        {ext.installed ? (
                            <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Installed</span>
                        ) : (
                            <button
                                onClick={() => handleInstall(ext.id)}
                                className="flex items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> Install
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {/* Update AgenticChat instance to use full multimodal chat features and consistent UX from MamaBearChatOverlay.
            Ensure agentic context is passed.
            Ensure the AgenticChat instance here uses the updated multimodal, drag-and-drop, copy-paste, upload progress, emoji, and Socket.IO logic, matching MamaBearChatOverlay. Pass any required context/props for agent identity and page context. */}
        </div>
    );
};

export default VSXMarketplacePanel;
