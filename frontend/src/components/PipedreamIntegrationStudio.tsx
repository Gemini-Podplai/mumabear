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

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  triggers: string[];
  actions: string[];
  executions: number;
  lastRun: string;
  success_rate: number;
  created_by: string;
  tags: string[];
}

interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  connections: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_setup_time: string;
  use_cases: string[];
}

const PipedreamIntegrationStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'templates' | 'analytics'>('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for workflows
  const [workflows, setWorkflows] = useState<Workflow[]>([
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
  const integrationTemplates: IntegrationTemplate[] = [
    {
      id: 'temp_001',
      name: 'AI Content Generator',
      description: 'Generate content using OpenAI and publish to multiple channels',
      category: 'AI & Content',
      connections: ['OpenAI', 'WordPress', 'Twitter', 'Slack'],
      difficulty: 'intermediate',
      estimated_setup_time: '15 minutes',
      use_cases: ['Blog automation', 'Social media', 'Content marketing']
    },
    {
      id: 'temp_002',
      name: 'E-commerce Order Processor',
      description: 'Process orders, update inventory, and notify customers',
      category: 'E-commerce',
      connections: ['Shopify', 'Google Sheets', 'SendGrid', 'Slack'],
      difficulty: 'beginner',
      estimated_setup_time: '10 minutes',
      use_cases: ['Order management', 'Inventory tracking', 'Customer notifications']
    },
    {
      id: 'temp_003',
      name: 'Smart Lead Scorer',
      description: 'Score leads using AI and route to appropriate sales rep',
      category: 'Sales & CRM',
      connections: ['HubSpot', 'OpenAI', 'Slack', 'Google Sheets'],
      difficulty: 'advanced',
      estimated_setup_time: '25 minutes',
      use_cases: ['Lead qualification', 'Sales automation', 'AI scoring']
    }
  ];

  const handleWorkflowAction = (workflowId: string, action: 'start' | 'pause' | 'delete') => {
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        if (action === 'start') return { ...wf, status: 'active' as const };
        if (action === 'pause') return { ...wf, status: 'paused' as const };
        return wf;
      }
      return wf;
    }));
    
    if (action === 'delete') {
      setWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
    }
  };

  const filteredWorkflows = workflows.filter(wf => 
    wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wf.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: Workflow['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getDifficultyColor = (difficulty: IntegrationTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🔗 Pipedream Integration Studio</h1>
            <p className="text-gray-600">Autonomous workflow creation with Mama Bear intelligence</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Active Workflows</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{workflows.filter(w => w.status === 'active').length}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Total Executions</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{workflows.reduce((sum, w) => sum + w.executions, 0).toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {((workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length) || 0).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">AI Created</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{workflows.filter(w => w.created_by.includes('mama_bear')).length}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {[
          { id: 'workflows', label: 'Workflows', icon: Workflow },
          { id: 'templates', label: 'Templates', icon: Code },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workflows, tags, or actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Workflow
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map(workflow => (
            <div
              key={workflow.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedWorkflow(workflow)}
            >
              {/* Workflow Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(workflow.status)}
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{workflow.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWorkflowAction(workflow.id, workflow.status === 'active' ? 'pause' : 'start');
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {workflow.status === 'active' ? 
                      <Pause className="w-4 h-4 text-gray-600" /> : 
                      <Play className="w-4 h-4 text-gray-600" />
                    }
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workflow.description}</p>

              {/* Triggers and Actions */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Triggers:</span>
                  <div className="flex gap-1">
                    {workflow.triggers.slice(0, 2).map(trigger => (
                      <span key={trigger} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Actions:</span>
                  <div className="flex gap-1">
                    {workflow.actions.slice(0, 2).map(action => (
                      <span key={action} className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{workflow.executions} runs</span>
                  <span className="text-green-600">{workflow.success_rate}% success</span>
                </div>
                <span className="text-gray-500">{workflow.lastRun}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {workflow.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrationTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
                <Star className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer" />
              </div>

              <p className="text-gray-600 text-sm mb-4">{template.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Connections:</span>
                  <div className="flex flex-wrap gap-1">
                    {template.connections.map(connection => (
                      <span key={connection} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        {connection}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-1">Use Cases:</span>
                  <div className="text-xs text-gray-600">
                    {template.use_cases.join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-4 h-4" />
                  {template.estimated_setup_time}
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Workflow Performance Analytics</h3>
            <div className="text-gray-600">
              📊 Detailed analytics dashboard will be implemented here with:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Execution trends over time</li>
                <li>Success rate analytics</li>
                <li>Most popular triggers and actions</li>
                <li>Cost optimization insights</li>
                <li>AI-generated recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Workflow Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{selectedWorkflow.name}</h2>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">{selectedWorkflow.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Triggers</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.triggers.map(trigger => (
                      <span key={trigger} className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.actions.map(action => (
                      <span key={action} className="bg-green-100 text-green-700 px-3 py-1 rounded">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <span className="text-sm text-gray-500">Total Executions</span>
                    <div className="text-2xl font-bold text-gray-800">{selectedWorkflow.executions}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Success Rate</span>
                    <div className="text-2xl font-bold text-green-600">{selectedWorkflow.success_rate}%</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Workflow
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipedreamIntegrationStudio;
