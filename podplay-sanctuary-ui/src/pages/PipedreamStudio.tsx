import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon,
  PauseIcon,
  Cog6ToothIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import MultimodalChatInterface from '../components/chat/MultimodalChatInterface';

const PipedreamStudio = () => {
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState('webhook-processor');

  const workflows = [
    {
      id: 'webhook-processor',
      name: 'Webhook Data Processor',
      status: 'running',
      lastRun: '2 minutes ago',
      executions: 1247,
      steps: [
        { name: 'Webhook Trigger', type: 'trigger', status: 'active' },
        { name: 'Data Validation', type: 'code', status: 'success' },
        { name: 'Transform Data', type: 'code', status: 'success' },
        { name: 'Send to Database', type: 'action', status: 'success' }
      ]
    },
    {
      id: 'email-automation',
      name: 'Email Campaign Automation',
      status: 'paused',
      lastRun: '1 hour ago',
      executions: 892,
      steps: [
        { name: 'Schedule Trigger', type: 'trigger', status: 'paused' },
        { name: 'Fetch Contacts', type: 'action', status: 'idle' },
        { name: 'Generate Content', type: 'code', status: 'idle' },
        { name: 'Send Emails', type: 'action', status: 'idle' }
      ]
    },
    {
      id: 'ai-content-generator',
      name: 'AI Content Generator',
      status: 'error',
      lastRun: '30 minutes ago',
      executions: 156,
      steps: [
        { name: 'RSS Feed Trigger', type: 'trigger', status: 'success' },
        { name: 'OpenAI Generate', type: 'action', status: 'error' },
        { name: 'Post to Social', type: 'action', status: 'idle' }
      ]
    }
  ];

  const availableSteps = [
    { name: 'HTTP Request', category: 'Actions', icon: '🌐' },
    { name: 'OpenAI', category: 'AI', icon: '🤖' },
    { name: 'Gmail', category: 'Email', icon: '📧' },
    { name: 'Slack', category: 'Communication', icon: '💬' },
    { name: 'Database Query', category: 'Data', icon: '🗄️' },
    { name: 'Code Step', category: 'Code', icon: '💻' },
    { name: 'Webhook', category: 'Triggers', icon: '🔗' },
    { name: 'Schedule', category: 'Triggers', icon: '⏰' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'active': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
        return <PlayIcon className="w-4 h-4" />;
      case 'paused':
        return <PauseIcon className="w-4 h-4" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'success':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${chatCollapsed ? 'mr-0' : 'mr-96'}`}>
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
          >
            Pipedream Studio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Build and automate workflows with ease
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow List */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Workflows</h3>
                <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                  <PlusIcon className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedWorkflow === workflow.id 
                        ? 'bg-purple-600/30 border border-purple-400/50' 
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                    onClick={() => setSelectedWorkflow(workflow.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">{workflow.name}</h4>
                      <div className={`flex items-center space-x-1 ${getStatusColor(workflow.status)}`}>
                        {getStatusIcon(workflow.status)}
                        <span className="text-xs capitalize">{workflow.status}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <p>Last run: {workflow.lastRun}</p>
                      <p>{workflow.executions} executions</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Available Steps */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Available Steps</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="text-lg">{step.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{step.name}</p>
                      <p className="text-xs text-gray-400">{step.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Workflow Editor */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              {selectedWorkflowData && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{selectedWorkflowData.name}</h3>
                      <div className={`flex items-center space-x-2 mt-1 ${getStatusColor(selectedWorkflowData.status)}`}>
                        {getStatusIcon(selectedWorkflowData.status)}
                        <span className="text-sm capitalize">{selectedWorkflowData.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        <PlayIcon className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                        <Cog6ToothIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div className="space-y-4">
                    {selectedWorkflowData.steps.map((step, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            step.status === 'success' ? 'border-green-400 bg-green-400/20' :
                            step.status === 'error' ? 'border-red-400 bg-red-400/20' :
                            step.status === 'active' ? 'border-blue-400 bg-blue-400/20' :
                            'border-gray-400 bg-gray-400/20'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(step.status)}`}></div>
                          </div>
                          
                          <div className="flex-1 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-white">{step.name}</h4>
                                <p className="text-sm text-gray-400 capitalize">{step.type}</p>
                              </div>
                              <div className={`flex items-center space-x-1 ${getStatusColor(step.status)}`}>
                                {getStatusIcon(step.status)}
                                <span className="text-xs capitalize">{step.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {index < selectedWorkflowData.steps.length - 1 && (
                          <div className="flex justify-center my-2">
                            <ArrowRightIcon className="w-4 h-4 text-gray-400 transform rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Step Button */}
                  <div className="mt-6 flex justify-center">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      <PlusIcon className="w-4 h-4" />
                      <span>Add Step</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>

            {/* Execution History */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Executions</h3>
              <div className="space-y-3">
                {[
                  { time: '2 minutes ago', status: 'success', duration: '1.2s' },
                  { time: '5 minutes ago', status: 'success', duration: '0.8s' },
                  { time: '12 minutes ago', status: 'error', duration: '2.1s' },
                  { time: '18 minutes ago', status: 'success', duration: '1.0s' }
                ].map((execution, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        execution.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm text-white">{execution.time}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{execution.duration}</span>
                      <span className={`text-sm capitalize ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Workflow Agent Chat Interface */}
      <div className={`fixed right-0 top-16 bottom-0 w-96 transition-all duration-300 ${chatCollapsed ? 'translate-x-full' : 'translate-x-0'}`}>
        <MultimodalChatInterface
          agentName="Workflow Agent"
          agentType="workflow"
          agentDescription="Automation & Integration Specialist"
          isCollapsed={chatCollapsed}
          onToggleCollapse={() => setChatCollapsed(!chatCollapsed)}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default PipedreamStudio;