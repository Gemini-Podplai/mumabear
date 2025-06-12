import React, { useState, useEffect } from 'react';
import {
  Link, Zap, Settings, Play, Pause, Edit, Trash2, Plus, 
  Search, Filter, GitBranch, Database, Globe, Mail, Calendar,
  Slack, Github, Twitter, AlertCircle, CheckCircle, Clock,
  Eye, Code, FileText, BarChart3, RefreshCw, Download,
  Upload, Copy, ExternalLink, Star, Heart, Award,
  Workflow, Network, Cpu, Monitor, Activity, TrendingUp,
  Box, Layers, ArrowRight, ArrowDown, MoreVertical
} from 'lucide-react';

interface PipedreamWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error' | 'draft';
  trigger: {
    type: 'webhook' | 'schedule' | 'email' | 'http' | 'event';
    config: any;
    source: string;
  };
  steps: WorkflowStep[];
  lastRun: Date;
  totalRuns: number;
  successRate: number;
  avgExecutionTime: number;
  category: string;
  tags: string[];
  isTemplate: boolean;
  rating: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'code' | 'filter' | 'delay' | 'branch';
  app?: string;
  icon?: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
  status: 'success' | 'error' | 'pending' | 'skipped';
  executionTime?: number;
  logs?: string[];
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  authType: 'oauth' | 'api_key' | 'username_password';
  capabilities: string[];
  actions: IntegrationAction[];
  triggers: IntegrationTrigger[];
  lastSync: Date;
  usageCount: number;
  isPopular: boolean;
  documentation: string;
}

interface IntegrationAction {
  id: string;
  name: string;
  description: string;
  inputs: any[];
  outputs: any[];
  examples: any[];
}

interface IntegrationTrigger {
  id: string;
  name: string;
  description: string;
  eventTypes: string[];
  outputs: any[];
}

interface EnhancedIntegrationHubProps {
  theme: 'comfort' | 'professional' | 'custom';
}

