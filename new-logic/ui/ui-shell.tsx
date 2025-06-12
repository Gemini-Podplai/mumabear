import React, { useState, useEffect } from 'react';
import {
  Home, MessageCircle, Bot, Computer, Library, Users, Package,
  Link, Palette, BarChart3, Zap, Activity, Settings, Menu, X,
  Github, Slack, Mail, Calendar, Database, Globe, Code,
  Search, Star, Filter, Plus, Play, Pause, Eye, RefreshCw,
  Bell, CheckCircle, XCircle, AlertCircle, Clock, Monitor,
  Heart, Sparkles, ArrowRight, TrendingUp, Shield, Coffee
} from 'lucide-react';

// Import enhanced components
import EnhancedMainChat from './enhanced-main-chat';
import EnhancedScoutAgent from './enhanced-scout-agent';
import DeepResearchCenter from './deep-research-center';
import EnhancedDevWorkspaces from './enhanced-dev-workspaces';
import EnhancedExecutionRouter from './enhanced-execution-router';
import EnhancedMultiModalChat from './enhanced-multi-modal-chat';
import EnhancedIntegrationHub from './enhanced-integration-hub';
import EnhancedMCPMarketplace from './enhanced-mcp-marketplace';
import EnhancedMiniApps from './enhanced-mini-apps';
import EnhancedResourcesMonitor from './enhanced-resources-monitor';

