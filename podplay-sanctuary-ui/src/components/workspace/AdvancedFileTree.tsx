import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderIcon,
  FolderOpenIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  LinkIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  CpuChipIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: Date;
  created?: Date;
  shared?: boolean;
  starred?: boolean;
  tags?: string[];
  preview?: string;
  children?: FileNode[];
  expanded?: boolean;
  path: string;
  permissions?: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
  metadata?: {
    author?: string;
    version?: string;
    description?: string;
    language?: string;
  };
}

interface AdvancedFileTreeProps {
  files: FileNode[];
  onFileSelect?: (file: FileNode) => void;
  onFileCreate?: (parentId: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete?: (fileId: string) => void;
  onFileRename?: (fileId: string, newName: string) => void;
  onFileMove?: (fileId: string, targetId: string) => void;
  onFileShare?: (fileId: string) => void;
  onFileUpload?: (files: FileList, parentId?: string) => void;
  workspaceId?: string;
  className?: string;
}

const AdvancedFileTree: React.FC<AdvancedFileTreeProps> = ({
  files,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileMove,
  onFileShare,
  onFileUpload,
  workspaceId,
  className = ''
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size' | 'type'>('name');
  const [showHidden, setShowHidden] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    fileId: string;
  } | null>(null);
  const [isCreating, setIsCreating] = useState<{
    parentId: string;
    type: 'file' | 'folder';
  } | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileNode | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  // Get file icon based on type and extension
  const getFileIcon = useCallback((file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? FolderOpenIcon : FolderIcon;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'go':
      case 'rs':
        return CodeBracketIcon;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return PhotoIcon;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'webm':
        return VideoCameraIcon;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'ogg':
        return MusicalNoteIcon;
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'md':
        return DocumentTextIcon;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
        return ArchiveBoxIcon;
      case 'exe':
      case 'app':
      case 'deb':
      case 'dmg':
        return CpuChipIcon;
      default:
        return DocumentIcon;
    }
  }, [expandedFolders]);

  // Get file color based on type
  const getFileColor = useCallback((file: FileNode) => {
    if (file.type === 'folder') return 'text-blue-500';
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return 'text-yellow-500';
      case 'py':
        return 'text-green-500';
      case 'java':
        return 'text-red-500';
      case 'cpp':
      case 'c':
        return 'text-blue-600';
      case 'go':
        return 'text-cyan-500';
      case 'rs':
        return 'text-orange-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return 'text-purple-500';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'webm':
        return 'text-pink-500';
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'ogg':
        return 'text-indigo-500';
      default:
        return 'text-gray-500';
    }
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((file: FileNode) => {
    setSelectedFile(file.id);
    onFileSelect?.(file);
    
    // Auto-preview for certain file types
    if (file.type === 'file') {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'txt', 'md', 'json'].includes(extension || '')) {
        setPreviewFile(file);
      }
    }
  }, [onFileSelect]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, fileId: string) => {
    setDraggedFile(fileId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', fileId);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(targetId);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId && draggedId !== targetId) {
      onFileMove?.(draggedId, targetId);
    }
    
    setDraggedFile(null);
    setDropTarget(null);
  }, [onFileMove]);

  // Handle file upload
  const handleFileUpload = useCallback((uploadedFiles: FileList, parentId?: string) => {
    onFileUpload?.(uploadedFiles, parentId);
  }, [onFileUpload]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      fileId
    });
  }, []);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Filter files based on search
  const filterFiles = useCallback((nodes: FileNode[]): FileNode[] => {
    if (!searchQuery) return nodes;
    
    return nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           node.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (node.type === 'folder' && node.children) {
        const filteredChildren = filterFiles(node.children);
        return matchesSearch || filteredChildren.length > 0;
      }
      
      return matchesSearch;
    });
  }, [searchQuery]);

  // Sort files
  const sortFiles = useCallback((nodes: FileNode[]): FileNode[] => {
    return [...nodes].sort((a, b) => {
      // Folders first
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'modified':
          return (b.modified?.getTime() || 0) - (a.modified?.getTime() || 0);
        case 'size':
          return (b.size || 0) - (a.size || 0);
        case 'type':
          const aExt = a.name.split('.').pop() || '';
          const bExt = b.name.split('.').pop() || '';
          return aExt.localeCompare(bExt);
        default:
          return 0;
      }
    });
  }, [sortBy]);

  // Render file node
  const renderFileNode = useCallback((file: FileNode, depth = 0) => {
    const Icon = getFileIcon(file);
    const isSelected = selectedFile === file.id;
    const isDragged = draggedFile === file.id;
    const isDropTarget = dropTarget === file.id;
    const isExpanded = expandedFolders.has(file.id);

    return (
      <motion.div
        key={file.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`group relative ${isDragged ? 'opacity-50' : ''}`}
      >
        <div
          className={`flex items-center space-x-2 py-1 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected 
              ? 'bg-blue-500/20 border border-blue-500/30' 
              : 'hover:bg-white/10 hover:border hover:border-white/20'
          } ${isDropTarget ? 'bg-green-500/20 border border-green-500/30' : ''}`}
          style={{ marginLeft: `${depth * 20}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            }
            handleFileSelect(file);
          }}
          onContextMenu={(e) => handleContextMenu(e, file.id)}
          onDragStart={(e) => handleDragStart(e, file.id)}
          onDragOver={(e) => file.type === 'folder' ? handleDragOver(e, file.id) : undefined}
          onDrop={(e) => file.type === 'folder' ? handleDrop(e, file.id) : undefined}
          draggable
        >
          <Icon className={`w-4 h-4 ${getFileColor(file)} flex-shrink-0`} />
          
          {renamingFile === file.id ? (
            <input
              type="text"
              defaultValue={file.name}
              className="flex-1 bg-transparent text-white text-sm outline-none border-b border-blue-500"
              autoFocus
              onBlur={(e) => {
                if (e.target.value !== file.name) {
                  onFileRename?.(file.id, e.target.value);
                }
                setRenamingFile(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (e.currentTarget.value !== file.name) {
                    onFileRename?.(file.id, e.currentTarget.value);
                  }
                  setRenamingFile(null);
                } else if (e.key === 'Escape') {
                  setRenamingFile(null);
                }
              }}
            />
          ) : (
            <span className="text-white text-sm flex-1 truncate">{file.name}</span>
          )}
          
          {/* File badges */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {file.starred && <StarIcon className="w-3 h-3 text-yellow-400" />}
            {file.shared && <ShareIcon className="w-3 h-3 text-green-400" />}
            {file.tags && file.tags.length > 0 && <TagIcon className="w-3 h-3 text-purple-400" />}
          </div>
          
          {/* File size and date */}
          {file.type === 'file' && (
            <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {file.size && formatFileSize(file.size)}
            </div>
          )}
        </div>
        
        {/* Children */}
        {file.type === 'folder' && isExpanded && file.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {sortFiles(filterFiles(file.children)).map(child =>
              renderFileNode(child, depth + 1)
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }, [
    selectedFile,
    draggedFile,
    dropTarget,
    expandedFolders,
    renamingFile,
    getFileIcon,
    getFileColor,
    formatFileSize,
    toggleFolder,
    handleFileSelect,
    handleContextMenu,
    handleDragStart,
    handleDragOver,
    handleDrop,
    onFileRename,
    sortFiles,
    filterFiles
  ]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu, closeContextMenu]);

  return (
    <div className={`h-full flex flex-col ${className}`} ref={treeRef}>
      {/* Header with search and controls */}
      <div className="p-3 border-b border-white/10 space-y-3">
        {/* Search bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFileCreate?.('root', 'New Folder', 'folder')}
              className="p-1 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
              title="New Folder"
            >
              <FolderIcon className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => onFileCreate?.('root', 'New File', 'file')}
              className="p-1 rounded bg-green-600 hover:bg-green-700 transition-colors"
              title="New File"
            >
              <PlusIcon className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1 rounded bg-purple-600 hover:bg-purple-700 transition-colors"
              title="Upload Files"
            >
              <ArrowUpTrayIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-black/30 border border-white/20 rounded px-2 py-1 text-white"
            >
              <option value="name">Name</option>
              <option value="modified">Modified</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* File tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div>
          {sortFiles(filterFiles(files)).map(file => renderFileNode(file))}
        </div>
      </div>
      
      {/* Context menu */}
      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 bg-gray-800 border border-white/20 rounded-lg shadow-xl py-2 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
            <button
              onClick={() => {
                setRenamingFile(contextMenu.fileId);
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Rename</span>
            </button>
            <button
              onClick={() => {
                onFileShare?.(contextMenu.fileId);
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <ShareIcon className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => {
                // Toggle star
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <StarIcon className="w-4 h-4" />
              <span>Star</span>
            </button>
            <hr className="border-white/20 my-1" />
            <button
              onClick={() => {
                onFileDelete?.(contextMenu.fileId);
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 flex items-center space-x-2"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete</span>
            </button>
        </motion.div>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
      
      {/* File preview modal */}
      {previewFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setPreviewFile(null)}
        >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-4xl max-h-4xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{previewFile.name}</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="text-white">
                {/* Preview content would go here */}
                <p>Preview for {previewFile.name}</p>
              </div>
            </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedFileTree;