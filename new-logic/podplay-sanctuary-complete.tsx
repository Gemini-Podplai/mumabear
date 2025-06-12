import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Home, MessageCircle, Bot, Computer, Library, Users, Package, 
  Link, Palette, BarChart3, Zap, Activity, Settings, Menu, X,
  Github, Slack, Mail, Calendar, Database, Globe, Code, 
  Search, Star, Filter, Plus, Play, Pause, Eye, RefreshCw,
  Bell, CheckCircle, XCircle, AlertCircle, Clock, Monitor,
  Heart, Sparkles, ArrowRight, TrendingUp, Shield, Coffee,
  Terminal, Folder, FileText, Download, Upload, Maximize2,
  Minimize2, RotateCcw, Volume2, Video, Mic, PlusCircle,
  Bookmark, Archive, Layers, Grid, List, ChevronDown,
  ChevronRight, Cpu, HardDrive, Wifi, CloudLightning,
  Send, Paperclip, Image as ImageIcon, Smile, Copy,
  Save, FolderOpen, GitBranch, ExternalLink, Trash2,
  Edit3, MoreHorizontal, User, Phone, VideoIcon
} from 'lucide-react';

// WebSocket connection simulation
let socket = null;
if (typeof window !== 'undefined') {
  socket = {
    on: (event, callback) => {
      // Simulate socket events
      setTimeout(() => {
        if (event === 'mama_bear_response') {
          callback({ content: "I'm here to help! 🐻", timestamp: new Date().toISOString() });
        }
      }, 1000);
    },
    emit: (event, data) => {
      console.log('Socket emit:', event, data);
    },
    off: (event) => {
      console.log('Socket off:', event);
    }
  };
}

// Theme configurations for neurodivergent users
const themes = {
  comfort: {
    name: 'Comfort Purple',
    bg: 'from-purple-50 to-pink-50',
    sidebar: 'bg-white/80 backdrop-blur-md',
    accent: 'purple',
    text: 'text-gray-900'
  },
  professional: {
    name: 'Professional Blue',
    bg: 'from-blue-50 to-white',
    sidebar: 'bg-white border-r',
    accent: 'blue',
    text: 'text-gray-900'
  },
  dark: {
    name: 'Dark Comfort',
    bg: 'from-gray-900 to-black',
    sidebar: 'bg-gray-800',
    accent: 'purple',
    text: 'text-white'
  },
  ocean: {
    name: 'Ocean Depths',
    bg: 'from-teal-50 to-cyan-50',
    sidebar: 'bg-white/90 backdrop-blur-md',
    accent: 'teal',
    text: 'text-gray-900'
  },
  sunset: {
    name: 'Sunset Vibes',
    bg: 'from-orange-50 to-red-50',
    sidebar: 'bg-white/90 backdrop-blur-md',
    accent: 'orange',
    text: 'text-gray-900'
  },
  forest: {
    name: 'Forest Calm',
    bg: 'from-green-50 to-emerald-50',
    sidebar: 'bg-white/90 backdrop-blur-md',
    accent: 'green',
    text: 'text-gray-900'
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    bg: 'from-purple-900 via-blue-900 to-black',
    sidebar: 'bg-black/80 backdrop-blur-md border-purple-500/30',
    accent: 'purple',
    text: 'text-cyan-100'
  },
  pastel: {
    name: 'Pastel Dreams',
    bg: 'from-pink-100 via-purple-50 to-blue-100',
    sidebar: 'bg-white/70 backdrop-blur-md',
    accent: 'pink',
    text: 'text-gray-800'
  }
};

