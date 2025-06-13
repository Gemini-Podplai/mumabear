import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CubeIcon,
  CloudIcon,
  StarIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import MultimodalChatInterface from '../components/chat/MultimodalChatInterface';

const MCPMarketDock = () => {
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Protocols', count: 24 },
    { id: 'ai', name: 'AI & ML', count: 8 },
    { id: 'data', name: 'Data Sources', count: 6 },
    { id: 'communication', name: 'Communication', count: 4 },
    { id: 'automation', name: 'Automation', count: 3 },
    { id: 'security', name: 'Security', count: 3 }
  ];

  const protocols = [
    {
      id: 'openai-mcp',
      name: 'OpenAI MCP',
      description: 'Model Context Protocol for OpenAI GPT models with function calling support',
      category: 'ai',
      version: '2.1.0',
      downloads: 15420,
      rating: 4.8,
      status: 'verified',
      author: 'OpenAI',
      tags: ['GPT', 'Function Calling', 'Chat'],
      installed: true
    },
    {
      id: 'anthropic-claude',
      name: 'Anthropic Claude MCP',
      description: 'Context protocol for Claude models with advanced reasoning capabilities',
      category: 'ai',
      version: '1.9.2',
      downloads: 12850,
      rating: 4.9,
      status: 'verified',
      author: 'Anthropic',
      tags: ['Claude', 'Reasoning', 'Safety'],
      installed: true
    },
    {
      id: 'postgres-mcp',
      name: 'PostgreSQL MCP',
      description: 'Database context protocol for PostgreSQL with query optimization',
      category: 'data',
      version: '3.2.1',
      downloads: 8940,
      rating: 4.6,
      status: 'verified',
      author: 'PostgreSQL Team',
      tags: ['Database', 'SQL', 'Analytics'],
      installed: false
    },
    {
      id: 'slack-mcp',
      name: 'Slack Integration MCP',
      description: 'Real-time messaging and workspace integration protocol',
      category: 'communication',
      version: '2.0.5',
      downloads: 7230,
      rating: 4.4,
      status: 'community',
      author: 'Slack Community',
      tags: ['Messaging', 'Workspace', 'Notifications'],
      installed: false
    },
    {
      id: 'github-mcp',
      name: 'GitHub Actions MCP',
      description: 'CI/CD and repository management context protocol',
      category: 'automation',
      version: '1.8.0',
      downloads: 6180,
      rating: 4.7,
      status: 'verified',
      author: 'GitHub',
      tags: ['CI/CD', 'Git', 'Automation'],
      installed: true
    },
    {
      id: 'auth0-mcp',
      name: 'Auth0 Security MCP',
      description: 'Authentication and authorization context protocol',
      category: 'security',
      version: '2.3.1',
      downloads: 4920,
      rating: 4.5,
      status: 'verified',
      author: 'Auth0',
      tags: ['Auth', 'Security', 'Identity'],
      installed: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400';
      case 'community': return 'text-blue-400';
      case 'deprecated': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'community':
        return <CubeIcon className="w-4 h-4" />;
      case 'deprecated':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <CloudIcon className="w-4 h-4" />;
    }
  };

  const filteredProtocols = protocols.filter(protocol => {
    const matchesCategory = selectedCategory === 'all' || protocol.category === selectedCategory;
    const matchesSearch = protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${chatCollapsed ? 'mr-0' : 'mr-96'}`}>
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2"
          >
            MCP Market Dock
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Discover and manage Model Context Protocols
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search protocols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center space-x-2 mb-4">
                <FunnelIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Categories</h3>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.id 
                        ? 'bg-cyan-600/30 border border-cyan-400/50' 
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <span className="text-white font-medium">{category.name}</span>
                    <span className="text-sm text-gray-400">{category.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Protocol Grid */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredProtocols.map((protocol) => (
                <div
                  key={protocol.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <CubeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {protocol.name}
                        </h3>
                        <p className="text-sm text-gray-400">by {protocol.author}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-1 ${getStatusColor(protocol.status)}`}>
                      {getStatusIcon(protocol.status)}
                      <span className="text-xs capitalize">{protocol.status}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {protocol.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {protocol.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white">{protocol.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{protocol.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">v{protocol.version}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {protocol.installed ? (
                      <button className="flex-1 bg-green-600/20 text-green-400 py-2 px-4 rounded-lg font-medium border border-green-400/30">
                        Installed
                      </button>
                    ) : (
                      <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Install
                      </button>
                    )}
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <StarIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>

            {filteredProtocols.length === 0 && (
              <div className="text-center py-12">
                <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No protocols found</h3>
                <p className="text-gray-400">Try adjusting your search or category filter</p>
              </div>
            )}

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                    <CubeIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">24</p>
                    <p className="text-sm text-gray-400">Total Protocols</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">3</p>
                    <p className="text-sm text-gray-400">Installed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <ArrowDownTrayIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">55.5K</p>
                    <p className="text-sm text-gray-400">Total Downloads</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MCP Agent Chat Interface */}
      <div className={`fixed right-0 top-16 bottom-0 w-96 transition-all duration-300 ${chatCollapsed ? 'translate-x-full' : 'translate-x-0'}`}>
        <MultimodalChatInterface
          agentName="MCP Agent"
          agentType="mcp"
          agentDescription="Protocol Management Specialist"
          isCollapsed={chatCollapsed}
          onToggleCollapse={() => setChatCollapsed(!chatCollapsed)}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default MCPMarketDock;