// Main Layout Component
const PodplaySanctuary = () => {
  const [currentPage, setCurrentPage] = useState('main_chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('comfort'); // comfort, professional, custom

  // Navigation items based on design guide with updated descriptions
  const navigationItems = [
    { id: 'main_chat', name: 'Main Chat', icon: Home, description: 'Enhanced Chat Sanctuary' },
    { id: 'agent_hub', name: 'Scout Agent', icon: Bot, description: 'Environment Creation' },
    { id: 'dev_workspaces', name: 'Dev Workspaces', icon: Computer, description: 'E2B & Scrapybara' },
    { id: 'research_center', name: 'Research Center', icon: Library, description: 'Deep Multi-Source Research' },
    { id: 'execution_router', name: 'Execution Router', icon: Zap, description: 'Intelligent Task Routing' },
    { id: 'multi_modal_chat', name: 'Multi-Modal Chat', icon: MessageCircle, description: 'AI Friends' },
    { id: 'mcp_marketplace', name: 'MCP Marketplace', icon: Package, description: 'Model Packages' },
    { id: 'integration_hub', name: 'Integration Hub', icon: Link, description: 'Pipedream Studio' },
    { id: 'mini_apps', name: 'Mini Apps', icon: Palette, description: 'App Manager' },
    { id: 'resources_monitor', name: 'Resources Monitor', icon: BarChart3, description: 'Control Hub' },
    { id: 'api_usage', name: 'API Usage', icon: Activity, description: 'Usage Analytics' },
    { id: 'activity_hub', name: 'Activity Hub', icon: TrendingUp, description: 'Live Ticker' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'Configuration' }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'main_chat': return <EnhancedMainChat theme={theme} />;
      case 'agent_hub': return <EnhancedScoutAgent theme={theme} />;
      case 'dev_workspaces': return <EnhancedDevWorkspaces theme={theme} />;
      case 'research_center': return <DeepResearchCenter theme={theme} />;
      case 'execution_router': return <EnhancedExecutionRouter theme={theme} />;
      case 'multi_modal_chat': return <EnhancedMultiModalChat theme={theme} />;
      case 'mcp_marketplace': return <EnhancedMCPMarketplace theme={theme} />;
      case 'integration_hub': return <EnhancedIntegrationHub theme={theme} />;
      case 'mini_apps': return <EnhancedMiniApps theme={theme} />;
      case 'resources_monitor': return <EnhancedResourcesMonitor theme={theme} />;
      case 'api_usage': return <APIUsagePage theme={theme} />;
      case 'activity_hub': return <ActivityHubPage theme={theme} />;
      case 'settings': return <SettingsPage theme={theme} />;
      default: return <EnhancedMainChat theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'comfort' ? 'bg-gradient-to-br from-purple-50 to-pink-50' :
                   theme === 'professional' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-20' : 'w-80'}
                      transition-all duration-300 ease-in-out
                      ${theme === 'comfort' ? 'bg-white/80 backdrop-blur-md' :
                        theme === 'professional' ? 'bg-white border-r' : 'bg-gray-800'}`}>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🐻</span>
              </div>
              <div>
                <h1 className={`font-bold text-lg ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  Podplay Sanctuary
                </h1>
                <p className={`text-xs ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
                  Neurodivergent-Friendly AI Platform
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-2 rounded-lg hover:bg-purple-100 transition-colors ${theme === 'custom' ? 'text-white hover:bg-gray-700' : ''}`}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group
                         ${currentPage === item.id
                           ? (theme === 'comfort' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' :
                              theme === 'professional' ? 'bg-blue-50 text-blue-700' :
                              'bg-purple-600 text-white')
                           : (theme === 'custom' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                         }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${currentPage === item.id ? 'opacity-70' : 'opacity-50'}`}>
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
            <div className={`p-3 rounded-xl ${theme === 'custom' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm font-medium mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-700'}`}>
                🎨 Sensory Theme
              </p>
              <div className="flex space-x-2">
                {['comfort', 'professional', 'custom'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                               ${theme === t
                                 ? 'bg-purple-500 text-white'
                                 : (theme === 'custom' ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-600')
                               }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-80'} transition-all duration-300`}>
        {renderPage()}
      </div>

      {/* Mama Bear Assistant (Floating) */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`${theme === 'comfort' ? 'bg-white' : theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                        rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer`}>
          <span className="text-2xl">🐻</span>
        </div>
      </div>
    </div>
  );
};

// Main Chat Page
const MainChatPage = ({ theme }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'mama_bear', content: 'Hello! I\'m Mama Bear, your caring AI assistant. How can I help you today? 🐻', timestamp: new Date() },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentVariant, setCurrentVariant] = useState('scout_commander');

  const variants = [
    { id: 'scout_commander', name: 'Scout Commander', emoji: '🎯', color: 'blue' },
    { id: 'research_specialist', name: 'Research Specialist', emoji: '🔍', color: 'purple' },
    { id: 'code_review_bear', name: 'Code Review Bear', emoji: '👩‍💻', color: 'green' },
    { id: 'creative_bear', name: 'Creative Bear', emoji: '🎨', color: 'orange' },
    { id: 'learning_bear', name: 'Learning Bear', emoji: '📚', color: 'teal' },
    { id: 'efficiency_bear', name: 'Efficiency Bear', emoji: '⚡', color: 'yellow' },
    { id: 'debugging_detective', name: 'Debugging Detective', emoji: '🔍', color: 'red' }
  ];

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'mama_bear',
        content: `As your ${variants.find(v => v.id === currentVariant)?.name}, I'd be happy to help with that! What would you like me to focus on? 🐻`,
        timestamp: new Date(),
        variant: currentVariant
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md border-b p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white">🐻</span>
              </div>
              <div>
                <h2 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  Mama Bear Chat
                </h2>
                <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {variants.find(v => v.id === currentVariant)?.name} Mode
                </p>
              </div>
            </div>

            {/* Variant Selector */}
            <select
              value={currentVariant}
              onChange={(e) => setCurrentVariant(e.target.value)}
              className={`px-4 py-2 rounded-xl border ${theme === 'custom' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-200'}`}
            >
              {variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.emoji} {variant.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-4 rounded-2xl ${
                message.sender === 'user'
                  ? (theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                     theme === 'professional' ? 'bg-blue-500 text-white' : 'bg-purple-600 text-white')
                  : (theme === 'comfort' ? 'bg-white shadow-md' :
                     theme === 'professional' ? 'bg-gray-100' : 'bg-gray-700 text-white')
              }`}>
                {message.sender === 'mama_bear' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span>{variants.find(v => v.id === message.variant)?.emoji || '🐻'}</span>
                    <span className="text-sm font-medium opacity-70">
                      {variants.find(v => v.id === message.variant)?.name || 'Mama Bear'}
                    </span>
                  </div>
                )}
                <p>{message.content}</p>
                <p className="text-xs opacity-50 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md border-t p-4`}>
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message to Mama Bear..."
              className={`flex-1 px-4 py-3 rounded-xl border ${
                theme === 'custom' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' :
                'bg-white border-gray-200 placeholder-gray-500'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
            <button
              onClick={sendMessage}
              className={`px-6 py-3 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                        text-white rounded-xl hover:opacity-90 transition-opacity`}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Activity Ticker */}
      <div className={`w-80 ${theme === 'comfort' ? 'bg-white/30' : theme === 'professional' ? 'bg-gray-50' : 'bg-gray-900'}
                      backdrop-blur-md border-l p-4`}>
        <h3 className={`font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🔄 Live Activity
        </h3>
        <div className="space-y-3">
          {[
            { action: 'Scout analyzing website', time: '2s ago', status: 'active' },
            { action: 'Research task completed', time: '1m ago', status: 'completed' },
            { action: 'Code review in progress', time: '3m ago', status: 'active' },
            { action: 'Agent collaboration started', time: '5m ago', status: 'waiting' }
          ].map((activity, index) => (
            <div key={index} className={`p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  {activity.action}
                </p>
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'active' ? 'bg-green-400' :
                  activity.status === 'completed' ? 'bg-blue-400' : 'bg-yellow-400'
                }`} />
              </div>
              <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {activity.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Integration Hub Page (Pipedream)
const IntegrationHubPage = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('workflows');
  const [searchTerm, setSearchTerm] = useState('');

  const workflows = [
    {
      id: 'wf_001',
      name: 'GitHub to Slack Deployment',
      description: 'Automatically notify team when code is deployed',
      status: 'active',
      executions: 127,
      lastRun: '2 minutes ago',
      successRate: 98.4
    },
    {
      id: 'wf_002',
      name: 'Customer Support Auto-Responder',
      description: 'AI-powered first response to customer inquiries',
      status: 'active',
      executions: 89,
      lastRun: '5 minutes ago',
      successRate: 95.2
    }
  ];

  const services = [
    { name: 'GitHub', icon: '🐙', category: 'Development', status: 'connected' },
    { name: 'Slack', icon: '💬', category: 'Communication', status: 'connected' },
    { name: 'Gmail', icon: '📧', category: 'Email', status: 'available' },
    { name: 'Discord', icon: '🎮', category: 'Communication', status: 'available' },
    { name: 'Notion', icon: '📝', category: 'Productivity', status: 'available' },
    { name: 'Webhooks', icon: '🔗', category: 'Custom', status: 'available' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                          theme === 'professional' ? 'bg-blue-500' : 'bg-purple-600'} rounded-xl`}>
            <Link className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Integration Hub
            </h1>
            <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
              Powered by Pipedream & Mama Bear Intelligence
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Workflows', value: '4', icon: CheckCircle, color: 'green' },
            { label: 'Total Executions', value: '2,417', icon: Zap, color: 'purple' },
            { label: 'Success Rate', value: '97.8%', icon: TrendingUp, color: 'blue' },
            { label: 'Connected Services', value: '12', icon: Link, color: 'orange' }
          ].map((stat, index) => (
            <div key={index} className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                                        backdrop-blur-md rounded-xl p-4 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className={`${theme === 'comfort' ? 'bg-white/30' : theme === 'professional' ? 'bg-gray-100' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-1 flex space-x-1`}>
          {[
            { id: 'workflows', label: 'My Workflows', icon: Zap },
            { id: 'templates', label: 'Templates', icon: Star },
            { id: 'services', label: 'Services', icon: Link },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all
                         ${activeTab === tab.id
                           ? (theme === 'comfort' ? 'bg-white text-purple-600 shadow-md' :
                              theme === 'professional' ? 'bg-white text-blue-600 shadow-sm' :
                              'bg-gray-700 text-purple-400')
                           : (theme === 'custom' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                         }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'workflows' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                My Workflows
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border ${
                      theme === 'custom' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :
                      'bg-white border-gray-300 placeholder-gray-500'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                <button className={`px-4 py-2 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                  theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                                  text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2`}>
                  <Plus size={16} />
                  <span>Create Workflow</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflows.map(workflow => (
                <div key={workflow.id}
                     className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                                backdrop-blur-md rounded-xl p-6 border hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {workflow.name}
                      </h3>
                      <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>
                        {workflow.description}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      workflow.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {workflow.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        Executions
                      </p>
                      <p className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {workflow.executions.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        Success Rate
                      </p>
                      <p className="font-semibold text-green-600">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        Last Run
                      </p>
                      <p className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {workflow.lastRun}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className={`px-3 py-1 ${theme === 'comfort' ? 'bg-purple-600' :
                                        theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                                        text-white rounded-md text-sm hover:opacity-90 transition-opacity flex items-center space-x-1`}>
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button className={`px-3 py-1 border ${theme === 'custom' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' :
                                        'border-gray-300 text-gray-700 hover:bg-gray-50'}
                                        rounded-md text-sm transition-colors flex items-center space-x-1`}>
                        <Settings size={14} />
                        <span>Edit</span>
                      </button>
                    </div>
                    <button className={`p-2 rounded-md transition-colors ${
                      workflow.status === 'active'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}>
                      {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Connected Services
              </h2>
              <button className={`px-4 py-2 border ${theme === 'custom' ? 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white' :
                                'border-purple-600 text-purple-600 hover:bg-purple-50'}
                                rounded-lg transition-colors flex items-center space-x-2`}>
                <Plus size={16} />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {services.map(service => (
                <div key={service.name}
                     className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                                backdrop-blur-md rounded-xl p-4 border hover:shadow-md transition-shadow`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 ${theme === 'comfort' ? 'bg-gray-100' : theme === 'professional' ? 'bg-gray-100' : 'bg-gray-700'}
                                    rounded-lg text-xl`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {service.name}
                      </h4>
                      <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.category}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      service.status === 'connected'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {service.status}
                    </div>
                  </div>

                  <button className={`w-full px-3 py-2 rounded-md text-sm transition-colors ${
                    service.status === 'connected'
                      ? (theme === 'custom' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                      : (theme === 'comfort' ? 'bg-purple-600 text-white hover:bg-purple-700' :
                         theme === 'professional' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-purple-600 text-white hover:bg-purple-700')
                  }`}>
                    {service.status === 'connected' ? 'Manage' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mama Bear Assistant Panel */}
      <div className={`fixed bottom-6 right-6 ${theme === 'comfort' ? 'bg-white' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                      rounded-xl shadow-lg border p-4 max-w-sm`}>
        <h4 className={`font-semibold mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🐻 Mama Bear Insights
        </h4>
        <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
          I can help optimize your workflow connections and suggest better automation patterns.
        </p>
        <button className={`w-full px-3 py-2 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                          text-white rounded-lg text-sm hover:opacity-90 transition-opacity`}>
          Ask Mama Bear
        </button>
      </div>
    </div>
  );
};

// Agent Hub Page
const AgentHubPage = ({ theme }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agents = [
    {
      id: 'scout_commander',
      name: 'Scout Commander',
      emoji: '🎯',
      description: 'Strategic planning and project organization',
      color: 'blue',
      capabilities: ['Project Planning', 'Task Organization', 'Strategic Analysis'],
      status: 'active'
    },
    {
      id: 'research_specialist',
      name: 'Research Specialist',
      emoji: '🔍',
      description: 'Deep research and fact verification',
      color: 'purple',
      capabilities: ['Deep Research', 'Fact Checking', 'Citation Generation'],
      status: 'active'
    },
    {
      id: 'code_review_bear',
      name: 'Code Review Bear',
      emoji: '👩‍💻',
      description: 'Code analysis and security scanning',
      color: 'green',
      capabilities: ['Code Review', 'Security Scan', 'Performance Analysis'],
      status: 'active'
    },
    {
      id: 'creative_bear',
      name: 'Creative Bear',
      emoji: '🎨',
      description: 'Creative solutions and design thinking',
      color: 'orange',
      capabilities: ['Brainstorming', 'Design Concepts', 'Creative Solutions'],
      status: 'active'
    },
    {
      id: 'learning_bear',
      name: 'Learning Bear',
      emoji: '📚',
      description: 'Teaching and educational content',
      color: 'teal',
      capabilities: ['Explain Concepts', 'Create Tutorials', 'Study Plans'],
      status: 'active'
    },
    {
      id: 'efficiency_bear',
      name: 'Efficiency Bear',
      emoji: '⚡',
      description: 'Workflow optimization and automation',
      color: 'yellow',
      capabilities: ['Optimize Workflow', 'Automate Tasks', 'Time Management'],
      status: 'active'
    },
    {
      id: 'debugging_detective',
      name: 'Debugging Detective',
      emoji: '🔍',
      description: 'Bug hunting and issue resolution',
      color: 'red',
      capabilities: ['Debug Code', 'Trace Issues', 'Root Cause Analysis'],
      status: 'active'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🎭 Agent Hub
        </h1>
        <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
          Seven specialized Mama Bear variants ready to assist you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                       backdrop-blur-md rounded-xl p-6 border cursor-pointer transform hover:scale-105 
                       transition-all duration-300 hover:shadow-lg group`}
          >
            <div className="text-center mb-4">
              <div className={`text-6xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {agent.emoji}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                {agent.name}
              </h3>
              <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                {agent.description}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              {agent.capabilities.map((capability, index) => (
                <div key={index} 
                     className={`px-3 py-1 rounded-full text-xs text-center ${
                       theme === 'comfort' ? 'bg-purple-100 text-purple-700' :
                       theme === 'professional' ? 'bg-blue-100 text-blue-700' :
                       'bg-gray-700 text-gray-300'
                     }`}>
                  {capability}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className={`px-2 py-1 rounded-full text-xs ${
                agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {agent.status}
              </div>
              <button className={`px-4 py-2 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                                text-white rounded-lg text-sm hover:opacity-90 transition-opacity`}>
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme === 'comfort' ? 'bg-white' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedAgent.emoji}</div>
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedAgent.name}
                  </h2>
                  <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedAgent.description}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className={`p-2 rounded-lg ${theme === 'custom' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedAgent.capabilities.map((capability, index) => (
                    <div key={index} 
                         className={`p-3 rounded-lg ${theme === 'comfort' ? 'bg-purple-50' : theme === 'professional' ? 'bg-blue-50' : 'bg-gray-700'}`}>
                      <p className={`font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {capability}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button className={`flex-1 px-6 py-3 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                  theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                                  text-white rounded-xl hover:opacity-90 transition-opacity`}>
                  Start Conversation
                </button>
                <button className={`px-6 py-3 border ${theme === 'custom' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' :
                                  'border-gray-300 text-gray-700 hover:bg-gray-50'}
                                  rounded-xl transition-colors`}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dev Workspaces Page
const DevWorkspacesPage = ({ theme }) => {
  const [activeWorkspace, setActiveWorkspace] = useState('e2b');
  const [isSpinningUp, setIsSpinningUp] = useState(false);

  const workspaces = [
    {
      id: 'e2b',
      name: 'E2B Environment',
      description: 'Secure cloud development environment',
      status: 'ready',
      language: 'Node.js',
      resources: { cpu: '2 vCPU', memory: '4 GB', storage: '20 GB' }
    },
    {
      id: 'scrapybara',
      name: 'Scrapybara Instance',
      description: 'Web scraping and automation environment',
      status: 'active',
      language: 'Python',
      resources: { cpu: '1 vCPU', memory: '2 GB', storage: '10 GB' }
    }
  ];

  const spinUpEnvironment = () => {
    setIsSpinningUp(true);
    setTimeout(() => setIsSpinningUp(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          💻 Dev Workspaces
        </h1>
        <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
          Cloud development environments powered by E2B and Scrapybara
        </p>
      </div>

      {/* Workspace Selector */}
      <div className="mb-6">
        <div className={`${theme === 'comfort' ? 'bg-white/30' : theme === 'professional' ? 'bg-gray-100' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-1 flex space-x-1 max-w-md`}>
          {workspaces.map(workspace => (
            <button
              key={workspace.id}
              onClick={() => setActiveWorkspace(workspace.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-center
                         ${activeWorkspace === workspace.id
                           ? (theme === 'comfort' ? 'bg-white text-purple-600 shadow-md' :
                              theme === 'professional' ? 'bg-white text-blue-600 shadow-sm' :
                              'bg-gray-700 text-purple-400')
                           : (theme === 'custom' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                         }`}
            >
              {workspace.name}
            </button>
          ))}
        </div>
      </div>

      {/* Environment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className={`lg:col-span-2 ${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                {workspaces.find(w => w.id === activeWorkspace)?.name}
              </h2>
              <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                {workspaces.find(w => w.id === activeWorkspace)?.description}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              workspaces.find(w => w.id === activeWorkspace)?.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {workspaces.find(w => w.id === activeWorkspace)?.status}
            </div>
          </div>

          {/* Terminal */}
          <div className={`${theme === 'custom' ? 'bg-gray-900' : 'bg-gray-900'} rounded-lg p-4 font-mono text-sm`}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400 ml-4">Terminal</span>
            </div>
            <div className="text-green-400 space-y-2">
              <div>user@podplay-workspace:~$ npm install</div>
              <div className="text-gray-500">Installing dependencies...</div>
              <div>user@podplay-workspace:~$ npm run dev</div>
              <div className="text-gray-500">Server running on http://localhost:3000</div>
              <div className="flex items-center">
                <span>user@podplay-workspace:~$ </span>
                <span className="bg-green-400 w-2 h-4 ml-1 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Resource Monitor */}
          <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          backdrop-blur-md rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Resources
            </h3>
            <div className="space-y-4">
              {[
                { label: 'CPU Usage', value: 45, color: 'blue' },
                { label: 'Memory', value: 72, color: 'purple' },
                { label: 'Storage', value: 28, color: 'green' }
              ].map(resource => (
                <div key={resource.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}>
                      {resource.label}
                    </span>
                    <span className={theme === 'custom' ? 'text-white' : 'text-gray-900'}>
                      {resource.value}%
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${theme === 'custom' ? 'bg-gray-700' : ''}`}>
                    <div 
                      className={`h-2 rounded-full bg-${resource.color}-500`}
                      style={{ width: `${resource.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          backdrop-blur-md rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={spinUpEnvironment}
                disabled={isSpinningUp}
                className={`w-full px-4 py-3 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                          text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2`}
              >
                {isSpinningUp ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Spinning Up...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Start Environment</span>
                  </>
                )}
              </button>
              
              <button className={`w-full px-4 py-3 border ${theme === 'custom' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' :
                                'border-gray-300 text-gray-700 hover:bg-gray-50'}
                                rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                <Monitor size={16} />
                <span>Open IDE</span>
              </button>
              
              <button className={`w-full px-4 py-3 border ${theme === 'custom' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' :
                                'border-gray-300 text-gray-700 hover:bg-gray-50'}
                                rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                <Globe size={16} />
                <span>View Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spinning Up Animation */}
      {isSpinningUp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`${theme === 'comfort' ? 'bg-white' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          rounded-2xl p-8 text-center max-w-md`}>
            <div className="text-6xl mb-4 animate-bounce">🧭</div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Scout Spinning Up Environment
            </h3>
            <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Preparing your development workspace...
            </p>
            <div className="space-y-2">
              {[
                'Initializing environment...',
                'Installing dependencies...',
                'Configuring workspace...',
                'Ready for development!'
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    index < 2 ? 'bg-green-500' : index === 2 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Research Center Page
const ResearchCenterPage = ({ theme }) => {
  const [researchMode, setResearchMode] = useState('single');
  const [isResearching, setIsResearching] = useState(false);

  const modes = [
    { id: 'single', name: 'Single Model', description: 'Focused research with one model' },
    { id: 'collaborative', name: 'Collaborative', description: 'Claude + Gemini working together' },
    { id: 'consensus', name: 'Consensus', description: 'Models work toward agreement' },
    { id: 'debate', name: 'Debate', description: 'Models argue different perspectives' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🏛️ Research Center
        </h1>
        <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
          Deep research with multiple AI models working together
        </p>
      </div>

      {/* Research Mode Selector */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          Research Mode
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setResearchMode(mode.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                researchMode === mode.id
                  ? (theme === 'comfort' ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300' :
                     theme === 'professional' ? 'bg-blue-50 border-blue-300' :
                     'bg-purple-600 border-purple-400')
                  : (theme === 'comfort' ? 'bg-white/50 border-gray-200 hover:bg-white/80' :
                     theme === 'professional' ? 'bg-white border-gray-200 hover:bg-gray-50' :
                     'bg-gray-800 border-gray-700 hover:bg-gray-700')
              }`}
            >
              <h3 className={`font-semibold mb-2 ${
                researchMode === mode.id && theme === 'custom' ? 'text-white' :
                theme === 'custom' ? 'text-white' : 'text-gray-900'
              }`}>
                {mode.name}
              </h3>
              <p className={`text-sm ${
                researchMode === mode.id && theme === 'custom' ? 'text-gray-200' :
                theme === 'custom' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {mode.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Central Research Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Research Panel */}
        <div className={`lg:col-span-2 ${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-6 border`}>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Research Query
            </h3>
            <textarea
              placeholder="What would you like me to research? I'll use multiple AI models to provide comprehensive insights..."
              className={`w-full h-32 p-4 rounded-lg border ${
                theme === 'custom' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :
                'bg-white border-gray-300 placeholder-gray-500'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
            />
          </div>

          <div className="mb-6">
            <h4 className={`font-semibold mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Research Depth
            </h4>
            <div className="flex space-x-2">
              {[
                { level: 'quick', label: 'Quick (5-10 min)', time: '5-10 min' },
                { level: 'standard', label: 'Standard (15-30 min)', time: '15-30 min' },
                { level: 'deep', label: 'Deep (30-60 min)', time: '30-60 min' },
                { level: 'exhaustive', label: 'Exhaustive (1-2 hours)', time: '1-2 hours' }
              ].map(option => (
                <button
                  key={option.level}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === 'comfort' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                    theme === 'professional' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                    'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsResearching(true)}
            className={`w-full px-6 py-4 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                      text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
          >
            <Search size={20} />
            <span>Start Research</span>
          </button>

          {/* Research Results */}
          {isResearching && (
            <div className="mt-6 space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'comfort' ? 'bg-purple-50' : theme === 'professional' ? 'bg-blue-50' : 'bg-gray-700'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    C
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      Claude Research
                    </h4>
                    <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Analyzing from multiple perspectives...
                    </p>
                  </div>
                  <div className="flex-1"></div>
                  <RefreshCw className="animate-spin text-purple-500" size={16} />
                </div>
              </div>

              {researchMode !== 'single' && (
                <div className={`p-4 rounded-lg ${theme === 'comfort' ? 'bg-blue-50' : theme === 'professional' ? 'bg-green-50' : 'bg-gray-700'}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      G
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        Gemini Research
                      </h4>
                      <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Gathering comprehensive data...
                      </p>
                    </div>
                    <div className="flex-1"></div>
                    <RefreshCw className="animate-spin text-blue-500" size={16} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Sources Panel */}
          <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          backdrop-blur-md rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              📚 Sources
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Academic Paper: AI Ethics', type: 'PDF', verified: true },
                { title: 'Research Article: ML Trends', type: 'Web', verified: true },
                { title: 'Industry Report: Tech 2024', type: 'Document', verified: false }
              ].map((source, index) => (
                <div key={index} className={`p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2">
                    {source.verified && <CheckCircle className="text-green-500" size={16} />}
                    <span className={`text-sm font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      {source.title}
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {source.type}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          backdrop-blur-md rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              📤 Export Research
            </h3>
            <div className="space-y-3">
              {['PDF Report', 'Markdown', 'Notion Page', 'Google Docs'].map(format => (
                <button
                  key={format}
                  className={`w-full px-4 py-2 rounded-lg text-sm transition-colors ${
                    theme === 'custom' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Multi-Modal Chat Page  
const MultiModalChatPage = ({ theme }) => {
  const [selectedModel, setSelectedModel] = useState('claude');
  const [compareMode, setCompareMode] = useState(false);

  const models = [
    {
      id: 'claude',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      capabilities: ['Text', 'Vision', 'Analysis'],
      speed: 'Fast',
      cost: '$',
      quality: 'High'
    },
    {
      id: 'gpt4',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      capabilities: ['Text', 'Vision', 'Code'],
      speed: 'Medium',
      cost: '$$',
      quality: 'High'
    },
    {
      id: 'gemini',
      name: 'Gemini Pro',
      provider: 'Google',
      capabilities: ['Text', 'Vision', 'Multimodal'],
      speed: 'Fast',
      cost: '$',
      quality: 'Medium'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          💬 Multi-Modal Chat
        </h1>
        <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
          Chat with 50+ AI models - your AI friends collection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Models Sidebar */}
        <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-4 border lg:col-span-1`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              AI Friends
            </h3>
            <span className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
              {models.length} online
            </span>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search models..."
              className={`w-full px-3 py-2 rounded-lg border text-sm ${
                theme === 'custom' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :
                'bg-white border-gray-300 placeholder-gray-500'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
          </div>

          <div className="space-y-2">
            {models.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedModel === model.id
                    ? (theme === 'comfort' ? 'bg-purple-100 border-purple-300' :
                       theme === 'professional' ? 'bg-blue-100 border-blue-300' :
                       'bg-purple-600 border-purple-400')
                    : (theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                } border`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedModel === model.id
                      ? 'bg-white text-purple-600'
                      : (theme === 'custom' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                  }`}>
                    {model.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${
                      selectedModel === model.id && theme === 'custom' ? 'text-white' :
                      theme === 'custom' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {model.name}
                    </p>
                    <p className={`text-xs ${
                      selectedModel === model.id && theme === 'custom' ? 'text-gray-200' :
                      theme === 'custom' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {model.provider}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`lg:col-span-2 ${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl border flex flex-col`}>
          {/* Chat Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  theme === 'comfort' ? 'bg-purple-100 text-purple-600' :
                  theme === 'professional' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-600 text-white'
                }`}>
                  {models.find(m => m.id === selectedModel)?.name.charAt(0)}
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                    {models.find(m => m.id === selectedModel)?.name}
                  </h3>
                  <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {models.find(m => m.id === selectedModel)?.provider}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  compareMode
                    ? (theme === 'comfort' ? 'bg-purple-600 text-white' :
                       theme === 'professional' ? 'bg-blue-600 text-white' :
                       'bg-purple-600 text-white')
                    : (theme === 'custom' ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' :
                       'border border-gray-300 text-gray-700 hover:bg-gray-50')
                }`}
              >
                ⚖️ Compare
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex justify-start">
              <div className={`max-w-md p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                <p>Hello! I'm {models.find(m => m.id === selectedModel)?.name}. How can I help you today?</p>
                <p className="text-xs opacity-50 mt-1">Just now</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder={`Message ${models.find(m => m.id === selectedModel)?.name}...`}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  theme === 'custom' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :
                  'bg-white border-gray-300 placeholder-gray-500'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              <button className={`px-4 py-2 ${theme === 'comfort' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                theme === 'professional' ? 'bg-blue-600' : 'bg-purple-600'}
                                text-white rounded-lg hover:opacity-90 transition-opacity`}>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Model Settings */}
        <div className="space-y-6">
          <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          backdrop-blur-md rounded-xl p-4 border`}>
            <h3 className={`font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              ⚙️ Model Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Temperature
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full mt-1"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div>
                <label className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Max Tokens
                </label>
                <input
                  type="number"
                  defaultValue="2048"
                  className={`w-full mt-1 px-3 py-2 rounded border text-sm ${
                    theme === 'custom' ? 'bg-gray-700 border-gray-600 text-white' :
                    'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          backdrop-blur-md rounded-xl p-4 border`}>
            <h3 className={`font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              📊 Usage Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Messages Today
                </span>
                <span className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  47
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Cost Today
                </span>
                <span className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  $2.34
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Avg Response
                </span>
                <span className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  1.2s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Continue with more page implementations...
const h4 className={`font-semibold mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🐻 Mama Bear Assistant
        </h4>
        <div className="space-y-2">
          {[
            "Create a GitHub to Slack workflow",
            "Monitor API health automatically",
            "Set up customer auto-responder"
          ].map((suggestion, index) => (
            <button key={index}
                    className={`w-full text-left px-3 py-2 text-sm ${theme === 'custom' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                              rounded-md transition-colors`}>
              "{suggestion}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Agent Hub Page
const AgentHubPage = ({ theme }) => {
  const agents = [
    { id: 'scout_commander', name: 'Scout Commander', emoji: '🎯', color: 'blue', description: 'Strategic planning and project orchestration' },
    { id: 'research_specialist', name: 'Research Specialist', emoji: '🔍', color: 'purple', description: 'Deep research and analysis specialist' },
    { id: 'code_review_bear', name: 'Code Review Bear', emoji: '👩‍💻', color: 'green', description: 'Code review and quality assurance' },
    { id: 'creative_bear', name: 'Creative Bear', emoji: '🎨', color: 'orange', description: 'Creative solutions and brainstorming' },
    { id: 'learning_bear', name: 'Learning Bear', emoji: '📚', color: 'teal', description: 'Patient teaching and skill development' },
    { id: 'efficiency_bear', name: 'Efficiency Bear', emoji: '⚡', color: 'yellow', description: 'Workflow optimization and automation' },
    { id: 'debugging_detective', name: 'Debugging Detective', emoji: '🔍', color: 'red', description: 'Problem solving and troubleshooting' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🎭 Agent Hub
        </h1>
        <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
          Choose your Mama Bear variant for specialized assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id}
               className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                          backdrop-blur-md rounded-xl p-6 border hover:shadow-lg transition-all duration-300 group cursor-pointer
                          hover:scale-105`}>
            <div className="text-center mb-4">
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-${agent.color}-400 to-${agent.color}-600
                              rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                {agent.emoji}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                {agent.name}
              </h3>
              <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                {agent.description}
              </p>
            </div>

            <div className="space-y-2">
              <button className={`w-full px-4 py-2 bg-gradient-to-r from-${agent.color}-500 to-${agent.color}-600
                                text-white rounded-lg hover:opacity-90 transition-opacity`}>
                Chat with {agent.name}
              </button>
              <button className={`w-full px-4 py-2 border ${theme === 'custom' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' :
                                'border-gray-300 text-gray-700 hover:bg-gray-50'}
                                rounded-lg transition-colors`}>
                View Capabilities
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dev Workspaces Page
const DevWorkspacesPage = ({ theme }) => {
  const [activeWorkspace, setActiveWorkspace] = useState('e2b');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          💻 Dev Workspaces
        </h1>
        <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
          Secure cloud development environments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* E2B Workspace */}
        <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-6 border`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Computer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                E2B Sandbox
              </h3>
              <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                Quick code execution environment
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
              <span className="text-green-500 font-medium">Ready</span>
            </div>
            <div className="flex justify-between">
              <span className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>Runtime:</span>
              <span className={`${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>Python 3.11</span>
            </div>
            <div className="flex justify-between">
              <span className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>Memory:</span>
              <span className={`${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>2GB</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Launch E2B Environment
          </button>
        </div>

        {/* Scrapybara Workspace */}
        <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-6 border`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Scrapybara VM
              </h3>
              <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                Full Ubuntu environment with browser
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
              <span className="text-green-500 font-medium">Ready</span>
            </div>
            <div className="flex justify-between">
              <span className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>OS:</span>
              <span className={`${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>Ubuntu 22.04</span>
            </div>
            <div className="flex justify-between">
              <span className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>Browser:</span>
              <span className={`${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>Chrome + Firefox</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Launch Scrapybara VM
          </button>
        </div>
      </div>
    </div>
  );
};

// Research Center Page
const ResearchCenterPage = ({ theme }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🏛️ Research Center
        </h1>
        <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
          Collaborative AI research with Claude & Gemini
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md rounded-xl p-8 border text-center`}>
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
              <Library className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Deep Research Engine
            </h2>
            <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
              Start a research session with AI collaboration
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="What would you like to research?"
              className={`w-full px-4 py-3 rounded-xl border ${
                theme === 'custom' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' :
                'bg-white border-gray-200 placeholder-gray-500'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />

            <div className="grid grid-cols-2 gap-4">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Claude Research
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Gemini Research
              </button>
            </div>

            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity">
              🤝 Collaborative Research
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Multi-Modal Chat Page
const MultiModalChatPage = ({ theme }) => {
  const aiFriends = [
    { id: 'gpt4', name: 'GPT-4o', avatar: '🤖', status: 'online', provider: 'OpenAI' },
    { id: 'claude', name: 'Claude 3.5', avatar: '🧠', status: 'online', provider: 'Anthropic' },
    { id: 'gemini', name: 'Gemini Pro', avatar: '💎', status: 'online', provider: 'Google' },
    { id: 'llama', name: 'Llama 3.1', avatar: '🦙', status: 'away', provider: 'Meta' }
  ];

  return (
    <div className="flex h-screen">
      {/* Friends List */}
      <div className={`w-80 ${theme === 'comfort' ? 'bg-white/30' : theme === 'professional' ? 'bg-gray-50' : 'bg-gray-900'}
                      backdrop-blur-md border-r p-4`}>
        <h2 className={`font-bold text-xl mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          🤖 AI Friends
        </h2>

        <div className="space-y-2">
          {aiFriends.map(friend => (
            <div key={friend.id}
                 className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                            backdrop-blur-md rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 text-2xl flex items-center justify-center">
                    {friend.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    friend.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                    {friend.name}
                  </p>
                  <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {friend.provider} • {friend.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className={`${theme === 'comfort' ? 'bg-white/50' : theme === 'professional' ? 'bg-white' : 'bg-gray-800'}
                        backdrop-blur-md border-b p-4`}>
          <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
            Select an AI friend to start chatting
          </h3>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <p className={`text-lg ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose an AI friend to start a conversation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder pages for remaining components
const MCPMarketplacePage = ({ theme }) => (
  <div className="p-6">
    <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
      📦 MCP Marketplace
    </h1>
    <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
      Model Control Protocol packages and integrations
    </p>
  </div>
);

const MiniAppsPage = ({ theme }) => (
  <div className="p-6">
    <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
      🎨 Mini Apps
    </h1>
    <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
      Lightweight apps and utilities
    </p>
  </div>
);

const ResourcesMonitorPage = ({ theme }) => (
  <div className="p-6">
    <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
      📊 Resources Monitor
    </h1>
    <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
      System resources and performance monitoring
    </p>
  </div>
);

const APIUsagePage = ({ theme }) => (
  <div className="p-6">
    <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
      ⚡ API Usage
    </h1>
    <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
      API usage analytics and cost tracking
    </p>
  </div>
);

const ActivityHubPage = ({ theme }) => (
  <div className="p-6">
    <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
      🔄 Activity Hub
    </h1>
    <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
      Live activity feed and system status
    </p>
  </div>
);

const SettingsPage = ({ theme }) => (
  <div className="p-6">
    <h1 className={`text-3xl font-bold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
      ⚙️ Settings
    </h1>
    <p className={`${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
      Platform configuration and preferences
    </p>
  </div>
);

export default PodplaySanctuary;