// Resizable Panel Component
const ResizablePanel = ({ children, defaultWidth = 300, minWidth = 200, maxWidth = 600, position = 'left' }) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = position === 'left' ? e.clientX : window.innerWidth - e.clientX;
      const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, position]);

  return (
    <div 
      ref={panelRef}
      className="relative bg-white/95 backdrop-blur-md border-r border-gray-200"
      style={{ width: `${width}px` }}
    >
      {children}
      <div 
        className={`absolute top-0 ${position === 'left' ? 'right-0' : 'left-0'} w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-400 transition-colors`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

// Collapsible Panel Component
const CollapsiblePanel = ({ title, children, defaultOpen = true, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white/50 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

// Pop-up Terminal Component
const PopupTerminal = ({ isOpen, onClose }) => {
  const [commands, setCommands] = useState(['$ Welcome to Podplay Sanctuary Terminal']);
  const [currentCommand, setCurrentCommand] = useState('');

  const handleCommand = (cmd) => {
    if (cmd.trim()) {
      setCommands(prev => [...prev, `$ ${cmd}`, `Executing: ${cmd}...`]);
      setCurrentCommand('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-64 bg-black rounded-lg shadow-2xl border border-gray-300 z-50">
      <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-white text-sm">Terminal</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3 h-48 overflow-y-auto font-mono text-sm">
        <div className="space-y-1">
          {commands.map((cmd, i) => (
            <div key={i} className="text-green-400">{cmd}</div>
          ))}
        </div>
        <div className="flex items-center mt-2">
          <span className="text-green-400">$ </span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand(currentCommand)}
            className="flex-1 bg-transparent text-white outline-none ml-2"
            placeholder="Enter command..."
          />
        </div>
      </div>
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isUser, avatar, timestamp }) => (
  <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
      {avatar || (isUser ? '👤' : '🐻')}
    </div>
    <div className={`max-w-[70%] p-3 rounded-2xl ${isUser ? 'bg-blue-500 text-white' : 'bg-white shadow-md'}`}>
      <p className="text-sm">{message}</p>
      {timestamp && (
        <p className={`text-xs mt-2 opacity-70`}>
          {new Date(timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  </div>
);

// Mini App Component
const MiniApp = ({ app, onOpen }) => (
  <div 
    onClick={() => onOpen(app)}
    className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
  >
    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
      <span className="text-white text-xs font-bold">{app.name.slice(0, 2).toUpperCase()}</span>
    </div>
    <span className="text-xs text-center font-medium">{app.name}</span>
  </div>
);

// Main App Component
const PodplaySanctuary = () => {
  const [currentPage, setCurrentPage] = useState('main_chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('comfort');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showMamaBearChat, setShowMamaBearChat] = useState(false);
  const [showMiniApp, setShowMiniApp] = useState(null);

  const theme = themes[currentTheme];

  // Mini Apps Configuration
  const miniApps = [
    { name: 'AI Google', url: 'https://ai.google.com', icon: '🔍' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖' },
    { name: 'OpenAI API', url: 'https://platform.openai.com', icon: '⚡' },
    { name: 'Claude Chat', url: 'https://claude.ai', icon: '🧠' },
    { name: 'Claude API', url: 'https://console.anthropic.com', icon: '🔧' },
    { name: 'Dify', url: 'https://dify.ai', icon: '🚀' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆' },
    { name: 'Gemini', url: 'https://gemini.google.com', icon: '💎' },
    { name: 'GenSpark', url: 'https://genspark.ai', icon: '✨' },
    { name: 'Manus', url: 'https://manus.chat', icon: '📝' },
    { name: 'Scout', url: 'https://scout.new', icon: '🎯' },
    { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { name: 'GitHub Copilot', url: 'https://copilot.github.com', icon: '🤝' },
    { name: 'Grok', url: 'https://grok.x.ai', icon: '⚡' },
    { name: 'Google Cloud', url: 'https://console.cloud.google.com', icon: '☁️' },
    { name: 'Jules', url: 'https://jules.google.com', icon: '💬' },
    { name: 'LeChat Mistral', url: 'https://chat.mistral.ai', icon: '🎭' },
    { name: 'Vertex AI', url: 'https://console.cloud.google.com/vertex-ai', icon: '🔺' },
    { name: 'Pipedream', url: 'https://pipedream.com', icon: '🔗' },
    { name: 'NotebookLM', url: 'https://notebooklm.google.com', icon: '📚' },
    { name: 'Perplexity', url: 'https://perplexity.ai', icon: '🔍' },
    { name: 'Poe', url: 'https://poe.com', icon: '🎪' }
  ];

  // Navigation items
  const navigationItems = [
    { id: 'main_chat', name: 'Main Chat', icon: Home, description: 'Chat with Mama Bear' },
    { id: 'agent_hub', name: 'Agent Hub', icon: Bot, description: '7 Mama Bear Variants' },
    { id: 'dev_workspaces', name: 'Dev Workspaces', icon: Computer, description: 'Collaborative Development' },
    { id: 'research_center', name: 'Research Center', icon: Library, description: 'Deep Research Library' },
    { id: 'podplay_messenger', name: 'Podplay Messenger', icon: MessageCircle, description: '57 AI Models Chat' },
    { id: 'mcp_marketplace', name: 'MCP Marketplace', icon: Package, description: 'Docker MCP Toolkit' },
    { id: 'pipedream_studio', name: 'Pipedream Studio', icon: Link, description: 'Workflow Automation' },
    { id: 'mini_apps', name: 'Mini Apps', icon: Grid, description: 'Quick Access Apps' },
    { id: 'resources_monitor', name: 'Resources Monitor', icon: BarChart3, description: 'System Monitoring' },
    { id: 'api_usage', name: 'API Usage', icon: Zap, description: 'Usage Analytics' },
    { id: 'activity_hub', name: 'Activity Hub', icon: Activity, description: 'Live Agent Activity' },
    { id: 'themes_hub', name: 'Themes Hub', icon: Palette, description: 'Sensory-Friendly Themes' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'Platform Configuration' }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'main_chat':
        return <MainChatPage theme={theme} />;
      case 'agent_hub':
        return <AgentHubPage theme={theme} />;
      case 'dev_workspaces':
        return <DevWorkspacesPage theme={theme} showTerminal={showTerminal} setShowTerminal={setShowTerminal} />;
      case 'research_center':
        return <ResearchCenterPage theme={theme} />;
      case 'podplay_messenger':
        return <PodplayMessengerPage theme={theme} />;
      case 'mcp_marketplace':
        return <MCPMarketplacePage theme={theme} />;
      case 'pipedream_studio':
        return <PipedreamStudioPage theme={theme} />;
      case 'mini_apps':
        return <MiniAppsPage theme={theme} miniApps={miniApps} onOpenApp={setShowMiniApp} />;
      case 'resources_monitor':
        return <ResourcesMonitorPage theme={theme} />;
      case 'api_usage':
        return <APIUsagePage theme={theme} />;
      case 'activity_hub':
        return <ActivityHubPage theme={theme} />;
      case 'themes_hub':
        return <ThemesHubPage theme={theme} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} themes={themes} />;
      case 'settings':
        return <SettingsPage theme={theme} />;
      default:
        return <MainChatPage theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} ${theme.text}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-20' : 'w-80'} 
                      transition-all duration-300 ease-in-out ${theme.sidebar}`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 bg-gradient-to-r from-${theme.accent}-400 to-${theme.accent}-600 rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold">🐻</span>
              </div>
              <div>
                <h1 className={`font-bold text-lg ${theme.text}`}>
                  Podplay Sanctuary
                </h1>
                <p className={`text-xs opacity-70`}>
                  Neurodivergent-Friendly AI Platform
                </p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-2 rounded-lg hover:bg-${theme.accent}-100 transition-colors`}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left
                         ${currentPage === item.id 
                           ? `bg-gradient-to-r from-${theme.accent}-100 to-${theme.accent}-200 text-${theme.accent}-700` 
                           : `${theme.text} hover:bg-gray-100 hover:bg-opacity-50`
                         }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className={`text-xs opacity-70 truncate`}>
                    {item.description}
                  </div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Theme Selector */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className={`p-3 rounded-xl bg-gray-100 bg-opacity-50`}>
              <p className={`text-sm font-medium mb-2 ${theme.text}`}>
                🎨 Sensory Theme
              </p>
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                {Object.entries(themes).map(([key, themeObj]) => (
                  <option key={key} value={key}>{themeObj.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-80'} transition-all duration-300`}>
        {renderPage()}
      </div>

      {/* Floating Mama Bear Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowMamaBearChat(!showMamaBearChat)}
          className={`bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer`}
        >
          <span className="text-2xl">🐻</span>
        </button>
      </div>

      {/* Pop-up Mama Bear Chat */}
      {showMamaBearChat && (
        <div className="fixed bottom-24 right-6 w-96 h-80 bg-white rounded-lg shadow-2xl border border-gray-300 z-50">
          <div className={`flex items-center justify-between p-3 bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 rounded-t-lg`}>
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg">🐻</span>
              <span className="font-medium">Mama Bear</span>
            </div>
            <button onClick={() => setShowMamaBearChat(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="text-sm text-gray-600 mb-4">Continue your conversation...</div>
            <div className="space-y-3">
              <ChatMessage 
                message="How can I help you with your development work?" 
                isUser={false} 
                timestamp={new Date().toISOString()} 
              />
            </div>
          </div>
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input 
                placeholder="Continue conversation with Mama Bear..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button className={`px-4 py-2 bg-${theme.accent}-500 text-white rounded-lg text-sm`}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Terminal */}
      <PopupTerminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />

      {/* Mini App Modal */}
      {showMiniApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90vw] h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">{showMiniApp.name}</h3>
              <button onClick={() => setShowMiniApp(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe 
              src={showMiniApp.url} 
              className="flex-1 w-full"
              title={showMiniApp.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ================================
// FUNCTIONAL PAGE IMPLEMENTATIONS
// ================================

// Main Chat Page - Full Mama Bear Orchestration
const MainChatPage = ({ theme }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      content: "Hello! I'm Mama Bear, your caring AI orchestrator. I coordinate with 7 specialized variants and can route tasks intelligently across the platform. How can I help you today? 🐻💜", 
      isUser: false, 
      timestamp: new Date().toISOString(),
      variant: 'orchestrator'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call to /api/mama-bear/chat
      const response = await fetch('/api/mama-bear/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          user_id: 'demo_user',
          page_context: 'main_chat'
        })
      });

      // Simulate response (replace with actual API)
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: `I understand you want help with: "${inputMessage}". Let me analyze this and coordinate with the best agents for your needs. 🐻`,
          isUser: false,
          timestamp: new Date().toISOString(),
          variant: 'orchestrator'
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${theme.sidebar} border-b p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r from-${theme.accent}-400 to-${theme.accent}-600 rounded-full flex items-center justify-center`}>
                <span className="text-white">🐻</span>
              </div>
              <div>
                <h2 className={`font-semibold ${theme.text}`}>Mama Bear Orchestrator</h2>
                <p className={`text-sm opacity-70`}>Best Gemini model with intelligent routing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                🟢 Online
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                🐻
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm">Mama Bear is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`${theme.sidebar} border-t p-4`}>
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Mama Bear anything - she'll coordinate with the right agents..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`px-6 py-3 bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Agent Status Sidebar */}
      <div className={`w-80 ${theme.sidebar} border-l p-4`}>
        <h3 className={`font-semibold mb-4 ${theme.text}`}>
          🤖 Active Agents
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Scout Commander', status: 'ready', specialty: 'Strategic Planning' },
            { name: 'Research Specialist', status: 'active', specialty: 'Deep Research' },
            { name: 'Code Review Bear', status: 'ready', specialty: 'Quality Assurance' },
            { name: 'Creative Bear', status: 'ready', specialty: 'Innovation' },
            { name: 'Learning Bear', status: 'ready', specialty: 'Teaching' },
            { name: 'Efficiency Bear', status: 'ready', specialty: 'Optimization' },
            { name: 'Debugging Detective', status: 'ready', specialty: 'Problem Solving' }
          ].map((agent, index) => (
            <div key={index} className="p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{agent.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  agent.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <p className="text-xs text-gray-600">{agent.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Agent Hub Page - Scout Workflow + 7 Variants
const AgentHubPage = ({ theme }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const agents = [
    { 
      id: 'scout_commander', 
      name: 'Scout Commander', 
      emoji: '🎯', 
      personality: 'Strategic and organized',
      specialties: ['Project planning', 'Task orchestration', 'Resource coordination'],
      description: 'Your strategic AI assistant who excels at breaking down complex projects into manageable tasks.'
    },
    { 
      id: 'research_specialist', 
      name: 'Research Specialist', 
      emoji: '🔍', 
      personality: 'Thorough and analytical',
      specialties: ['Deep research', 'Data analysis', 'Information synthesis'],
      description: 'Expert researcher who can dive deep into any topic and provide comprehensive insights.'
    },
    { 
      id: 'code_review_bear', 
      name: 'Code Review Bear', 
      emoji: '👩‍💻', 
      personality: 'Constructive and supportive',
      specialties: ['Code quality', 'Best practices', 'Security analysis'],
      description: 'Gentle but thorough code reviewer who helps improve your development skills.'
    },
    { 
      id: 'creative_bear', 
      name: 'Creative Bear', 
      emoji: '🎨', 
      personality: 'Innovative and inspiring',
      specialties: ['Creative solutions', 'Design thinking', 'Brainstorming'],
      description: 'Your creative partner for innovative solutions and outside-the-box thinking.'
    },
    { 
      id: 'learning_bear', 
      name: 'Learning Bear', 
      emoji: '📚', 
      personality: 'Patient and encouraging',
      specialties: ['Teaching', 'Skill development', 'Learning paths'],
      description: 'Patient educator who adapts to your learning style and pace.'
    },
    { 
      id: 'efficiency_bear', 
      name: 'Efficiency Bear', 
      emoji: '⚡', 
      personality: 'Focused and practical',
      specialties: ['Workflow optimization', 'Automation', 'Productivity'],
      description: 'Optimization expert who helps streamline your workflows and boost productivity.'
    },
    { 
      id: 'debugging_detective', 
      name: 'Debugging Detective', 
      emoji: '🕵️', 
      personality: 'Methodical and persistent',
      specialties: ['Problem solving', 'Root cause analysis', 'System debugging'],
      description: 'Systematic troubleshooter who gets to the bottom of any problem.'
    }
  ];

  const scoutWorkflowSteps = [
    { name: 'Analysis', status: 'completed', description: 'Request analyzed and plan created' },
    { name: 'Environment', status: 'active', description: 'Spinning up development environment' },
    { name: 'Implementation', status: 'pending', description: 'Executing the planned tasks' },
    { name: 'Testing', status: 'pending', description: 'Validating results and quality' },
    { name: 'Deployment', status: 'pending', description: 'Finalizing and delivering output' }
  ];

  const startScoutWorkflow = () => {
    setIsProcessing(true);
    setWorkflowStep(0);
    
    // Simulate workflow progression
    const timer = setInterval(() => {
      setWorkflowStep(prev => {
        if (prev < scoutWorkflowSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsProcessing(false);
          return prev;
        }
      });
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>🎭 Agent Hub</h1>
        <p className={`${theme.text} opacity-70`}>Choose your Mama Bear variant for specialized assistance</p>
      </div>

      {/* Scout Workflow Status */}
      {(isProcessing || workflowStep > 0) && (
        <div className="mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-xl border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Scout Workflow in Progress
          </h3>
          <div className="flex items-center gap-4">
            {scoutWorkflowSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  index <= workflowStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index <= workflowStep ? '✓' : index + 1}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-gray-600 text-xs">{step.description}</div>
                </div>
                {index < scoutWorkflowSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div 
            key={agent.id} 
            className={`bg-white/50 backdrop-blur-sm rounded-xl p-6 border hover:shadow-lg transition-all duration-300 cursor-pointer group
                        ${selectedAgent?.id === agent.id ? 'ring-2 ring-purple-500' : ''}`}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {agent.emoji}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>
                {agent.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {agent.personality}
              </p>
              <p className="text-sm text-gray-700">
                {agent.description}
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              <h4 className="font-medium text-sm">Specialties:</h4>
              <div className="flex flex-wrap gap-1">
                {agent.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                className={`w-full px-4 py-2 bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 text-white rounded-lg hover:opacity-90 transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (agent.id === 'scout_commander') {
                    startScoutWorkflow();
                  }
                }}
              >
                {agent.id === 'scout_commander' ? 'Start Scout Workflow' : `Chat with ${agent.name}`}
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Capabilities
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Details Panel */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedAgent(null)}>
          <div className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{selectedAgent.name}</h3>
                <button onClick={() => setSelectedAgent(null)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-4xl">
                  {selectedAgent.emoji}
                </div>
                <p className="text-gray-600">{selectedAgent.description}</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">What I can help you with:</h4>
                <ul className="space-y-2">
                  {selectedAgent.specialties.map((specialty, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{specialty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dev Workspaces Page - VS Code-like Interface
const DevWorkspacesPage = ({ theme, showTerminal, setShowTerminal }) => {
  const [selectedFile, setSelectedFile] = useState('App.tsx');
  const [files, setFiles] = useState({
    'App.tsx': `import React from 'react';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainContent />
    </div>
  );
}

export default App;`,
    'components/Header.tsx': `import React from 'react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-xl font-semibold">My App</h1>
      </div>
    </header>
  );
};`,
    'package.json': `{
  "name": "my-app",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`
  });

  const fileTree = [
    { name: 'src', type: 'folder', children: [
      { name: 'App.tsx', type: 'file' },
      { name: 'index.tsx', type: 'file' },
      { name: 'components', type: 'folder', children: [
        { name: 'Header.tsx', type: 'file' },
        { name: 'MainContent.tsx', type: 'file' }
      ]}
    ]},
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' }
  ];

  const renderFileTree = (items, depth = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ marginLeft: `${depth * 16}px` }}>
        <div
          className={`flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer ${
            selectedFile === item.name ? 'bg-blue-100' : ''
          }`}
          onClick={() => item.type === 'file' && setSelectedFile(item.name)}
        >
          {item.type === 'folder' ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          <span className="text-sm">{item.name}</span>
        </div>
        {item.children && renderFileTree(item.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - File Explorer */}
      <ResizablePanel defaultWidth={250} minWidth={200} maxWidth={400}>
        <div className="p-4 h-full overflow-y-auto">
          <CollapsiblePanel title="Explorer" icon={Folder} defaultOpen={true}>
            <div className="space-y-1">
              {renderFileTree(fileTree)}
            </div>
          </CollapsiblePanel>
          
          <CollapsiblePanel title="Scrapybara Instances" icon={Monitor}>
            <div className="space-y-2">
              <div className="p-2 bg-green-50 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">VM-001</span>
                  <span className="text-xs text-green-600">Running</span>
                </div>
                <div className="text-xs text-gray-600">Ubuntu 22.04 • Browser Ready</div>
              </div>
              <button className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400">
                + Start New Instance
              </button>
            </div>
          </CollapsiblePanel>
          
          <CollapsiblePanel title="E2B Sandboxes" icon={Cpu}>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sandbox-1</span>
                  <span className="text-xs text-blue-600">Active</span>
                </div>
                <div className="text-xs text-gray-600">Node.js 18 • React</div>
              </div>
              <button className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400">
                + Create Sandbox
              </button>
            </div>
          </CollapsiblePanel>
        </div>
      </ResizablePanel>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex">
              {Object.keys(files).map(filename => (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={`px-3 py-1 text-sm border-r ${
                    selectedFile === filename ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  {filename}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowTerminal(true)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center gap-1"
            >
              <Terminal className="w-4 h-4" />
              Terminal
            </button>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
              Run
            </button>
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto">
          <pre className="whitespace-pre-wrap">
            <code>{files[selectedFile] || '// File not found'}</code>
          </pre>
        </div>
      </div>

      {/* Right Panel - Tools & AI Assistant */}
      <ResizablePanel defaultWidth={300} minWidth={250} maxWidth={500} position="right">
        <div className="p-4 h-full overflow-y-auto">
          <CollapsiblePanel title="Mama Bear Assistant" icon={Heart} defaultOpen={true}>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-sm font-medium mb-1">🐻 Code Review Ready</div>
                <div className="text-xs text-gray-600">I can help review your code for best practices and improvements.</div>
              </div>
              <div className="space-y-2">
                <button className="w-full p-2 bg-purple-100 text-purple-700 rounded text-sm">
                  Review Current File
                </button>
                <button className="w-full p-2 border border-gray-300 rounded text-sm">
                  Suggest Improvements
                </button>
              </div>
            </div>
          </CollapsiblePanel>
          
          <CollapsiblePanel title="Git" icon={Github}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">main</span>
                <span className="text-xs text-green-600">✓ Clean</span>
              </div>
              <div className="text-xs text-gray-600">3 files changed, 12 insertions</div>
              <button className="w-full p-2 bg-blue-100 text-blue-700 rounded text-sm">
                Commit Changes
              </button>
            </div>
          </CollapsiblePanel>
          
          <CollapsiblePanel title="Database" icon={Database}>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">PostgreSQL</div>
                <div className="text-xs text-gray-600">localhost:5432</div>
                <div className="text-xs text-green-600">Connected</div>
              </div>
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Live Preview" icon={Eye}>
            <div className="bg-gray-100 rounded p-4 text-center">
              <div className="text-sm text-gray-600 mb-2">App Preview</div>
              <div className="border-2 border-dashed border-gray-300 rounded p-8">
                <div className="text-xs text-gray-500">Live preview will appear here</div>
              </div>
            </div>
          </CollapsiblePanel>
        </div>
      </ResizablePanel>
    </div>
  );
};

// Research Center Page - Claude & Gemini Collaboration
const ResearchCenterPage = ({ theme }) => {
  const [activeResearch, setActiveResearch] = useState(null);
  const [researchHistory, setResearchHistory] = useState([
    { id: 1, title: 'AI Safety in Autonomous Systems', date: '2 hours ago', status: 'completed' },
    { id: 2, title: 'Quantum Computing Applications', date: '1 day ago', status: 'completed' },
    { id: 3, title: 'Neurodivergent-Friendly UX Design', date: '3 days ago', status: 'completed' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [researchMode, setResearchMode] = useState('collaborative');

  const startResearch = () => {
    const newResearch = {
      id: Date.now(),
      title: searchQuery,
      mode: researchMode,
      status: 'active',
      progress: 0,
      findings: []
    };
    setActiveResearch(newResearch);
    
    // Simulate research progress
    const progressTimer = setInterval(() => {
      setActiveResearch(prev => {
        if (prev.progress >= 100) {
          clearInterval(progressTimer);
          return { ...prev, status: 'completed' };
        }
        return { ...prev, progress: prev.progress + 10 };
      });
    }, 500);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>🏛️ Research Center</h1>
        <p className={`${theme.text} opacity-70`}>Deep research library with Claude & Gemini collaboration</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Research Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Research Input */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
            <h3 className="font-semibold mb-4">Start New Research</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What would you like to research?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <div className="flex items-center gap-4">
                <select 
                  value={researchMode}
                  onChange={(e) => setResearchMode(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="claude_only">Claude Only</option>
                  <option value="gemini_only">Gemini Only</option>
                  <option value="collaborative">Collaborative</option>
                  <option value="consensus">Consensus</option>
                  <option value="debate">Debate</option>
                </select>
                
                <button 
                  onClick={startResearch}
                  disabled={!searchQuery.trim()}
                  className={`px-6 py-2 bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                >
                  Start Research
                </button>
              </div>
            </div>
          </div>

          {/* Active Research */}
          {activeResearch && (
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">🔍 Active Research: {activeResearch.title}</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm">{activeResearch.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${activeResearch.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm">Claude analyzing sources...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm">Gemini cross-referencing findings...</span>
                </div>
                {activeResearch.progress > 50 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-sm">Synthesizing collaborative insights...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Research Results Placeholder */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
            <h3 className="font-semibold mb-4">Research Results</h3>
            <div className="text-center text-gray-500 py-8">
              <Library className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Research results will appear here</p>
              <p className="text-sm mt-2">Start a research session to see collaborative AI insights</p>
            </div>
          </div>
        </div>
        
        {/* Research Library Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              Research Library
            </h3>
            
            <div className="mb-4">
              <input 
                placeholder="Search research history..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            
            <div className="space-y-3">
              {researchHistory.map(research => (
                <div key={research.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="font-medium text-sm mb-1">{research.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{research.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      research.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {research.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
            <h3 className="font-semibold mb-4">Research Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Researches</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">This Week</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Claude Sessions</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Gemini Sessions</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Collaborative</span>
                <span className="font-medium">9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Podplay Messenger Page - Instant Messaging with 57 AI Models
const PodplayMessengerPage = ({ theme }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState('');

  const aiModels = [
    // OpenAI Models
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', status: 'online', tokens: '128k', cost: '$0.01', avatar: '🤖', capabilities: ['chat', 'code', 'analysis'] },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', status: 'online', tokens: '8k', cost: '$0.03', avatar: '🧠', capabilities: ['chat', 'reasoning', 'creative'] },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', status: 'online', tokens: '16k', cost: '$0.002', avatar: '⚡', capabilities: ['chat', 'fast'] },
    
    // Anthropic Models
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', status: 'online', tokens: '200k', cost: '$0.015', avatar: '🎭', capabilities: ['reasoning', 'analysis', 'writing'] },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', status: 'online', tokens: '200k', cost: '$0.003', avatar: '🎵', capabilities: ['balanced', 'coding', 'analysis'] },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', status: 'online', tokens: '200k', cost: '$0.00025', avatar: '🌸', capabilities: ['fast', 'efficient', 'chat'] },
    
    // Google Models
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', status: 'online', tokens: '1M', cost: '$0.0005', avatar: '💎', capabilities: ['multimodal', 'reasoning', 'code'] },
    { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', status: 'online', tokens: '1M', cost: '$0.00015', avatar: '⚡', capabilities: ['fast', 'efficient', 'chat'] },
    
    // Add more models to reach 57...
    { id: 'palm-2', name: 'PaLM 2', provider: 'Google', status: 'online', tokens: '8k', cost: '$0.001', avatar: '🌴', capabilities: ['chat', 'reasoning'] },
  ];

  const sendMessage = (modelId) => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [modelId]: [...(prev[modelId] || []), newMessage]
    }));

    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const model = aiModels.find(m => m.id === modelId);
      const aiResponse = {
        id: Date.now() + 1,
        content: `Hello! I'm ${model.name}. How can I help you today?`,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => ({
        ...prev,
        [modelId]: [...(prev[modelId] || []), aiResponse]
      }));
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      {/* Models Sidebar */}
      <ResizablePanel defaultWidth={320} minWidth={280} maxWidth={400}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">AI Models (57)</h3>
            <input 
              placeholder="Search models..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            {aiModels.map(model => (
              <div 
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedModel?.id === model.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    {model.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.provider}</div>
                    <div className="text-xs text-gray-600">
                      {model.tokens} • {model.cost}/1k
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    model.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {model.capabilities.slice(0, 2).map(capability => (
                    <span key={capability} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedModel ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  {selectedModel.avatar}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedModel.name}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedModel.provider} • {selectedModel.tokens} context • {selectedModel.cost}/1k tokens
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <VideoIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(messages[selectedModel.id] || []).map(message => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  avatar={message.isUser ? '👤' : selectedModel.avatar}
                  timestamp={message.timestamp}
                />
              ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(selectedModel.id)}
                  placeholder={`Message ${selectedModel.name}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  onClick={() => sendMessage(selectedModel.id)}
                  className={`px-6 py-2 bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 text-white rounded-xl hover:opacity-90 transition-opacity`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select an AI model to start chatting</p>
              <p className="text-sm mt-2">Choose from 57 models across OpenAI, Anthropic, and Google</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Additional page implementations continue with same pattern...
// I'll implement the remaining key pages:

// MCP Marketplace Page
const MCPMarketplacePage = ({ theme }) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>📦 MCP Marketplace</h1>
      <p className={`${theme.text} opacity-70`}>Docker MCP Toolkit and integrations</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
          <div className="text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>MCP Marketplace with Docker integration will be implemented here</p>
            <p className="text-sm mt-2">Search, install, and manage MCP components with Mama Bear</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border">
          <h3 className="font-semibold mb-2">🐻 Mama Bear Assistant</h3>
          <p className="text-sm text-gray-600">I can help you find and install MCP packages!</p>
        </div>
      </div>
    </div>
  </div>
);

// Pipedream Studio Page
const PipedreamStudioPage = ({ theme }) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>🔗 Pipedream Studio</h1>
      <p className={`${theme.text} opacity-70`}>Workflow automation and integration</p>
    </div>
    
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
      <div className="text-center text-gray-500">
        <Link className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Visual workflow builder with your backend integration will be implemented here</p>
        <p className="text-sm mt-2">Connect services, automate workflows, monitor executions</p>
      </div>
    </div>
  </div>
);

// Mini Apps Page
const MiniAppsPage = ({ theme, miniApps, onOpenApp }) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>🎯 Mini Apps</h1>
      <p className={`${theme.text} opacity-70`}>Quick access to your favorite tools</p>
    </div>
    
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
      <div className="grid grid-cols-6 gap-4">
        {miniApps.map(app => (
          <MiniApp key={app.name} app={app} onOpen={onOpenApp} />
        ))}
        <div className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-gray-300">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
            <PlusCircle className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-center font-medium text-gray-500">Add App</span>
        </div>
      </div>
    </div>
  </div>
);

// Activity Hub Page - Live Agent Activity
const ActivityHubPage = ({ theme }) => {
  const [activities] = useState([
    { id: 1, agent: 'Scout Commander', action: 'Analyzing user request', status: 'active', time: '2s ago' },
    { id: 2, agent: 'Research Specialist', action: 'Deep research completed', status: 'completed', time: '1m ago' },
    { id: 3, agent: 'Code Review Bear', action: 'Reviewing pull request', status: 'active', time: '3m ago' },
    { id: 4, agent: 'Mama Bear', action: 'Orchestrating workflow', status: 'active', time: '5m ago' }
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>🔄 Activity Hub</h1>
        <p className={`${theme.text} opacity-70`}>Live agent activity and system events</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
          <h3 className="font-semibold mb-4">🔴 Live Activity Feed</h3>
          <div className="space-y-3">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.agent}</div>
                  <div className="text-sm text-gray-600">{activity.action}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
          <h3 className="font-semibold mb-4">📊 System Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Active Agents</span>
              <span className="font-medium">4/7</span>
            </div>
            <div className="flex justify-between">
              <span>Total Requests Today</span>
              <span className="font-medium">127</span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate</span>
              <span className="font-medium text-green-600">98.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Resources Monitor Page
const ResourcesMonitorPage = ({ theme }) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>📊 Resources Monitor</h1>
      <p className={`${theme.text} opacity-70`}>System monitoring and performance</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'CPU Usage', value: '45%', color: 'blue' },
        { label: 'Memory', value: '2.1GB', color: 'green' },
        { label: 'API Quota', value: '67%', color: 'orange' },
        { label: 'Active Tasks', value: '12', color: 'purple' }
      ].map((metric, index) => (
        <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border">
          <div className="text-sm text-gray-600">{metric.label}</div>
          <div className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</div>
        </div>
      ))}
    </div>
    
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
      <h3 className="font-semibold mb-4">System Performance</h3>
      <div className="text-center text-gray-500">
        <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Real-time monitoring dashboard will be implemented here</p>
      </div>
    </div>
  </div>
);

// API Usage Page
const APIUsagePage = ({ theme }) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>⚡ API Usage</h1>
      <p className={`${theme.text} opacity-70`}>Usage analytics and cost tracking</p>
    </div>
    
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
      <div className="text-center text-gray-500">
        <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>API usage dashboard with your 57 models will be implemented here</p>
        <p className="text-sm mt-2">Track costs, quotas, and optimization opportunities</p>
      </div>
    </div>
  </div>
);

// Themes Hub Page
const ThemesHubPage = ({ theme, currentTheme, setCurrentTheme, themes }) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>🎨 Themes Hub</h1>
      <p className={`${theme.text} opacity-70`}>Sensory-friendly themes for everyone</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(themes).map(([key, themeObj]) => (
        <div 
          key={key}
          onClick={() => setCurrentTheme(key)}
          className={`p-6 rounded-xl cursor-pointer transition-all ${
            currentTheme === key ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
          } bg-gradient-to-br ${themeObj.bg}`}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/50 flex items-center justify-center">
              🎨
            </div>
            <div className="font-medium">{themeObj.name}</div>
            <div className="text-sm opacity-70 mt-1">
              {key === 'comfort' && 'Purple comfort zone'}
              {key === 'professional' && 'Clean and focused'}
              {key === 'dark' && 'Easy on the eyes'}
              {key === 'ocean' && 'Calming waters'}
              {key === 'sunset' && 'Warm and energizing'}
              {key === 'forest' && 'Natural tranquility'}
              {key === 'cyberpunk' && 'Neon dreams'}
              {key === 'pastel' && 'Soft and dreamy'}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Settings Page
const SettingsPage = ({ theme }) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>⚙️ Settings</h1>
      <p className={`${theme.text} opacity-70`}>Platform configuration and preferences</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
        <h3 className="font-semibold mb-4">🐻 Mama Bear Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Autonomous Actions</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span>Proactive Suggestions</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border">
        <h3 className="font-semibold mb-4">🎯 Accessibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Reduced Motion</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span>High Contrast</span>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PodplaySanctuary;