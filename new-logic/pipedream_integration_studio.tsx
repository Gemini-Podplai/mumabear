import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Eye, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Link,
  Database,
  Globe,
  Bot,
  Workflow,
  Code,
  Filter,
  ArrowRight,
  RefreshCw,
  Bell,
  Calendar,
  Mail,
  Github,
  MonitorSpeaker,
  Search,
  Star
} from 'lucide-react';

const IntegrationStudio = () => {
  const [activeTab, setActiveTab] = useState('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for workflows
  const [workflows, setWorkflows] = useState([
    {
      id: 'wf_001',
      name: 'GitHub to Slack Deployment Notifications',
      description: 'Automatically notify team when code is deployed',
      status: 'active',
      triggers: ['GitHub Push', 'Deployment Success'],
      actions: ['Slack Message', 'Update Database'],
      executions: 127,
      lastRun: '2 minutes ago',
      success_rate: 98.4,
      created_by: 'mama_bear_devops',
      tags: ['deployment', 'notifications', 'github', 'slack']
    },
    {
      id: 'wf_002', 
      name: 'Customer Support Auto-Responder',
      description: 'AI-powered first response to customer inquiries',
      status: 'active',
      triggers: ['Email Received', 'Form Submission'],
      actions: ['OpenAI Analysis', 'Send Email', 'Create Ticket'],
      executions: 89,
      lastRun: '5 minutes ago',
      success_rate: 95.2,
      created_by: 'mama_bear_support',
      tags: ['support', 'ai', 'automation', 'email']
    },
    {
      id: 'wf_003',
      name: 'API Health Monitor',
      description: 'Monitor all APIs and alert on failures',
      status: 'active',
      triggers: ['Scheduled Check', 'API Response'],
      actions: ['Health Check', 'Send Alert', 'Update Dashboard'],
      executions: 2156,
      lastRun: '30 seconds ago', 
      success_rate: 99.9,
      created_by: 'mama_bear_monitor',
      tags: ['monitoring', 'apis', 'health', 'alerts']
    },
    {
      id: 'wf_004',
      name: 'User Onboarding Sequence',
      description: 'Welcome new users with personalized content',
      status: 'paused',
      triggers: ['User Signup', 'Profile Complete'],
      actions: ['Send Welcome Email', 'Add to CRM', 'Schedule Follow-up'],
      executions: 45,
      lastRun: '2 hours ago',
      success_rate: 92.1,
      created_by: 'mama_bear_growth',
      tags: ['onboarding', 'email', 'crm', 'automation']
    }
  ]);

  // Integration templates
  const integrationTemplates = [
    {
      id: 'temp_001',
      name: 'AI Content Generator',
      description: 'Generate content using OpenAI and publish to multiple channels',
      category: 'AI & Content',
      connections: ['OpenAI', 'WordPress', 'Twitter', 'Slack'],
      icon: <Bot className="w-5 h-5" />,
      difficulty: 'Easy',
      estimatedTime: '5 minutes'
    },
    {
      id: 'temp_002', 
      name: 'E-commerce Order Processor',
      description: 'Process orders, update inventory, and send confirmations',
      category: 'E-commerce',
      connections: ['Shopify', 'Google Sheets', 'Mailchimp', 'QuickBooks'],
      icon: <Database className="w-5 h-5" />,
      difficulty: 'Medium',
      estimatedTime: '15 minutes'
    },
    {
      id: 'temp_003',
      name: 'Social Media Monitor',
      description: 'Track mentions and respond automatically',
      category: 'Social Media',
      connections: ['Twitter', 'Instagram', 'Facebook', 'Slack'],
      icon: <MonitorSpeaker className="w-5 h-5" />,
      difficulty: 'Medium', 
      estimatedTime: '10 minutes'
    },
    {
      id: 'temp_004',
      name: 'Meeting Transcription & Summary',
      description: 'Record, transcribe, and summarize meetings automatically',
      category: 'Productivity',
      connections: ['Zoom', 'OpenAI', 'Notion', 'Calendar'],
      icon: <Calendar className="w-5 h-5" />,
      difficulty: 'Advanced',
      estimatedTime: '20 minutes'
    }
  ];

  // Available services for integration
  const availableServices = [
    { name: 'OpenAI', icon: <Bot />, category: 'AI', status: 'connected' },
    { name: 'Anthropic', icon: <Bot />, category: 'AI', status: 'connected' },
    { name: 'Google AI', icon: <Bot />, category: 'AI', status: 'connected' },
    { name: 'GitHub', icon: <Github />, category: 'Development', status: 'connected' },
    { name: 'Slack', icon: <Bell />, category: 'Communication', status: 'connected' },
    { name: 'Gmail', icon: <Mail />, category: 'Email', status: 'available' },
    { name: 'Discord', icon: <Globe />, category: 'Communication', status: 'available' },
    { name: 'Notion', icon: <Database />, category: 'Productivity', status: 'available' },
    { name: 'Airtable', icon: <Database />, category: 'Database', status: 'available' },
    { name: 'Webhooks', icon: <Link />, category: 'Custom', status: 'available' },
    { name: 'HTTP API', icon: <Code />, category: 'Custom', status: 'available' },
    { name: 'Google Sheets', icon: <Database />, category: 'Productivity', status: 'available' }
  ];

  const WorkflowCard = ({ workflow }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{workflow.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {workflow.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            workflow.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {workflow.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Executions</p>
          <p className="font-semibold">{workflow.executions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Success Rate</p>
          <p className="font-semibold text-green-600">{workflow.success_rate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Last Run</p>
          <p className="font-semibold">{workflow.lastRun}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Created By</p>
          <p className="font-semibold text-purple-600">{workflow.created_by}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors">
            <Eye className="w-4 h-4 mr-1 inline" />
            View
          </button>
          <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 mr-1 inline" />
            Edit
          </button>
        </div>
        
        <button className={`p-2 rounded-md transition-colors ${
          workflow.status === 'active' 
            ? 'text-red-600 hover:bg-red-50' 
            : 'text-green-600 hover:bg-green-50'
        }`}>
          {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          {template.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{template.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {template.estimatedTime}
            </span>
            <span className={`px-2 py-1 rounded-full ${
              template.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              template.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {template.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Connections:</p>
        <div className="flex flex-wrap gap-2">
          {template.connections.map(conn => (
            <span key={conn} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              {conn}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
        <Plus className="w-4 h-4 mr-2 inline" />
        Use Template
      </button>
    </div>
  );

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          {service.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{service.name}</h4>
          <p className="text-xs text-gray-500">{service.category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          service.status === 'connected' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {service.status}
        </span>
      </div>
      
      <button className={`w-full px-3 py-2 rounded-md text-sm transition-colors ${
        service.status === 'connected'
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          : 'bg-purple-600 text-white hover:bg-purple-700'
      }`}>
        {service.status === 'connected' ? 'Manage' : 'Connect'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Integration Studio</h1>
                <p className="text-sm text-gray-500">Powered by Pipedream & Mama Bear</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>4 Active Workflows</span>
              </div>
              <button 
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'workflows', label: 'My Workflows', icon: Workflow },
            { id: 'templates', label: 'Templates', icon: Star },
            { id: 'services', label: 'Services', icon: Link },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        {activeTab === 'workflows' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Workflows</h2>
                <p className="text-gray-600">Manage your automated integrations and workflows</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflows.map(workflow => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Integration Templates</h2>
                <p className="text-gray-600">Pre-built workflows to get started quickly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrationTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Connected Services</h2>
                <p className="text-gray-600">Manage your service connections and integrations</p>
              </div>
              
              <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableServices.map(service => (
                <ServiceCard key={service.name} service={service} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
              <p className="text-gray-600">Monitor performance and usage across all workflows</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Executions</p>
                    <p className="text-2xl font-bold text-gray-900">2,417</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">↗ +12% from last week</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">97.8%</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">↗ +0.2% from last week</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">1.2s</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">↗ -0.3s from last week</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Workflows</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">No change</p>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Timeline</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">📊 Chart visualization would go here</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Floating Panel */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">🐻 Mama Bear Assistant</h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            "Create a GitHub to Slack workflow"
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            "Monitor API health automatically"
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            "Set up customer auto-responder"
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStudio;