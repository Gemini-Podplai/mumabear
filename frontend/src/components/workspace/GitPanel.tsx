import { CheckCircleIcon, RefreshIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { workspaceService } from '../../services/workspaceService';

interface GitStatus {
    staged: string[];
    modified: string[];
    untracked: string[];
    branch: string;
}

export const GitPanel: React.FC = () => {
    const [status, setStatus] = useState<GitStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

    const fetchStatus = async () => {
        setIsLoading(true);
        try {
            const gitStatus = await workspaceService.getGitStatus();
            setStatus(gitStatus);
        } catch (error) {
            console.error('Failed to fetch git status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleStage = async (files: string[]) => {
        try {
            await workspaceService.gitAdd(files);
            await fetchStatus();
        } catch (error) {
            console.error('Failed to stage files:', error);
        }
    };

    const handleCommit = async () => {
        if (!commitMessage.trim()) return;

        try {
            await workspaceService.gitCommit(commitMessage);
            setCommitMessage('');
            await fetchStatus();
        } catch (error) {
            console.error('Failed to commit:', error);
        }
    };

    const toggleFileSelection = (file: string) => {
        const newSelected = new Set(selectedFiles);
        if (newSelected.has(file)) {
            newSelected.delete(file);
        } else {
            newSelected.add(file);
        }
        setSelectedFiles(newSelected);
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Git {status?.branch && `(${status.branch})`}
                </h3>
                <button
                    onClick={fetchStatus}
                    disabled={isLoading}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Changes List */}
            <div className="flex-1 overflow-auto p-4">
                {status && (
                    <>
                        {/* Staged Files */}
                        {status.staged.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Staged Changes
                                </h4>
                                {status.staged.map((file) => (
                                    <div key={file} className="flex items-center py-1">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-900 dark:text-white">{file}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Modified Files */}
                        {status.modified.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Modified
                                </h4>
                                {status.modified.map((file) => (
                                    <div key={file} className="flex items-center py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.has(file)}
                                            onChange={() => toggleFileSelection(file)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-900 dark:text-white">{file}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Untracked Files */}
                        {status.untracked.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Untracked
                                </h4>
                                {status.untracked.map((file) => (
                                    <div key={file} className="flex items-center py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.has(file)}
                                            onChange={() => toggleFileSelection(file)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-900 dark:text-white">{file}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t dark:border-gray-700">
                {selectedFiles.size > 0 && (
                    <button
                        onClick={() => handleStage(Array.from(selectedFiles))}
                        className="w-full mb-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Stage Selected Files
                    </button>
                )}

                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        placeholder="Commit message"
                        className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleCommit}
                        disabled={!commitMessage.trim() || !status?.staged.length}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                     focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        Commit
                    </button>
                </div>
            </div>
        </div>
    );
};