const EnhancedIntegrationHub: React.FC<EnhancedIntegrationHubProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'integrations' | 'templates' | 'marketplace'>('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<PipedreamWorkflow[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isWorkflowBuilderOpen, setIsWorkflowBuilderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('lastRun');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Mock Workflows Data
  useEffect(() => {
    setWorkflows([
      {
        id: 'wf-1',
        name: 'GitHub to Slack Notifications',
        description: 'Automatically post GitHub issues and PRs to Slack channels',
        status: 'active',
        trigger: {
          type: 'webhook',
          config: { url: 'https://api.github.com/webhooks' },
          source: 'GitHub'
        },
        steps: [
          {
            id: 'step-1',
            name: 'GitHub Webhook',
            type: 'action',
            app: 'GitHub',
            icon: '🐙',
            config: { events: ['issues', 'pull_request'] },
            position: { x: 100, y: 100 },
            connections: ['step-2'],
            status: 'success'
          },
          {
            id: 'step-2',
            name: 'Format Message',
            type: 'code',
            config: { language: 'javascript' },
            position: { x: 300, y: 100 },
            connections: ['step-3'],
            status: 'success'
          },
          {
            id: 'step-3',
            name: 'Send to Slack',
            type: 'action',
            app: 'Slack',
            icon: '💬',
            config: { channel: '#dev-notifications' },
            position: { x: 500, y: 100 },
            connections: [],
            status: 'success'
          }
        ],
        lastRun: new Date(Date.now() - 300000),
        totalRuns: 1247,
        successRate: 98.7,
        avgExecutionTime: 2.3,
        category: 'Development',
        tags: ['GitHub', 'Slack', 'Notifications'],
        isTemplate: false,
        rating: 4.8,
        author: 'User',
        createdAt: new Date(Date.now() - 2592000000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'wf-2',
        name: 'Customer Support Automation',
        description: 'Auto-route support tickets and create Notion tasks',
        status: 'active',
        trigger: {
          type: 'email',
          config: { email: 'support@podplay.com' },
          source: 'Email'
        },
        steps: [
          {
            id: 'step-1',
            name: 'Email Trigger',
            type: 'action',
            app: 'Email',
            icon: '📧',
            config: {},
            position: { x: 100, y: 100 },
            connections: ['step-2'],
            status: 'success'
          },
          {
            id: 'step-2',
            name: 'AI Classification',
            type: 'code',
            config: { ai: 'openai' },
            position: { x: 300, y: 100 },
            connections: ['step-3', 'step-4'],
            status: 'success'
          },
          {
            id: 'step-3',
            name: 'Create Notion Task',
            type: 'action',
            app: 'Notion',
            icon: '📝',
            config: { database: 'Support Tickets' },
            position: { x: 500, y: 50 },
            connections: [],
            status: 'success'
          },
          {
            id: 'step-4',
            name: 'Send Auto-Reply',
            type: 'action',
            app: 'Email',
            icon: '📧',
            config: { template: 'auto-reply' },
            position: { x: 500, y: 150 },
            connections: [],
            status: 'success'
          }
        ],
        lastRun: new Date(Date.now() - 180000),
        totalRuns: 856,
        successRate: 99.2,
        avgExecutionTime: 4.1,
        category: 'Customer Support',
        tags: ['Email', 'Notion', 'AI', 'Automation'],
        isTemplate: false,
        rating: 4.9,
        author: 'User',
        createdAt: new Date(Date.now() - 1814400000),
        updatedAt: new Date(Date.now() - 43200000)
      },
      {
        id: 'wf-3',
        name: 'Social Media Analytics',
        description: 'Collect and analyze social media mentions across platforms',
        status: 'paused',
        trigger: {
          type: 'schedule',
          config: { cron: '0 */6 * * *' },
          source: 'Schedule'
        },
        steps: [
          {
            id: 'step-1',
            name: 'Schedule Trigger',
            type: 'action',
            app: 'Schedule',
            icon: '⏰',
            config: { interval: '6 hours' },
            position: { x: 100, y: 100 },
            connections: ['step-2'],
            status: 'pending'
          },
          {
            id: 'step-2',
            name: 'Fetch Twitter Mentions',
            type: 'action',
            app: 'Twitter',
            icon: '🐦',
            config: { query: '@podplay' },
            position: { x: 300, y: 50 },
            connections: ['step-4'],
            status: 'pending'
          },
          {
            id: 'step-3',
            name: 'Fetch LinkedIn Posts',
            type: 'action',
            app: 'LinkedIn',
            icon: '💼',
            config: { company: 'Podplay' },
            position: { x: 300, y: 150 },
            connections: ['step-4'],
            status: 'pending'
          },
          {
            id: 'step-4',
            name: 'Analyze Sentiment',
            type: 'code',
            config: { ai: 'openai', task: 'sentiment' },
            position: { x: 500, y: 100 },
            connections: ['step-5'],
            status: 'pending'
          },
          {
            id: 'step-5',
            name: 'Update Dashboard',
            type: 'action',
            app: 'Airtable',
            icon: '📊',
            config: { base: 'Social Analytics' },
            position: { x: 700, y: 100 },
            connections: [],
            status: 'pending'
          }
        ],
        lastRun: new Date(Date.now() - 21600000),
        totalRuns: 342,
        successRate: 95.4,
        avgExecutionTime: 8.7,
        category: 'Marketing',
        tags: ['Social Media', 'Analytics', 'AI', 'Sentiment'],
        isTemplate: false,
        rating: 4.6,
        author: 'User',
        createdAt: new Date(Date.now() - 1209600000),
        updatedAt: new Date(Date.now() - 21600000)
      }
    ]);

    setIntegrations([
      {
        id: 'github',
        name: 'GitHub',
        description: 'Connect to GitHub repositories, issues, and pull requests',
        icon: '🐙',
        category: 'Development',
        status: 'connected',
        authType: 'oauth',
        capabilities: ['Read repos', 'Create issues', 'Webhooks', 'Actions'],
        actions: [],
        triggers: [],
        lastSync: new Date(Date.now() - 300000),
        usageCount: 1247,
        isPopular: true,
        documentation: 'https://docs.pipedream.com/apps/github'
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Send messages, create channels, and manage workspace',
        icon: '💬',
        category: 'Communication',
        status: 'connected',
        authType: 'oauth',
        capabilities: ['Send messages', 'Create channels', 'File uploads', 'Bot commands'],
        actions: [],
        triggers: [],
        lastSync: new Date(Date.now() - 180000),
        usageCount: 2156,
        isPopular: true,
        documentation: 'https://docs.pipedream.com/apps/slack'
      },
      {
        id: 'notion',
        name: 'Notion',
        description: 'Create pages, update databases, and manage workspace',
        icon: '📝',
        category: 'Productivity',
        status: 'connected',
        authType: 'oauth',
        capabilities: ['Create pages', 'Update databases', 'Query content', 'File management'],
        actions: [],
        triggers: [],
        lastSync: new Date(Date.now() - 420000),
        usageCount: 934,
        isPopular: true,
        documentation: 'https://docs.pipedream.com/apps/notion'
      },
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'AI-powered text generation, analysis, and processing',
        icon: '🤖',
        category: 'AI',
        status: 'connected',
        authType: 'api_key',
        capabilities: ['Text generation', 'Code completion', 'Image analysis', 'Embeddings'],
        actions: [],
        triggers: [],
        lastSync: new Date(Date.now() - 600000),
        usageCount: 3421,
        isPopular: true,
        documentation: 'https://docs.pipedream.com/apps/openai'
      },
      {
        id: 'airtable',
        name: 'Airtable',
        description: 'Manage databases, records, and collaborative workflows',
        icon: '📊',
        category: 'Database',
        status: 'disconnected',
        authType: 'api_key',
        capabilities: ['Create records', 'Update tables', 'Query data', 'File attachments'],
        actions: [],
        triggers: [],
        lastSync: new Date(Date.now() - 86400000),
        usageCount: 567,
        isPopular: false,
        documentation: 'https://docs.pipedream.com/apps/airtable'
      }
    ]);
  }, []);

  const toggleWorkflowStatus = async (workflowId: string) => {
    setWorkflows(prev => prev.map(wf => 
      wf.id === workflowId 
        ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' }
        : wf
    ));
  };

  const runWorkflow = async (workflowId: string) => {
    // Simulate workflow execution
    setWorkflows(prev => prev.map(wf => 
      wf.id === workflowId 
        ? { 
            ...wf, 
            lastRun: new Date(),
            totalRuns: wf.totalRuns + 1,
            steps: wf.steps.map(step => ({ ...step, status: 'success' as const }))
          }
        : wf
    ));
  };

  const connectIntegration = async (integrationId: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, status: 'connected', lastSync: new Date() }
        : int
    ));
  };

  const filteredWorkflows = workflows.filter(wf => {
    const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wf.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || wf.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(workflows.map(wf => wf.category)))];

  const themeClasses = {
    comfort: {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      card: 'bg-white/80 backdrop-blur-md',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-purple-200',
      accent: 'bg-purple-500',
      hover: 'hover:bg-purple-100'
    },
    professional: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-gray-200',
      accent: 'bg-blue-500',
      hover: 'hover:bg-gray-100'
    },
    custom: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      accent: 'bg-purple-500',
      hover: 'hover:bg-gray-700'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${currentTheme.text} flex items-center space-x-3`}>
                <Link className="text-purple-500" size={32} />
                <span>Integration Hub</span>
                <span className="text-lg text-purple-500">⚡ Pipedream Studio</span>
              </h1>
              <p className={`mt-2 ${currentTheme.textMuted}`}>
                Build, deploy, and manage powerful workflow automations with 1000+ integrations
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className={`px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors flex items-center space-x-2`}
              >
                <Activity size={18} className={realTimeUpdates ? 'text-green-500' : 'text-gray-400'} />
                <span>Live Updates</span>
              </button>
              <button 
                onClick={() => setIsWorkflowBuilderOpen(true)}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Create Workflow</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'workflows', name: 'Workflows', icon: Workflow },
              { id: 'integrations', name: 'Integrations', icon: Network },
              { id: 'templates', name: 'Templates', icon: Box },
              { id: 'marketplace', name: 'Marketplace', icon: Globe }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-purple-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search workflows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${currentTheme.card}`}
                    />
                  </div>
                  
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={`px-4 py-3 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-3 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                  >
                    <option value="lastRun">Last Run</option>
                    <option value="name">Name</option>
                    <option value="totalRuns">Total Runs</option>
                    <option value="successRate">Success Rate</option>
                  </select>
                  
                  <div className="flex border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : currentTheme.hover}`}
                    >
                      <BarChart3 size={18} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : currentTheme.hover}`}
                    >
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Workflows', value: workflows.length, icon: Workflow, color: 'blue' },
                { label: 'Active', value: workflows.filter(w => w.status === 'active').length, icon: Play, color: 'green' },
                { label: 'Total Executions', value: workflows.reduce((acc, w) => acc + w.totalRuns, 0).toLocaleString(), icon: Activity, color: 'purple' },
                { label: 'Avg Success Rate', value: `${(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length).toFixed(1)}%`, icon: TrendingUp, color: 'orange' }
              ].map((stat, idx) => (
                <div key={idx} className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${currentTheme.textMuted}`}>{stat.label}</p>
                      <p className={`text-2xl font-bold ${currentTheme.text} mt-1`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`text-${stat.color}-600`} size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Workflows Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredWorkflows.map((workflow) => (
                <div 
                  key={workflow.id} 
                  className={`${currentTheme.card} rounded-xl border ${currentTheme.border} p-6 hover:shadow-lg transition-all duration-200 group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${currentTheme.text} group-hover:text-purple-600 transition-colors`}>
                        {workflow.name}
                      </h3>
                      <p className={`text-sm ${currentTheme.textMuted} mt-1 line-clamp-2`}>
                        {workflow.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                        workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        workflow.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {workflow.status}
                      </span>
                      <button className={`p-1 rounded ${currentTheme.hover}`}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Workflow Steps Preview */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                      {workflow.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center space-x-2 flex-shrink-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                            step.status === 'success' ? 'bg-green-100 text-green-600' :
                            step.status === 'error' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {step.icon || <Box size={14} />}
                          </div>
                          {idx < workflow.steps.length - 1 && (
                            <ArrowRight size={14} className="text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workflow Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Total Runs</p>
                      <p className={`font-medium ${currentTheme.text}`}>{workflow.totalRuns.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Success Rate</p>
                      <p className={`font-medium ${currentTheme.text}`}>{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Avg Time</p>
                      <p className={`font-medium ${currentTheme.text}`}>{workflow.avgExecutionTime}s</p>
                    </div>
                    <div>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Last Run</p>
                      <p className={`font-medium ${currentTheme.text}`}>
                        {workflow.lastRun.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {workflow.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {workflow.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{workflow.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => toggleWorkflowStatus(workflow.id)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        workflow.status === 'active' 
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                      <span>{workflow.status === 'active' ? 'Pause' : 'Activate'}</span>
                    </button>
                    
                    <button 
                      onClick={() => runWorkflow(workflow.id)}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw size={16} />
                      <span>Run</span>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedWorkflow(workflow.id)}
                      className={`px-4 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <div 
                  key={integration.id} 
                  className={`${currentTheme.card} rounded-xl border ${currentTheme.border} p-6 hover:shadow-lg transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-xl">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${currentTheme.text} flex items-center space-x-2`}>
                          <span>{integration.name}</span>
                          {integration.isPopular && <Star size={14} className="text-yellow-500" />}
                        </h3>
                        <p className={`text-sm ${currentTheme.textMuted} mt-1`}>
                          {integration.description}
                        </p>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mt-2">
                          {integration.category}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                      integration.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className={`text-xs ${currentTheme.textMuted} mb-1`}>Capabilities</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.capabilities.slice(0, 3).map((cap, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {cap}
                          </span>
                        ))}
                        {integration.capabilities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{integration.capabilities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={`text-xs ${currentTheme.textMuted}`}>Usage Count</p>
                        <p className={`font-medium ${currentTheme.text}`}>{integration.usageCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${currentTheme.textMuted}`}>Last Sync</p>
                        <p className={`font-medium ${currentTheme.text}`}>
                          {integration.lastSync.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {integration.status === 'connected' ? (
                      <>
                        <button className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center space-x-2">
                          <CheckCircle size={16} />
                          <span>Connected</span>
                        </button>
                        <button className={`px-4 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}>
                          <Settings size={16} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => connectIntegration(integration.id)}
                        className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Link size={16} />
                        <span>Connect</span>
                      </button>
                    )}
                    <button className={`px-4 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="text-center py-12">
            <Box size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>Workflow Templates</h3>
            <p className={`${currentTheme.textMuted} mb-6`}>
              Browse pre-built workflow templates to get started quickly
            </p>
            <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Browse Templates
            </button>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="text-center py-12">
            <Globe size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>Integration Marketplace</h3>
            <p className={`${currentTheme.textMuted} mb-6`}>
              Discover and install new integrations from the community
            </p>
            <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Explore Marketplace
            </button>
          </div>
        )}
      </div>

      {/* Workflow Builder Modal */}
      {isWorkflowBuilderOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme.card} rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${currentTheme.text}`}>Create New Workflow</h2>
              <button 
                onClick={() => setIsWorkflowBuilderOpen(false)}
                className={`p-2 rounded-lg ${currentTheme.hover}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-center py-12">
              <Workflow size={64} className="mx-auto text-purple-500 mb-4" />
              <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>Visual Workflow Builder</h3>
              <p className={`${currentTheme.textMuted} mb-6`}>
                Drag and drop components to build your automation workflow
              </p>
              <div className="flex space-x-4 justify-center">
                <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Start from Scratch
                </button>
                <button className={`px-6 py-3 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}>
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedIntegrationHub;
