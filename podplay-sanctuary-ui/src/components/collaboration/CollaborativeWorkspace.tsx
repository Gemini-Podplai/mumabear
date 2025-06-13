import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  UsersIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  ShareIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  CommandLineIcon,
  GlobeAltIcon,
  FolderIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  FireIcon,
  BeakerIcon,
  LightBulbIcon,
  PlusIcon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface CollaborativeWorkspaceProps {
  workspaceId: string;
  userId: string;
  onModeChange?: (mode: 'chat' | 'research' | 'ide' | 'agent') => void;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  cursor: { x: number; y: number };
  color: string;
  isActive: boolean;
  currentTool?: string;
}

interface Agent {
  id: string;
  name: string;
  type: 'research' | 'code' | 'design' | 'test' | 'deploy';
  status: 'idle' | 'working' | 'thinking' | 'error';
  currentTask?: string;
  progress: number;
}

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'file' | 'agent_action';
  metadata?: any;
}

const CollaborativeWorkspace: React.FC<CollaborativeWorkspaceProps> = ({
  workspaceId,
  userId,
  onModeChange
}) => {
  const [currentMode, setCurrentMode] = useState<'chat' | 'research' | 'ide' | 'agent'>('chat');
  const [users, setUsers] = useState<User[]>([
    {
      id: userId,
      name: 'You',
      avatar: '🐻',
      cursor: { x: 0, y: 0 },
      color: 'rgb(59, 130, 246)',
      isActive: true,
      currentTool: 'chat'
    },
    {
      id: 'user2',
      name: 'Sarah',
      avatar: '👩‍💻',
      cursor: { x: 200, y: 150 },
      color: 'rgb(16, 185, 129)',
      isActive: true,
      currentTool: 'research'
    },
    {
      id: 'user3',
      name: 'Alex',
      avatar: '👨‍🎨',
      cursor: { x: 400, y: 300 },
      color: 'rgb(245, 101, 101)',
      isActive: true,
      currentTool: 'ide'
    }
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'research-agent',
      name: 'Research Scout',
      type: 'research',
      status: 'working',
      currentTask: 'Analyzing market trends for AI collaboration tools',
      progress: 67
    },
    {
      id: 'code-agent',
      name: 'Code Wizard',
      type: 'code',
      status: 'thinking',
      currentTask: 'Optimizing React component performance',
      progress: 23
    },
    {
      id: 'design-agent',
      name: 'Design Genius',
      type: 'design',
      status: 'idle',
      progress: 0
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'research-agent',
      content: '🔍 Found 47 relevant research papers on collaborative AI workspaces. The competition is using basic screen sharing - we can do SO much better!',
      timestamp: new Date(Date.now() - 300000),
      type: 'agent_action'
    },
    {
      id: '2',
      userId: 'user2',
      content: 'Perfect! Let\'s analyze their weaknesses and build something revolutionary.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      userId: 'code-agent',
      content: '💻 I can implement real-time collaborative cursors, live code execution, and AI-powered pair programming. Their system can\'t handle this level of sophistication!',
      timestamp: new Date(Date.now() - 180000),
      type: 'agent_action'
    }
  ]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sharedBrowserUrl, setSharedBrowserUrl] = useState('https://research.mumabear.dev');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentInput, setCurrentInput] = useState('');

  const workspaceRef = useRef<HTMLDivElement>(null);

  // Simulate real-time cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        cursor: {
          x: user.cursor.x + (Math.random() - 0.5) * 20,
          y: user.cursor.y + (Math.random() - 0.5) * 20
        }
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate agent progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        progress: agent.status === 'working' 
          ? Math.min(100, agent.progress + Math.random() * 5)
          : agent.progress
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleModeTransition = useCallback((newMode: 'chat' | 'research' | 'ide' | 'agent') => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentMode(newMode);
      onModeChange?.(newMode);
      setIsTransitioning(false);
    }, 1000);
  }, [onModeChange]);

  const sendMessage = useCallback(() => {
    if (!currentInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId,
      content: currentInput,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentInput('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'research-agent',
        content: `🤖 Analyzing your request: "${currentInput}". I'll research this and provide insights in real-time!`,
        timestamp: new Date(),
        type: 'agent_action'
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1500);
  }, [currentInput, userId]);

  const renderChatMode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              🚀
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Collaborative Research Hub</h2>
              <p className="text-sm text-gray-400">AI-Powered Team Workspace</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {users.filter(u => u.isActive).map(user => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.avatar}
              </div>
            ))}
            <div className="text-xs text-gray-400 ml-2">
              {users.filter(u => u.isActive).length} online
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start space-x-3 ${
              message.type === 'agent_action' ? 'bg-blue-500/10 p-3 rounded-lg' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm">
              {message.userId === userId ? '🐻' : 
               message.userId.includes('agent') ? '🤖' : '👤'}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-white">
                  {message.userId === userId ? 'You' : 
                   message.userId.includes('agent') ? 'AI Agent' : 'Team Member'}
                </span>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{message.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything... AI agents are listening 🤖"
            className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderResearchMode = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex"
    >
      {/* Shared Browser */}
      <div className="flex-1 bg-white rounded-lg m-4 overflow-hidden">
        <div className="bg-gray-100 p-2 flex items-center space-x-2 border-b">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <input
            type="text"
            value={sharedBrowserUrl}
            onChange={(e) => setSharedBrowserUrl(e.target.value)}
            className="flex-1 bg-white border rounded px-2 py-1 text-sm"
          />
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <EyeIcon className="w-4 h-4" />
            <span>{users.filter(u => u.isActive).length} viewing</span>
          </div>
        </div>
        <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <GlobeAltIcon className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Shared Research Browser</h3>
            <p className="text-gray-600">Everyone sees the same content in real-time</p>
          </div>
        </div>
      </div>

      {/* Research Panel */}
      <div className="w-80 bg-black/20 border-l border-white/10 p-4">
        <h3 className="text-white font-semibold mb-4">AI Research Insights</h3>
        <div className="space-y-3">
          {agents.filter(a => a.type === 'research').map(agent => (
            <div key={agent.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{agent.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  agent.status === 'working' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
              </div>
              {agent.currentTask && (
                <p className="text-xs text-gray-400 mb-2">{agent.currentTask}</p>
              )}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${agent.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderIDEMode = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full bg-gray-900 flex"
    >
      {/* File Explorer */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-2">
        <h3 className="text-white text-sm font-semibold mb-3">Project Files</h3>
        <div className="space-y-1">
          {['src/', 'components/', 'utils/', 'README.md', 'package.json'].map(file => (
            <div key={file} className="flex items-center space-x-2 p-1 hover:bg-gray-700 rounded cursor-pointer">
              <FolderIcon className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{file}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 p-2 border-b border-gray-700 flex items-center space-x-2">
          <span className="text-gray-300 text-sm">CollaborativeWorkspace.tsx</span>
          <div className="flex items-center space-x-1 ml-auto">
            {users.filter(u => u.currentTool === 'ide').map(user => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: user.color }}
                title={`${user.name} is editing`}
              >
                {user.avatar}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-gray-900 p-4 font-mono text-sm text-gray-300 relative">
          <pre className="whitespace-pre-wrap">
{`// 🚀 Revolutionary Collaborative IDE
import React from 'react';

const CollaborativeWorkspace = () => {
  // 🤖 AI agents can edit this code in real-time
  const [users, setUsers] = useState([]);
  
  // 👥 Multi-user cursors and live editing
  const handleCodeChange = (change) => {
    // Broadcast to all users instantly
    broadcastChange(change);
  };
  
  return (
    <div className="revolutionary-workspace">
      {/* 🔥 This beats ChatGPT by miles! */}
    </div>
  );
};`}
          </pre>
          
          {/* Live Cursors */}
          {users.filter(u => u.currentTool === 'ide').map(user => (
            <motion.div
              key={user.id}
              className="absolute pointer-events-none"
              style={{
                left: user.cursor.x,
                top: user.cursor.y,
                color: user.color
              }}
              animate={{
                x: [0, 5, 0],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <CursorArrowRaysIcon className="w-4 h-4" />
              <span className="text-xs bg-black/80 text-white px-1 rounded ml-1">
                {user.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
        <h3 className="text-white font-semibold mb-4">AI Code Assistant</h3>
        <div className="space-y-3">
          {agents.filter(a => a.type === 'code').map(agent => (
            <div key={agent.id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">{agent.name}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{agent.currentTask}</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded">
                Apply AI Suggestions
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div ref={workspaceRef} className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Mode Navigation */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full p-2 border border-white/20">
          {[
            { mode: 'chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
            { mode: 'research', icon: MagnifyingGlassIcon, label: 'Research' },
            { mode: 'ide', icon: CodeBracketIcon, label: 'IDE' },
            { mode: 'agent', icon: SparklesIcon, label: 'Agents' }
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => handleModeTransition(mode as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                currentMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transition Animation */}
      {isTransitioning ? (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 text-4xl"
            >
              🚀
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Transitioning Workspace</h2>
            <p className="text-gray-400">Preparing revolutionary collaboration tools...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={currentMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full pt-20"
        >
          {currentMode === 'chat' && renderChatMode()}
          {currentMode === 'research' && renderResearchMode()}
          {currentMode === 'ide' && renderIDEMode()}
        </motion.div>
      )}

      {/* Live User Cursors */}
      {users.filter(u => u.id !== userId && u.isActive).map(user => (
        <motion.div
          key={user.id}
          className="absolute pointer-events-none z-30"
          style={{
            left: user.cursor.x,
            top: user.cursor.y,
            color: user.color
          }}
          animate={{
            x: user.cursor.x,
            y: user.cursor.y
          }}
          transition={{ duration: 0.5 }}
        >
          <CursorArrowRaysIcon className="w-5 h-5" />
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded ml-2 whitespace-nowrap">
            {user.name} • {user.currentTool}
          </div>
        </motion.div>
      ))}

      {/* Floating Status Bar */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <UsersIcon className="w-4 h-4 text-green-400" />
            <span className="text-white">{users.filter(u => u.isActive).length} online</span>
          </div>
          <div className="flex items-center space-x-1">
            <SparklesIcon className="w-4 h-4 text-blue-400" />
            <span className="text-white">{agents.filter(a => a.status === 'working').length} agents active</span>
          </div>
          <div className="flex items-center space-x-1">
            <BoltIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-white">Real-time sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeWorkspace;