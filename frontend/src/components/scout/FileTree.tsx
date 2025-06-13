import { ArrowDownTrayIcon, ChevronRightIcon, DocumentIcon, FolderIcon, FolderPlusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { workspaceService } from '../../services/workspaceService';

interface FileTreeNode {
    name: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
    path: string;
    meta?: {
        lastModified?: number;
        size?: number;
        preview?: string;
    };
}

interface FileTreeProps {
    initialData: FileTreeNode[];
    onFileSelect: (path: string) => void;
    onFileShare?: (path: string) => void;
    onFilePreview?: (path: string, content: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ initialData, onFileSelect, onFileShare }) => {
    const [data, setData] = useState(initialData);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
    const [draggedItem, setDraggedItem] = useState<{ path: string; type: 'file' | 'directory' } | null>(null);
    const [dragOverPath, setDragOverPath] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const toggleExpand = (path: string) => {
        const newExpanded = new Set(expandedPaths);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedPaths(newExpanded);
    };

    const handleDragStart = (e: React.DragEvent, item: { path: string; type: 'file' | 'directory' }) => {
        setDraggedItem(item);
        e.dataTransfer.setData('text/plain', item.path);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, path: string) => {
        e.preventDefault();
        if (draggedItem && draggedItem.path !== path) {
            setDragOverPath(path);
        }
    };

    const handleDrop = async (e: React.DragEvent, targetPath: string) => {
        e.preventDefault();
        setDragOverPath(null);

        if (!draggedItem) return;

        // Handle internal drag and drop
        if (draggedItem.path !== targetPath) {
            try {
                const content = await workspaceService.readFile(draggedItem.path);
                await workspaceService.writeFile(targetPath + '/' + draggedItem.path.split('/').pop(), content);
                // Delete the original file if it was a move operation
                await workspaceService.deleteFile(draggedItem.path);
                // Update the file tree
                // This would typically be handled by the file system watcher
            } catch (error) {
                console.error('Failed to move file:', error);
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetPath: string) => {
        const files = e.target.files;
        if (!files?.length) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    const content = reader.result as string;
                    await workspaceService.writeFile(targetPath + '/' + file.name, content);
                } catch (error) {
                    console.error('Failed to upload file:', error);
                }
            };

            reader.readAsText(file);
        }
    };

    const handleCreateFolder = async (path: string) => {
        const name = prompt('Enter folder name:');
        if (!name) return;

        try {
            await workspaceService.createDirectory(path + '/' + name);
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    };

    const renderTreeNode = (node: FileTreeNode, level: number = 0) => {
        const isExpanded = expandedPaths.has(node.path);
        const isDragOver = dragOverPath === node.path;

        return (
            <div key={node.path} style={{ marginLeft: level * 16 }}>
                <motion.div
                    className={`
                        flex items-center py-1 px-2 rounded-md cursor-pointer
                        ${isDragOver ? 'bg-purple-500/20' : 'hover:bg-gray-700/50'}
                    `}
                    draggable
                    onDragStart={(e) => handleDragStart(e, { path: node.path, type: node.type })}
                    onDragOver={(e) => handleDragOver(e, node.path)}
                    onDragLeave={() => setDragOverPath(null)}
                    onDrop={(e) => handleDrop(e, node.path)}
                    onClick={() => node.type === 'directory' ? toggleExpand(node.path) : onFileSelect(node.path)}
                >
                    {node.type === 'directory' && (
                        <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-4 h-4 mr-1"
                        >
                            <ChevronRightIcon className="text-gray-400" />
                        </motion.div>
                    )}
                    {node.type === 'directory' ? (
                        <FolderIcon className="w-4 h-4 mr-1 text-blue-400" />
                    ) : (
                        <DocumentIcon className="w-4 h-4 mr-1 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-300 flex-1">{node.name}</span>
                    {node.type === 'file' && onFileShare && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileShare(node.path);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </motion.div>
                <AnimatePresence>
                    {isExpanded && node.type === 'directory' && node.children && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {node.children.map(child => renderTreeNode(child, level + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            {/* File Tree Actions */}
            <div className="flex items-center space-x-2 p-2 border-b border-gray-700">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 hover:bg-gray-700 rounded"
                    title="Upload File"
                >
                    <PlusIcon className="w-4 h-4 text-gray-400" />
                </button>
                <button
                    onClick={() => handleCreateFolder('')}
                    className="p-1 hover:bg-gray-700 rounded"
                    title="New Folder"
                >
                    <FolderPlusIcon className="w-4 h-4 text-gray-400" />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, '')}
                    className="hidden"
                />
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-auto">
                {data.map(node => renderTreeNode(node))}
            </div>
        </div>
    );
};
