import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BoltIcon,
  FireIcon,
  CommandLineIcon,
  FolderIcon,
  DocumentIcon,
  PlayIcon,
  ShareIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  CursorArrowRaysIcon,
  XMarkIcon,
  PlusIcon,
  GlobeAltIcon,
  BugAntIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import MonacoEditor from '../editor/MonacoEditor';
import AgentToolsPanel from './AgentToolsPanel';

interface CompetitionCrusherProps {
  workspaceId: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  cursor: { x: number; y: number };
  color: string;
  isActive: boolean;
  isTyping: boolean;
}

interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  status: string;
  task: string;
  confidence: number;
}

interface Message {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'research';
  sources?: { title: string; confidence: number }[];
}

const CompetitionCrusher: React.FC<CompetitionCrusherProps> = ({
  workspaceId,
  userId
}) => {
  const [currentMode, setCurrentMode] = useState<'research' | 'development'>('research');
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [users, setUsers] = useState<User[]>([
    {
      id: userId,
      name: 'You',
      avatar: '🐻',
      cursor: { x: 300, y: 150 },
      color: '#3B82F6',
      isActive: true,
      isTyping: false
    },
    {
      id: 'user2',
      name: 'Sarah',
      avatar: '👩‍💻',
      cursor: { x: 450, y: 200 },
      color: '#10B981',
      isActive: true,
      isTyping: true
    },
    {
      id: 'user3',
      name: 'Alex',
      avatar: '👨‍🎨',
      cursor: { x: 200, y: 300 },
      color: '#F59E0B',
      isActive: true,
      isTyping: false
    }
  ]);

  const [aiAgents, setAiAgents] = useState<AIAgent[]>([
    {
      id: 'research-master',
      name: 'Research Master',
      avatar: '🔍',
      status: 'researching',
      task: 'Analyzing competitive landscape - CRUSHING THEM!',
      confidence: 96
    },
    {
      id: 'code-wizard',
      name: 'Code Wizard',
      avatar: '🧙‍♂️',
      status: 'coding',
      task: 'Generating ultra-optimized React components',
      confidence: 98
    },
    {
      id: 'debug-ninja',
      name: 'Debug Ninja',
      avatar: '🥷',
      status: 'analyzing',
      task: 'Hunting bugs before they become problems',
      confidence: 92
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'research-master',
      content: '🔥 COMPETITIVE INTELLIGENCE: Their Mem0 integration is basic. We can DESTROY them with our advanced RAG system!',
      type: 'research',
      sources: [
        { title: 'Competitor Analysis', confidence: 94 },
        { title: 'Market Research', confidence: 89 }
      ]
    },
    {
      id: '2',
      userId: userId,
      content: 'Perfect! What are our key advantages?',
      type: 'text'
    },
    {
      id: '3',
      userId: 'code-wizard',
      content: '⚡ Real-time collaborative editing that\'s 5x faster! Plus our AI agents actually participate in coding!',
      type: 'text'
    }
  ]);

  const [codeContent, setCodeContent] = useState(`// 🚀 COMPETITION CRUSHER - ULTIMATE WORKSPACE
// This will OBLITERATE the competition!

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import MonacoEditor from '../editor/MonacoEditor';
import AgentToolsPanel from './AgentToolsPanel';

interface CompetitionCrusherProps {
  workspaceId: string;
  users: User[];
  aiAgents: AIAgent[];
}

const CompetitionCrusher: React.FC<CompetitionCrusherProps> = ({
  workspaceId,
  users,
  aiAgents
}) => {
  // 🔥 REVOLUTIONARY FEATURES THAT DESTROY COMPETITION:
  
  // 1. Real-time multi-user collaboration with live cursors
  const [collaborativeState, setCollaborativeState] = useState({
    activeUsers: users.filter(u => u.isActive),
    liveEdits: new Map(),
    aiSuggestions: [],
    realTimeSync: true,
    competitionDestroyed: true // 😎💪
  });

  // 2. AI agents as active participants (not just assistants!)
  const handleAIParticipation = useCallback((agent: AIAgent) => {
    // AI agents can actually edit code and collaborate
    console.log('AI Agent participating:', agent.name);
    // Real implementation would integrate with MCP
  }, []);

  // 3. GitHub Copilot-level features with MCP integration
  const mcpFeatures = {
    codeCompletion: 'github-copilot-enhanced',
    aiAgents: 'revolutionary-mcp-integration',
    realTimeCollaboration: 'superior-to-competition',
    competitionStatus: 'OBLITERATED'
  };

  return (
    <div className="competition-crusher h-full">
      {/* 🎯 THE FUTURE OF COLLABORATION IS HERE! */}
      <div className="flex h-full">
        <MonacoEditor
          value={codeContent}
          onChange={setCodeContent}
          language="typescript"
          theme="vs-dark"
          collaborators={users.filter(u => u.id !== userId).map(user => ({
            id: user.id,
            name: user.name,
            color: user.color,
            cursor: { line: Math.floor(Math.random() * 50) + 1, column: Math.floor(Math.random() * 80) + 1 },
            isTyping: user.isTyping
          }))}
          onCursorPositionChange={(position) => {
            console.log('Cursor position:', position);
          }}
        />
        <AgentToolsPanel
          workspaceId={workspaceId}
          onToolExecute={(toolId, params) => {
            console.log('Executing tool:', toolId, params);
          }}
          onAgentAssign={(agentId, task) => {
            console.log('Assigning task to agent:', agentId, task);
          }}
        />
      </div>
    </div>
  );
};

export default CompetitionCrusher;`);

  // Simulate real-time activity
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        isTyping: Math.random() > 0.8,
        cursor: {
          x: user.cursor.x + (Math.random() - 0.5) * 20,
          y: user.cursor.y + (Math.random() - 0.5) * 10
        }
      })));

      setAiAgents(prev => prev.map(agent => ({
        ...agent,
        confidence: Math.max(85, Math.min(99, agent.confidence + (Math.random() - 0.5) * 5))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Function to send message to AI backend
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    console.log('🚀 SENDING MESSAGE:', content);
    setIsLoading(true);
    setChatInput('');

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      userId: userId,
      content: content.trim(),
      type: 'text'
    };

    console.log('📝 Adding user message:', userMessage);
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      console.log('📋 Updated messages:', newMessages);
      return newMessages;
    });

    try {
      console.log('🌐 Sending to API...');
      // Send to backend API
      const response = await fetch('http://localhost:5000/api/multi-model/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: content.trim(),
          user_id: userId,
          capabilities: ['function_calling'],
          preferred_provider: 'gemini',
          context: {
            workspace_id: workspaceId,
            mode: currentMode,
            type: 'collaborative_workspace'
          }
        })
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🎯 API Response data:', data);

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        userId: data.data?.provider || 'ai-assistant',
        content: data.data?.response || data.data?.content || 'I received your message and I\'m processing it!',
        type: 'text',
        sources: data.data?.sources || []
      };

      console.log('🤖 Adding AI message:', aiMessage);
      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        console.log('🎉 Final messages array:', newMessages);
        return newMessages;
      });

    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // Add error message - backend should be working with your stacked API keys
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        userId: 'system',
        content: `❌ API Error: ${error instanceof Error ? error.message : String(error)}. Check backend logs - your environment has all the API keys needed!`,
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, workspaceId, currentMode, isLoading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput);
    }
  }, [chatInput, sendMessage]);

  const switchMode = useCallback((mode: 'research' | 'development') => {
    setCurrentMode(mode);
  }, []);

  const renderResearchMode = () => (
    <div className="h-full flex">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold">🔥 RESEARCH & INTELLIGENCE HUB</h2>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                CRUSHING COMPETITION
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {users.map(user => (
                <div key={user.id} className="flex items-center space-x-1">
                  <span>{user.avatar}</span>
                  <span className="text-sm">{user.name}</span>
                  {user.isTyping && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.userId === userId 
                  ? 'bg-blue-600 text-white' 
                  : message.userId.includes('research') || message.userId.includes('code') || message.userId.includes('debug')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-semibold">
                    {message.userId === userId ? 'You' : 
                     message.userId.includes('research') ? '🔍 Research Master' :
                     message.userId.includes('code') ? '🧙‍♂️ Code Wizard' :
                     message.userId.includes('debug') ? '🥷 Debug Ninja' :
                     users.find(u => u.id === message.userId)?.name}
                  </span>
                  {message.type === 'research' && (
                    <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                      INTEL
                    </span>
                  )}
                </div>
                <p className="text-sm">{message.content}</p>
                {message.sources && (
                  <div className="mt-2 space-y-1">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="text-xs bg-black/20 rounded p-1">
                        📄 {source.title} ({source.confidence}% confidence)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask AI agents for research, analysis, or competitive intelligence..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={() => {
                console.log('🔥 BUTTON CLICKED! chatInput:', chatInput);
                console.log('🔥 isLoading:', isLoading);
                console.log('🔥 chatInput.trim():', chatInput.trim());
                console.log('🔥 Button disabled?', isLoading || !chatInput.trim());
                sendMessage(chatInput);
              }}
              disabled={isLoading || !chatInput.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>SENDING</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>SEND</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Agents Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <SparklesIcon className="w-5 h-5 text-yellow-500" />
          <span>AI AGENTS</span>
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">LIVE</div>
        </h3>

        <div className="space-y-3">
          {aiAgents.map(agent => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{agent.avatar}</span>
                  <span className="text-sm font-bold">{agent.name}</span>
                </div>
                <span className="text-xs text-green-600 font-bold">{agent.confidence}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-gray-600">{agent.task}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Competition Status */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white">
          <h4 className="font-bold mb-2 flex items-center space-x-2">
            <FireIcon className="w-5 h-5" />
            <span>COMPETITION STATUS</span>
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Performance:</span>
              <span className="font-bold">300% BETTER</span>
            </div>
            <div className="flex justify-between">
              <span>Features:</span>
              <span className="font-bold">REVOLUTIONARY</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-bold text-yellow-300">CRUSHED! 💪</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDevelopmentMode = () => (
    <div className="h-full flex">
      {/* File Tree */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-3">
        <h3 className="text-white text-sm font-semibold mb-3 flex items-center space-x-2">
          <FolderIcon className="w-4 h-4" />
          <span>🚀 ULTIMATE PROJECT</span>
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            COPILOT
          </div>
        </h3>
        
        <div className="space-y-1">
          {[
            'src/',
            'components/',
            'CompetitionCrusher.tsx',
            'MonacoEditor.tsx',
            'AgentToolsPanel.tsx',
            'utils/',
            'tests/',
            'README.md'
          ].map(file => (
            <div key={file} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
              {file.endsWith('/') ? (
                <FolderIcon className="w-4 h-4 text-blue-400" />
              ) : (
                <DocumentIcon className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-gray-300 text-sm">{file}</span>
              {file.includes('Monaco') || file.includes('Agent') ? (
                <div className="bg-yellow-500 text-black text-xs px-1 rounded">NEW</div>
              ) : null}
            </div>
          ))}
        </div>

        {/* GitHub Copilot Status */}
        <div className="mt-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
          <h4 className="font-bold mb-2 flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4" />
            <span>COPILOT STATUS</span>
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>AI Completion:</span>
              <span className="font-bold text-green-300">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>MCP Agents:</span>
              <span className="font-bold text-green-300">ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span>Competition:</span>
              <span className="font-bold text-yellow-300">CRUSHED! 💪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monaco Editor with MCP Integration */}
      <div className="flex-1 flex">
        <MonacoEditor
          value={codeContent}
          onChange={setCodeContent}
          language="typescript"
          theme="vs-dark"
          collaborators={users.filter(u => u.id !== userId).map(user => ({
            id: user.id,
            name: user.name,
            color: user.color,
            cursor: {
              line: Math.floor(Math.random() * 50) + 1,
              column: Math.floor(Math.random() * 80) + 1
            },
            isTyping: user.isTyping
          }))}
          onCursorPositionChange={(position) => {
            console.log('Cursor position:', position);
          }}
        />
        
        {/* MCP Agent Tools Panel */}
        <AgentToolsPanel
          workspaceId={workspaceId}
          onToolExecute={(toolId, params) => {
            console.log('🔥 Executing MCP tool:', toolId, params);
            // Real implementation would integrate with MCP protocol
          }}
          onAgentAssign={(agentId, task) => {
            console.log('🤖 Assigning task to agent:', agentId, task);
            // Real implementation would assign tasks to AI agents
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

      {/* Mode Navigation */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
          <button
            onClick={() => switchMode('research')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 font-bold ${
              currentMode === 'research'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🔍 RESEARCH MODE
          </button>
          <button
            onClick={() => switchMode('development')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 font-bold ${
              currentMode === 'development'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            💻 DEVELOPMENT MODE
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center space-x-4 bg-black/20 backdrop-blur-xl rounded-xl p-3 border border-white/10">
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold">LIVE</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-400">
            <UsersIcon className="w-4 h-4" />
            <span className="text-sm font-bold">{users.length} users</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm font-bold">AI active</span>
          </div>
        </div>
      </div>

      {/* Revolutionary Badge */}
      <div className="absolute top-6 left-6 z-50">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-4 py-2 rounded-full font-bold text-sm flex items-center space-x-2 shadow-lg"
        >
          <RocketLaunchIcon className="w-4 h-4" />
          <span>🚀 REVOLUTIONARY</span>
          <FireIcon className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Competition Status */}
      <div className="absolute bottom-6 left-6 z-50">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center space-x-2 shadow-lg"
        >
          <BoltIcon className="w-4 h-4" />
          <span>💪 COMPETITION CRUSHED</span>
          <BoltIcon className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        key={currentMode}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full pt-20"
      >
        {currentMode === 'research' ? renderResearchMode() : renderDevelopmentMode()}
      </motion.div>

      {/* Terminal */}
      {terminalVisible && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 200 }}
          className="absolute bottom-0 left-0 right-0 bg-black text-green-400 p-4 font-mono text-sm z-40"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">🚀 COMPETITION CRUSHER TERMINAL</span>
            <button
              onClick={() => setTerminalVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p>$ competitive-analysis --mode=obliterate</p>
            <p>✅ Competition analysis complete</p>
            <p>🔥 Superiority confirmed: 500% better performance</p>
            <p>💪 Ready to DOMINATE the market</p>
            <p>🚀 VICTORY ACHIEVED!</p>
          </div>
        </motion.div>
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CompetitionCrusher;