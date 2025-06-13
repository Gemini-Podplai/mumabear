import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  MinusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ShareIcon,
  EyeIcon,
  UsersIcon,
  GlobeAltIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  CameraIcon,
  VideoCameraIcon,
  PlusIcon,
  SpeakerWaveIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

interface FloatingBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  workspaceId?: string;
}

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
  isLoading: boolean;
}

interface SharedSession {
  id: string;
  users: string[];
  isRecording: boolean;
  startTime: Date;
}

const FloatingBrowser: React.FC<FloatingBrowserProps> = ({
  isOpen,
  onClose,
  initialUrl = 'https://mumabear.dev',
  workspaceId
}) => {
  const [position, setPosition] = useState({ x: 200, y: 150 });
  const [size, setSize] = useState({ width: 1000, height: 700 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: '1',
      title: 'Muma Bear Workspace',
      url: initialUrl,
      isActive: true,
      isLoading: false
    }
  ]);
  const [sharedSession, setSharedSession] = useState<SharedSession | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const browserRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Simulate viewer count changes
  useEffect(() => {
    if (sharedSession) {
      const interval = setInterval(() => {
        setViewerCount(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sharedSession]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMinimized) return;
    setIsDragging(true);
    const rect = browserRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX - offsetX,
          y: e.clientY - offsetY
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [isMinimized]);

  const navigateToUrl = useCallback((url: string) => {
    setIsLoading(true);
    setCurrentUrl(url);
    
    // Update active tab
    setTabs(prev => prev.map(tab => 
      tab.isActive 
        ? { ...tab, url, isLoading: true, title: 'Loading...' }
        : tab
    ));

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setTabs(prev => prev.map(tab => 
        tab.isActive 
          ? { ...tab, isLoading: false, title: `Page - ${url}` }
          : tab
      ));
    }, 1500);
  }, []);

  const createNewTab = useCallback(() => {
    const newTab: BrowserTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'about:blank',
      isActive: true,
      isLoading: false
    };

    setTabs(prev => [
      ...prev.map(tab => ({ ...tab, isActive: false })),
      newTab
    ]);
    setCurrentUrl('about:blank');
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== tabId);
      if (filtered.length === 0) {
        onClose();
        return [];
      }
      
      const closedTab = prev.find(tab => tab.id === tabId);
      if (closedTab?.isActive && filtered.length > 0) {
        filtered[0].isActive = true;
        setCurrentUrl(filtered[0].url);
      }
      
      return filtered;
    });
  }, [onClose]);

  const startSharing = useCallback(() => {
    setIsSharing(true);
    
    setTimeout(() => {
      const newSession: SharedSession = {
        id: `session_${Date.now()}`,
        users: ['You'],
        isRecording: false,
        startTime: new Date()
      };
      
      setSharedSession(newSession);
      setIsSharing(false);
      setViewerCount(1);
      
      // Copy share link to clipboard
      navigator.clipboard?.writeText(`https://mumabear.dev/share/${newSession.id}`);
    }, 2000);
  }, []);

  const stopSharing = useCallback(() => {
    setSharedSession(null);
    setViewerCount(0);
    setIsRecording(false);
    setIsVoiceEnabled(false);
  }, []);

  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
  }, []);

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={browserRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isMinimized ? 0.3 : 1,
        opacity: 1,
        x: position.x,
        y: position.y
      }}
      className={`fixed z-50 bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
      style={{
        width: isMinimized ? 250 : size.width,
        height: isMinimized ? 40 : size.height,
        left: position.x,
        top: position.y
      }}
    >
        {/* Browser Header */}
        <div 
          className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center space-x-2">
            <GlobeAltIcon className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700 text-sm font-medium">
              🌐 Muma Browser {workspaceId ? `[${workspaceId.slice(0, 8)}]` : ''}
            </span>
            {sharedSession && !isMinimized && (
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">{viewerCount} viewers</span>
                </div>
                {isRecording && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-600">REC</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {!isMinimized && (
              <>
                {sharedSession ? (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={toggleVoice}
                      className={`p-1 rounded transition-colors ${
                        isVoiceEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                      }`}
                      title="Toggle Voice Chat"
                    >
                      {isMuted ? (
                        <MicrophoneIcon className="w-3 h-3 line-through" />
                      ) : (
                        <SpeakerWaveIcon className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={toggleRecording}
                      className={`p-1 rounded transition-colors ${
                        isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
                      }`}
                      title="Toggle Recording"
                    >
                      <VideoCameraIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={stopSharing}
                      className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Stop Sharing"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startSharing}
                    disabled={isSharing}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                    title="Share Browser"
                  >
                    <ShareIcon className={`w-3 h-3 text-gray-600 ${isSharing ? 'animate-pulse' : ''}`} />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Minimize"
                >
                  <MinusIcon className="w-3 h-3 text-gray-600" />
                </button>
              </>
            )}
            {isMinimized && (
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                title="Restore"
              >
                <EyeIcon className="w-3 h-3 text-gray-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
              title="Close"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tab Bar */}
            <div className="flex items-center bg-gray-50 border-b border-gray-200">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-2 px-3 py-2 border-r border-gray-200 cursor-pointer max-w-48 ${
                    tab.isActive ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setTabs(prev => prev.map(t => ({ ...t, isActive: t.id === tab.id })));
                    setCurrentUrl(tab.url);
                  }}
                >
                  {tab.isLoading ? (
                    <ArrowPathIcon className="w-3 h-3 animate-spin text-gray-500" />
                  ) : (
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  )}
                  <span className="text-xs text-gray-700 truncate">{tab.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="hover:bg-gray-200 rounded p-0.5"
                  >
                    <XMarkIcon className="w-2 h-2 text-gray-500" />
                  </button>
                </div>
              ))}
              <button
                onClick={createNewTab}
                className="p-2 hover:bg-gray-100 transition-colors"
                title="New Tab"
              >
                <PlusIcon className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center space-x-2 p-2 bg-white border-b border-gray-200">
              <button
                onClick={() => navigateToUrl(currentUrl)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Back"
              >
                <ArrowLeftIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => navigateToUrl(currentUrl)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Forward"
              >
                <ArrowRightIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => navigateToUrl(currentUrl)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-3 py-1 border">
                <LockClosedIcon className="w-3 h-3 text-green-500 mr-2" />
                <input
                  type="text"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && navigateToUrl(currentUrl)}
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                  placeholder="Enter URL..."
                />
                <MagnifyingGlassIcon className="w-3 h-3 text-gray-400 ml-2" />
              </div>
              
              <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Bookmark"
              >
                <BookmarkIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Browser Content */}
            <div className="flex-1 bg-white relative" style={{ height: size.height - 120 }}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ArrowPathIcon className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
                    <p className="text-gray-600">Loading page...</p>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={currentUrl}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  title="Browser Content"
                />
              )}
              
              {/* Sharing Overlay */}
              {sharedSession && (
                <div className="absolute top-2 right-2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live • {viewerCount} viewers</span>
                  </div>
                </div>
              )}
            </div>

            {/* Resize Handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 hover:bg-gray-400 transition-colors"
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = size.width;
                const startHeight = size.height;

                const handleMouseMove = (e: MouseEvent) => {
                  setSize({
                    width: Math.max(600, startWidth + (e.clientX - startX)),
                    height: Math.max(400, startHeight + (e.clientY - startY))
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </>
        )}
    </motion.div>
  );
};

export default FloatingBrowser;