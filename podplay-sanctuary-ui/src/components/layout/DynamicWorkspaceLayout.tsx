import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
  CommandLineIcon,
  DocumentIcon,
  CogIcon,
  MagnifyingGlassIcon,
  PuzzlePieceIcon,
  BeakerIcon,
  CodeBracketIcon,
  EyeIcon,
  PlayIcon,
  StopIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';
import MultimodalChatInterface from '../chat/MultimodalChatInterface';

interface DynamicWorkspaceLayoutProps {
  children: React.ReactNode;
  agentName: string;
  agentType: 'scout' | 'research' | 'code' | 'workflow' | 'mcp' | 'messenger';
  agentDescription: string;
  showFileTree?: boolean;
  showTerminal?: boolean;
  showFilePreview?: boolean;
  showProcessTicker?: boolean;
}

interface ProcessTickerItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  progress?: number;
}

const DynamicWorkspaceLayout: React.FC<DynamicWorkspaceLayoutProps> = ({
  children,
  agentName,
  agentType,
  agentDescription,
  showFileTree = true,
  showTerminal = true,
  showFilePreview = true,
  showProcessTicker = true
}) => {
  // Layout State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Workspace State
  const [activeTab, setActiveTab] = useState('files');
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [processTicker, setProcessTicker] = useState<ProcessTickerItem[]>([
    {
      id: '1',
      type: 'info',
      message: 'Initializing Mama Bear workspace...',
      timestamp: new Date(),
      progress: 100
    },
    {
      id: '2',
      type: 'success',
      message: 'Connected to Vertex AI Express Mode',
      timestamp: new Date(),
      progress: 100
    },
    {
      id: '3',
      type: 'info',
      message: 'Loading 57 AI models...',
      timestamp: new Date(),
      progress: 85
    }
  ]);

  // Theme State
  const [currentTheme, setCurrentTheme] = useState('cosmic');
  const [gradientIntensity, setGradientIntensity] = useState(50);

  const getThemeGradient = () => {
    const intensity = gradientIntensity / 100;
    switch (currentTheme) {
      case 'cosmic':
        return `linear-gradient(135deg, rgba(139, 69, 19, ${intensity}) 0%, rgba(75, 0, 130, ${intensity}) 50%, rgba(25, 25, 112, ${intensity}) 100%)`;
      case 'ocean':
        return `linear-gradient(135deg, rgba(0, 119, 190, ${intensity}) 0%, rgba(0, 180, 216, ${intensity}) 50%, rgba(144, 224, 239, ${intensity}) 100%)`;
      case 'forest':
        return `linear-gradient(135deg, rgba(34, 139, 34, ${intensity}) 0%, rgba(0, 100, 0, ${intensity}) 50%, rgba(46, 125, 50, ${intensity}) 100%)`;
      case 'sunset':
        return `linear-gradient(135deg, rgba(255, 94, 77, ${intensity}) 0%, rgba(255, 154, 0, ${intensity}) 50%, rgba(255, 206, 84, ${intensity}) 100%)`;
      case 'furry':
        return `linear-gradient(135deg, rgba(255, 182, 193, ${intensity}) 0%, rgba(221, 160, 221, ${intensity}) 50%, rgba(173, 216, 230, ${intensity}) 100%)`;
      default:
        return `linear-gradient(135deg, rgba(139, 69, 19, ${intensity}) 0%, rgba(75, 0, 130, ${intensity}) 50%, rgba(25, 25, 112, ${intensity}) 100%)`;
    }
  };

  const getAgentGradient = () => {
    switch (agentType) {
      case 'scout': return 'from-purple-500 to-pink-500';
      case 'research': return 'from-blue-500 to-cyan-500';
      case 'code': return 'from-orange-500 to-red-500';
      case 'workflow': return 'from-indigo-500 to-purple-500';
      case 'mcp': return 'from-teal-500 to-blue-500';
      case 'messenger': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const toggleWorkspaceMode = useCallback(() => {
    if (leftSidebarOpen && rightSidebarOpen) {
      // Close both sidebars - go to chat mode
      setLeftSidebarOpen(false);
      setRightSidebarOpen(false);
      setChatCollapsed(false);
    } else {
      // Open both sidebars - go to workspace mode
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
      setChatCollapsed(true);
    }
  }, [leftSidebarOpen, rightSidebarOpen]);

  const addProcessTickerItem = useCallback((item: Omit<ProcessTickerItem, 'id' | 'timestamp'>) => {
    const newItem: ProcessTickerItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setProcessTicker(prev => [newItem, ...prev.slice(0, 9)]); // Keep last 10 items
  }, []);

  // Simulate live process updates
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        'Processing multimodal request...',
        'Analyzing image content...',
        'Executing code in E2B environment...',
        'Scraping web data with Scrapybara...',
        'Optimizing response with Express Mode...',
        'Syncing with Vertex AI...',
        'Updating memory context...',
        'Generating response...'
      ];
      
      if (Math.random() > 0.7) {
        addProcessTickerItem({
          type: Math.random() > 0.8 ? 'success' : 'info',
          message: messages[Math.floor(Math.random() * messages.length)],
          progress: Math.floor(Math.random() * 100)
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [addProcessTickerItem]);

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative"
      style={{ background: getThemeGradient() }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {currentTheme === 'cosmic' && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
        
        {currentTheme === 'furry' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  rotate: [0, 360],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                {['🐾', '🦊', '🐺', '🐱', '🐰'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Top Control Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-50 p-4"
      >
        <div className="flex items-center justify-between bg-black/20 backdrop-blur-xl rounded-2xl p-3 border border-white/10">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleWorkspaceMode}
              className={`p-3 rounded-xl transition-all ${
                leftSidebarOpen && rightSidebarOpen
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Toggle Workspace Mode"
            >
              {leftSidebarOpen && rightSidebarOpen ? (
                <ArrowsPointingInIcon className="w-5 h-5 text-white" />
              ) : (
                <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
              )}
            </motion.button>

            <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getAgentGradient()}`}>
              <span className="text-white font-semibold">{agentName}</span>
            </div>
          </div>

          {/* Center - Theme Controls */}
          <div className="flex items-center space-x-3">
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="cosmic">🌌 Cosmic</option>
              <option value="ocean">🌊 Ocean</option>
              <option value="forest">🌲 Forest</option>
              <option value="sunset">🌅 Sunset</option>
              <option value="furry">🐾 Furry</option>
            </select>

            <input
              type="range"
              min="10"
              max="100"
              value={gradientIntensity}
              onChange={(e) => setGradientIntensity(Number(e.target.value))}
              className="w-20"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <EyeIcon className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex h-full pt-20">
        {/* Left Sidebar */}
        {leftSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Explorer</h3>
                <button
                  onClick={() => setLeftSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 mt-3">
                {[
                  { id: 'files', icon: FolderIcon, label: 'Files' },
                  { id: 'search', icon: MagnifyingGlassIcon, label: 'Search' },
                  { id: 'extensions', icon: PuzzlePieceIcon, label: 'Extensions' },
                  { id: 'settings', icon: CogIcon, label: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={tab.label}
                  >
                    <tab.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'files' && (
                <div className="space-y-2">
                  {[
                    { name: 'src', type: 'folder', children: ['components', 'pages', 'utils'] },
                    { name: 'backend', type: 'folder', children: ['api', 'services', 'models'] },
                    { name: 'package.json', type: 'file' },
                    { name: 'README.md', type: 'file' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                    >
                      {item.type === 'folder' ? (
                        <FolderIcon className="w-4 h-4 text-blue-400" />
                      ) : (
                        <DocumentIcon className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm text-white">{item.name}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Terminal Section */}
            {showTerminal && (
              <motion.div
                initial={{ height: 200 }}
                animate={{ height: terminalExpanded ? 400 : 200 }}
                className="border-t border-white/10 bg-black/30"
              >
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CommandLineIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">Terminal</span>
                  </div>
                  <button
                    onClick={() => setTerminalExpanded(!terminalExpanded)}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <ArrowsPointingOutIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="p-3 font-mono text-sm text-green-400 overflow-y-auto">
                  <div>$ npm start</div>
                  <div className="text-gray-400">Starting development server...</div>
                  <div className="text-blue-400">✓ Server running on http://localhost:3000</div>
                  <div className="text-yellow-400">⚡ Express Mode: Active</div>
                  <div className="text-green-400">🤖 Mama Bear: Online</div>
                  <div className="animate-pulse">$ _</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          {/* Process Ticker */}
          {showProcessTicker && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-3"
            >
              <div className="flex items-center space-x-4 overflow-x-auto">
                <span className="text-sm text-white font-medium whitespace-nowrap">Live Process Ticker:</span>
                <div className="flex space-x-4">
                  {processTicker.slice(0, 3).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                        item.type === 'success' ? 'bg-green-500/20 text-green-300' :
                        item.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                        item.type === 'error' ? 'bg-red-500/20 text-red-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        item.type === 'success' ? 'bg-green-400' :
                        item.type === 'warning' ? 'bg-yellow-400' :
                        item.type === 'error' ? 'bg-red-400' :
                        'bg-blue-400'
                      }`} />
                      <span>{item.message}</span>
                      {item.progress !== undefined && (
                        <span className="font-mono">({item.progress}%)</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>

        {/* Right Sidebar */}
        {rightSidebarOpen && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 bg-black/20 backdrop-blur-xl border-l border-white/10"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">File Preview</h3>
                <button
                  onClick={() => setRightSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">No file selected</div>
                <div className="text-xs text-gray-500">Select a file from the explorer to preview</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Interface */}
        {!chatCollapsed && (
          <motion.div
            initial={{ x: 384, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 384, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-96"
          >
            <MultimodalChatInterface
              agentName={agentName}
              agentType={agentType}
              agentDescription={agentDescription}
              isCollapsed={false}
              onToggleCollapse={() => setChatCollapsed(true)}
            />
          </motion.div>
        )}
      </div>

      {/* Floating Chat Button */}
      {chatCollapsed && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setChatCollapsed(false)}
          className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r ${getAgentGradient()} shadow-2xl z-50`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🐻
          </motion.div>
        </motion.button>
      )}
    </div>
  );
};

export default DynamicWorkspaceLayout;