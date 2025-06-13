import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon, 
  ComputerDesktopIcon, 
  CommandLineIcon, 
  GlobeAltIcon, 
  Cog6ToothIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  BoltIcon,
  CpuChipIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  FolderPlusIcon,
  DocumentPlusIcon,
  ArrowUpTrayIcon,
  ShareIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  SparklesIcon,
  ChartBarSquareIcon,
  FolderIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface AgentActivity {
  id: string;
  timestamp: string;
  type: 'command' | 'file_edit' | 'web_browse' | 'research' | 'analysis';
  description: string;
  status: 'running' | 'completed' | 'failed';
  details?: any;
  duration?: number;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  size?: number;
  modified?: string;
  content?: string;
  isShared?: boolean;
  isStarred?: boolean;
}

interface WorkspaceState {
  mode: 'landing' | 'planning' | 'workspace';
  isExpanded: boolean;
  activeTab: 'files' | 'timeline' | 'preview';
  selectedFile: string | null;
  agentStatus: 'idle' | 'thinking' | 'working' | 'completed';
  progress: number;
}

const MumaScoutWorkspace: React.FC = () => {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
    mode: 'landing',
    isExpanded: false,
    activeTab: 'files',
    selectedFile: null,
    agentStatus: 'idle',
    progress: 0
  });

  const [userPrompt, setUserPrompt] = useState('');
  const [agentPlan, setAgentPlan] = useState('');
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [isFloatingTerminalOpen, setIsFloatingTerminalOpen] = useState(false);
  const [isFloatingBrowserOpen, setIsFloatingBrowserOpen] = useState(false);
  const [leftPanelWidth] = useState(300);
  const [rightPanelWidth] = useState(400);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles] = useState<Set<string>>(new Set());

  // Mock data for demonstration
  const mockFileTree: FileNode[] = [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          path: '/src/components',
          children: [
            { id: '3', name: 'App.tsx', type: 'file', path: '/src/components/App.tsx', size: 2048, modified: '2 min ago' },
            { id: '4', name: 'Header.tsx', type: 'file', path: '/src/components/Header.tsx', size: 1024, modified: '5 min ago' }
          ]
        },
        { id: '5', name: 'utils.ts', type: 'file', path: '/src/utils.ts', size: 512, modified: '1 min ago', isStarred: true }
      ]
    },
    {
      id: '6',
      name: 'package.json',
      type: 'file',
      path: '/package.json',
      size: 1536,
      modified: '10 min ago',
      isShared: true
    }
  ];

  const mockActivities: AgentActivity[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'web_browse',
      description: 'Researching React best practices',
      status: 'completed',
      duration: 45
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      type: 'file_edit',
      description: 'Created App.tsx component',
      status: 'completed',
      duration: 30
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      type: 'command',
      description: 'Installing dependencies...',
      status: 'running'
    }
  ];

  useEffect(() => {
    setFileTree(mockFileTree);
    setActivities(mockActivities);
  }, []);

  const handleStartWorkflow = async () => {
    if (!userPrompt.trim()) return;

    setWorkspaceState(prev => ({ ...prev, mode: 'planning', agentStatus: 'thinking' }));
    
    // Simulate agent planning
    setTimeout(() => {
      setAgentPlan(`I'll help you build "${userPrompt}". Here's my plan:

1. 🔍 Research best practices and similar implementations
2. 🏗️ Set up project structure and dependencies  
3. 💻 Implement core functionality with TypeScript
4. 🎨 Add beautiful UI with Tailwind CSS
5. 🧪 Write comprehensive tests
6. 🚀 Deploy to production

Would you like me to proceed with this plan?`);
      setWorkspaceState(prev => ({ ...prev, agentStatus: 'idle' }));
    }, 2000);
  };

  const handleApprovePlan = () => {
    setWorkspaceState(prev => ({ 
      ...prev, 
      mode: 'workspace', 
      agentStatus: 'working',
      isExpanded: true 
    }));
    
    // Start progress simulation
    const progressInterval = setInterval(() => {
      setWorkspaceState(prev => {
        const newProgress = Math.min(prev.progress + Math.random() * 10, 100);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return { ...prev, progress: 100, agentStatus: 'completed' };
        }
        return { ...prev, progress: newProgress };
      });
    }, 1000);
  };

  const toggleWorkspaceExpansion = () => {
    setWorkspaceState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
  };

  const renderFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return <FolderIcon className="w-4 h-4 text-blue-400" />;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
        return <CodeBracketIcon className="w-4 h-4 text-blue-500" />;
      case 'json':
        return <Cog6ToothIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <DocumentIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`ml-${level * 4}`}
      >
        <div
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors ${
            selectedFiles.has(node.id) ? 'bg-purple-500/20' : ''
          }`}
          onClick={() => {
            if (node.type === 'file') {
              setWorkspaceState(prev => ({ ...prev, selectedFile: node.id }));
            }
          }}
        >
          {node.type === 'folder' && <ChevronRightIcon className="w-3 h-3 text-gray-400" />}
          {renderFileIcon(node)}
          <span className="text-white text-sm">{node.name}</span>
          {node.isShared && <ShareIcon className="w-3 h-3 text-green-400" />}
          {node.isStarred && <SparklesIcon className="w-3 h-3 text-yellow-400" />}
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </motion.div>
    ));
  };

  const renderActivityTimeline = () => (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
        >
          <div className={`w-2 h-2 rounded-full mt-2 ${
            activity.status === 'completed' ? 'bg-green-400' :
            activity.status === 'running' ? 'bg-blue-400 animate-pulse' :
            'bg-red-400'
          }`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{activity.description}</span>
              <span className="text-gray-400 text-xs">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {activity.duration && (
              <span className="text-gray-400 text-xs">Duration: {activity.duration}s</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPreview = () => (
    <div className="h-full bg-white/5 rounded-lg border border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm">Live</span>
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 h-64">
        <div className="text-gray-400 text-center mt-20">
          Preview will appear here as the agent builds your project
        </div>
      </div>
    </div>
  );

  if (workspaceState.mode === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <CpuChipIcon className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Muma Scout
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-lg mx-auto">
              Autonomous AI agent that takes you from 0 to 1. Start with a prompt, 
              watch as I browse the web, run commands, edit code, and build your project.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe what you want me to build... (e.g., 'Build a React todo app with Firebase backend')"
                className="w-full h-32 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <BoltIcon className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm">Express Mode</span>
              </div>
            </div>
            
            <motion.button
              onClick={handleStartWorkflow}
              disabled={!userPrompt.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              <PlayIcon className="w-5 h-5" />
              <span>Start Building</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 text-center"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <GlobeAltIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-medium">Web Browsing</div>
              <div className="text-gray-400 text-sm">Research & gather info</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <CommandLineIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-white font-medium">Terminal Commands</div>
              <div className="text-gray-400 text-sm">Install & configure</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <CodeBracketIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-white font-medium">Code Generation</div>
              <div className="text-gray-400 text-sm">Write & edit files</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (workspaceState.mode === 'planning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Muma Scout Planning</h2>
                  <p className="text-gray-400">Analyzing your request and creating a plan</p>
                </div>
              </div>
              {workspaceState.agentStatus === 'thinking' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-purple-400">Thinking...</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-white font-medium mb-2">Your Request:</h3>
                <p className="text-gray-300">{userPrompt}</p>
              </div>

              {agentPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <h3 className="text-white font-medium mb-4">My Plan:</h3>
                  <div className="text-gray-300 whitespace-pre-line">{agentPlan}</div>
                </motion.div>
              )}

              {agentPlan && workspaceState.agentStatus === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-4"
                >
                  <button
                    onClick={handleApprovePlan}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Approve & Start Building</span>
                  </button>
                  <button
                    onClick={() => setWorkspaceState(prev => ({ ...prev, mode: 'landing' }))}
                    className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                  >
                    Revise Plan
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Workspace Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <CpuChipIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">Muma Scout Workspace</h1>
                <p className="text-gray-400 text-sm">{userPrompt}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                workspaceState.agentStatus === 'working' ? 'bg-blue-400 animate-pulse' :
                workspaceState.agentStatus === 'completed' ? 'bg-green-400' :
                'bg-gray-400'
              }`} />
              <span className="text-white text-sm capitalize">{workspaceState.agentStatus}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ChartBarSquareIcon className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm">{Math.round(workspaceState.progress)}%</span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${workspaceState.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            <button
              onClick={toggleWorkspaceExpansion}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {workspaceState.isExpanded ? 
                <ArrowsPointingInIcon className="w-4 h-4 text-white" /> : 
                <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - File Tree */}
        <AnimatePresence>
          {workspaceState.isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: leftPanelWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white/5 border-r border-white/10 flex flex-col"
              style={{ width: leftPanelWidth }}
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">File Explorer</h3>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 hover:bg-white/10 rounded">
                      <FolderPlusIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded">
                      <DocumentPlusIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded">
                      <ArrowUpTrayIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {renderFileTree(fileTree)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center - Chat Interface */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="h-full bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Agent Chat</h2>
                <button
                  onClick={() => setIsFloatingTerminalOpen(!isFloatingTerminalOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ComputerDesktopIcon className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Virtual Computer</span>
                </button>
              </div>
              
              <div className="h-full flex flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <CpuChipIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-4">
                      <p className="text-white">I'm now building your project! You can watch my progress in real-time through the timeline and file explorer.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>Agent is actively working on your project...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Timeline/Preview */}
        <AnimatePresence>
          {workspaceState.isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: rightPanelWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white/5 border-l border-white/10 flex flex-col"
              style={{ width: rightPanelWidth }}
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
                  {(['timeline', 'preview'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setWorkspaceState(prev => ({ ...prev, activeTab: tab }))}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                        workspaceState.activeTab === tab
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab === 'timeline' && <ClockIcon className="w-4 h-4" />}
                      {tab === 'preview' && <EyeIcon className="w-4 h-4" />}
                      <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {workspaceState.activeTab === 'timeline' && renderActivityTimeline()}
                {workspaceState.activeTab === 'preview' && renderPreview()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 flex flex-col space-y-3">
        <motion.button
          onClick={() => setIsFloatingTerminalOpen(!isFloatingTerminalOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <CommandLineIcon className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.button
          onClick={() => setIsFloatingBrowserOpen(!isFloatingBrowserOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <GlobeAltIcon className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default MumaScoutWorkspace;