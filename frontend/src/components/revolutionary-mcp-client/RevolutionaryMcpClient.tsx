import React, { useState, useEffect } from 'react';
import { McpMarketplace } from './McpMarketplace';
import { AgentSelector } from './AgentSelector';
import { MessageSquare, Terminal, FileText, Settings, Zap, Brain } from 'lucide-react';

interface McpClientProps {
  currentProject?: string;
  onProjectContextChange?: (context: string) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  tools?: string[];
}

export const RevolutionaryMcpClient: React.FC<McpClientProps> = ({
  currentProject = "Next.js Revolutionary Workspace",
  onProjectContextChange
}) => {
  const [currentView, setCurrentView] = useState<'chat' | 'marketplace' | 'settings'>('chat');
  const [currentAgent, setCurrentAgent] = useState('mama-bear-orchestrator');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [connectedMcpServers, setConnectedMcpServers] = useState<string[]>([
    'mcp-filesystem',
    'mcp-memory', 
    'mcp-search',
    'mcp-thinking'
  ]);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        type: 'agent',
        content: `🐻 Hello! I'm Mama Bear, your Revolutionary AI Orchestrator. I can see you're working on "${currentProject}". I have access to all MCP marketplaces and can create perfect agents for any task. How can I help revolutionize your development workflow today?`,
        timestamp: new Date(),
        agentId: 'mama-bear-orchestrator',
        tools: ['mcp-filesystem', 'mcp-memory', 'mcp-search', 'vertex-ai']
      }
    ]);
  }, [currentProject]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: generateAgentResponse(inputMessage, currentAgent),
        timestamp: new Date(),
        agentId: currentAgent,
        tools: getAgentTools(currentAgent)
      };

      setMessages(prev => [...prev, agentResponse]);
      setIsThinking(false);
    }, 2000);
  };

  const generateAgentResponse = (userInput: string, agentId: string) => {
    // Simulate intelligent responses based on agent and context
    const responses = {
      'mama-bear-orchestrator': `🐻 I understand you want to "${userInput}". Let me orchestrate the perfect solution using my Revolutionary AI capabilities. I'm analyzing your project context and will coordinate with specialized agents if needed.`,
      'speed-demon': `⚡ Quick response for "${userInput}" - implementing the fastest solution with minimal overhead!`,
      'deep-thinker': `🧠 Analyzing "${userInput}" thoroughly... This requires careful consideration of architectural implications and long-term maintainability.`,
      'code-surgeon': `⚕️ I'll handle "${userInput}" with surgical precision, ensuring clean, efficient code that follows best practices.`,
    };

    return responses[agentId as keyof typeof responses] || `Processing your request: "${userInput}"`;
  };

  const getAgentTools = (agentId: string) => {
    const toolMap = {
      'mama-bear-orchestrator': ['mcp-filesystem', 'mcp-memory', 'mcp-search', 'mcp-thinking', 'vertex-ai', 'mem0-rag'],
      'speed-demon': ['mcp-filesystem', 'vertex-ai-express'],
      'deep-thinker': ['mcp-thinking', 'mcp-memory', 'vertex-ai'],
      'code-surgeon': ['mcp-filesystem', 'mcp-search', 'vertex-ai', 'github-integration'],
    };

    return toolMap[agentId as keyof typeof toolMap] || [];
  };

  const handleAgentSelect = (agent: any) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `🔄 Connected to ${agent.name} from ${agent.source} marketplace. This agent specializes in: ${agent.capabilities.join(', ')}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
    setCurrentView('chat');
  };

  const sidebarItems = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare size={20} />, active: currentView === 'chat' },
    { id: 'marketplace', label: 'MCP Marketplace', icon: <Zap size={20} />, active: currentView === 'marketplace' },
    { id: 'terminal', label: 'Terminal', icon: <Terminal size={20} />, active: false },
    { id: 'files', label: 'Files', icon: <FileText size={20} />, active: false },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, active: currentView === 'settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Revolutionary MCP
          </h1>
          <p className="text-xs text-gray-400 mt-1">AI Client & Marketplace</p>
        </div>

        {/* Agent Selector */}
        <div className="p-4 border-b border-gray-700">
          <AgentSelector
            currentAgent={currentAgent}
            onAgentChange={setCurrentAgent}
            projectContext={currentProject}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Connected MCP Servers */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">Connected MCP Servers</div>
          <div className="space-y-1">
            {connectedMcpServers.map(server => (
              <div key={server} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">{server}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentView === 'chat' && (
          <>
            {/* Chat Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Revolutionary AI Chat</h2>
                  <p className="text-sm text-gray-400">Project: {currentProject}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>All systems operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm">
                      {message.type === 'agent' ? '🤖' : 'ℹ️'}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-purple-500 text-white'
                        : message.type === 'system'
                        ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    {message.tools && message.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.tools.map(tool => (
                          <span
                            key={tool}
                            className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                      <span className="text-sm text-gray-300">Agent is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message your Revolutionary AI..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isThinking}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}

        {currentView === 'marketplace' && (
          <McpMarketplace
            onAgentSelect={handleAgentSelect}
            currentProject={currentProject}
          />
        )}

        {currentView === 'settings' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Revolutionary MCP Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Connected Marketplaces</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Docker MCP Toolkit', status: 'connected', url: 'docker.com/mcp' },
                    { name: 'Continue.dev', status: 'connected', url: 'continue.dev' },
                    { name: 'Claude Desktop', status: 'pending', url: 'claude.ai' },
                    { name: 'Revolutionary Store', status: 'connected', url: 'podplay.sanctuary' }
                  ].map(marketplace => (
                    <div key={marketplace.name} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{marketplace.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          marketplace.status === 'connected' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {marketplace.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{marketplace.url}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
