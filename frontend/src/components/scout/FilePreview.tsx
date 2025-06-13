import { XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React from 'react';

interface FilePreviewProps {
    filePath: string;
    content: string;
    position: { x: number; y: number };
    onClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ filePath, content, position, onClose }) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    const isImage = extension && ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension);
    const isMarkdown = extension === 'md';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden"
            style={{
                left: position.x + 20,
                top: position.y,
                maxWidth: '400px',
                maxHeight: '300px'
            }}
        >
            <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700">
                <span className="text-sm text-gray-300">{filePath.split('/').pop()}</span>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded"
                >
                    <XMarkIcon className="w-4 h-4 text-gray-400" />
                </button>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: '250px' }}>
                {isImage ? (
                    <img
                        src={content}
                        alt={filePath}
                        className="max-w-full h-auto"
                    />
                ) : (
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                        {content}
                    </pre>
                )}
            </div>
        </motion.div>
    );
};
