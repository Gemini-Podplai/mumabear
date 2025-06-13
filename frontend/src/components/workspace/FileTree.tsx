import { ChevronRightIcon, DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface FileNode {
    name: string;
    type: 'file' | 'directory';
    children?: FileNode[];
    path: string;
}

interface FileTreeProps {
    files: FileNode[];
    onFileSelect: (path: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ files, onFileSelect }) => {
    const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };

    const renderNode = (node: FileNode, level: number = 0) => {
        const isExpanded = expandedFolders.has(node.path);

        return (
            <div key={node.path} style={{ paddingLeft: `${level * 12}px` }}>
                <div
                    className={`
            flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700
            cursor-pointer rounded-md transition-colors
            ${node.type === 'file' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}
          `}
                    onClick={() => node.type === 'directory' ? toggleFolder(node.path) : onFileSelect(node.path)}
                >
                    {node.type === 'directory' && (
                        <ChevronRightIcon
                            className={`w-4 h-4 mr-1 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
                        />
                    )}
                    {node.type === 'directory' ? (
                        <FolderIcon className="w-5 h-5 text-blue-500 mr-2" />
                    ) : (
                        <DocumentIcon className="w-5 h-5 text-gray-500 mr-2" />
                    )}
                    <span className="text-sm">{node.name}</span>
                </div>
                {node.type === 'directory' && isExpanded && node.children?.map(child =>
                    renderNode(child, level + 1)
                )}
            </div>
        );
    };

    return (
        <div className="p-2 overflow-auto">
            {files.map(node => renderNode(node))}
        </div>
    );
};
