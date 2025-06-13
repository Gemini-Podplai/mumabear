import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { workspaceService } from '../../services/workspaceService';

interface FileUploadProps {
    targetPath: string;
    onComplete: () => void;
}

interface UploadingFile {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'complete' | 'error';
    error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ targetPath, onComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const items = Array.from(e.dataTransfer.items);
        const files = items
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile())
            .filter((file): file is File => file !== null);

        // Add files to upload queue
        const newUploadingFiles = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            progress: 0,
            status: 'uploading' as const
        }));

        setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

        // Process each file
        await Promise.all(files.map(async (file, index) => {
            const uploadId = newUploadingFiles[index].id;
            try {
                const reader = new FileReader();
                const content = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsText(file);
                });

                // Simulate upload progress
                for (let progress = 0; progress <= 100; progress += 10) {
                    setUploadingFiles(prev => prev.map(f =>
                        f.id === uploadId ? { ...f, progress } : f
                    ));
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                await workspaceService.writeFile(`${targetPath}/${file.name}`, content);

                setUploadingFiles(prev => prev.map(f =>
                    f.id === uploadId ? { ...f, status: 'complete' } : f
                ));
            } catch (error) {
                setUploadingFiles(prev => prev.map(f =>
                    f.id === uploadId ? {
                        ...f,
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Upload failed'
                    } : f
                ));
            }
        }));

        // Clean up completed uploads after a delay
        setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.status === 'uploading'));
            onComplete();
        }, 2000);
    }, [targetPath, onComplete]);

    return (
        <div className="relative">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    absolute inset-0 z-50 flex items-center justify-center
                    transition-colors duration-200
                    ${isDragging ? 'bg-purple-500/20 border-2 border-purple-500/50' : 'pointer-events-none'}
                `}
            >
                {isDragging && (
                    <div className="text-center text-purple-400">
                        <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Drop files here</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {uploadingFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-4 right-4 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
                    >
                        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-300">
                                Uploading {uploadingFiles.length} file(s)
                            </span>
                            <button
                                onClick={() => setUploadingFiles([])}
                                className="p-1 hover:bg-gray-700 rounded"
                            >
                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="max-h-60 overflow-auto">
                            {uploadingFiles.map(file => (
                                <div
                                    key={file.id}
                                    className="p-3 border-b border-gray-700 last:border-0"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-300 truncate">
                                            {file.file.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {file.status === 'uploading' ? `${file.progress}%` : file.status}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-gray-700 rounded overflow-hidden">
                                        <motion.div
                                            className={`h-full ${file.status === 'complete' ? 'bg-green-500' :
                                                    file.status === 'error' ? 'bg-red-500' :
                                                        'bg-purple-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${file.progress}%` }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                    {file.error && (
                                        <p className="text-xs text-red-400 mt-1">{file.error}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
