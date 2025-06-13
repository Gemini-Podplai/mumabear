import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CpuChipIcon,
  WrenchScrewdriverIcon,
  CommandLineIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: 'code' | 'file' | 'search' | 'analysis' | 'automation';
  status: 'available' | 'running' | 'completed' | 'error';
  icon: React.ComponentType<any>;
  lastUsed?: Date;
  usage: number;
}

interface AgentTask {
  id: string;
  agentId: string;
  toolId: string;
  description: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  result?: string;
}

interface CollaborationAgent {
  id: string;
  name: string;
  type: 'copilot' | 'reviewer' | 'optimizer' | 'debugger' | 'assistant';
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: string[];
  currentTask?: string;
  avatar: string;
  performance: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
  };
}

interface AgentToolsPanelProps {
  workspaceId: string;
  onToolExecute?: (toolId: string, params: any) => void;
  onAgentAssign?: (agentId: string, task: string) => void;
}

const AgentToolsPanel: React.FC<AgentToolsPanelProps> = ({
  workspaceId,
  onToolExecute,
  onAgentAssign
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'agents' | 'tasks'>('tools');
  const [mcpTools, setMcpTools] = useState<MCPTool[]>([
    {
      id: 'code-completion',
      name: 'Smart Code Completion',
      description: 'AI-powered code completion with context awareness',
      category: 'code',
      status: 'available',
      icon: CodeBracketIcon,
      usage: 156
    },
    {
      id: 'file-watcher',
      name: 'File Watcher',
      description: 'Monitor file changes and trigger automated actions',
      category: 'file',
      status: 'running',
      icon: EyeIcon,
      usage: 89
    },
    {
      id: 'semantic-search',
      name: 'Semantic Search',
      description: 'Search codebase using natural language queries',
      category: 'search',
      status: 'available',
      icon: MagnifyingGlassIcon,
      usage: 234
    },
    {
      id: 'code-analyzer',
      name: 'Code Analyzer',
      description: 'Analyze code quality, performance, and security',
      category: 'analysis',
      status: 'available',
      icon: BoltIcon,
      usage: 67
    },
    {
      id: 'auto-refactor',
      name: 'Auto Refactor',
      description: 'Automatically refactor code for better performance',
      category: 'automation',
      status: 'available',
      icon: WrenchScrewdriverIcon,
      usage: 43
    }
  ]);

  const [agents, setAgents] = useState<CollaborationAgent[]>([
    {
      id: 'copilot-pro',
      name: 'Copilot Pro',
      type: 'copilot',
      status: 'active',
      capabilities: ['code-completion', 'bug-detection', 'optimization'],
      currentTask: 'Analyzing React components...',
      avatar: '🤖',
      performance: {
        tasksCompleted: 1247,
        successRate: 94.2,
        avgResponseTime: 1.3
      }
    },
    {
      id: 'code-reviewer',
      name: 'Code Reviewer',
      type: 'reviewer',
      status: 'busy',
      capabilities: ['code-review', 'security-scan', 'best-practices'],
      currentTask: 'Reviewing pull request #42...',
      avatar: '👨‍💻',
      performance: {
        tasksCompleted: 892,
        successRate: 97.8,
        avgResponseTime: 2.1
      }
    },
    {
      id: 'performance-optimizer',
      name: 'Performance Optimizer',
      type: 'optimizer',
      status: 'idle',
      capabilities: ['performance-analysis', 'memory-optimization', 'bundle-analysis'],
      avatar: '⚡',
      performance: {
        tasksCompleted: 456,
        successRate: 91.5,
        avgResponseTime: 3.7
      }
    },
    {
      id: 'debug-assistant',
      name: 'Debug Assistant',
      type: 'debugger',
      status: 'active',
      capabilities: ['error-detection', 'stack-trace-analysis', 'fix-suggestions'],
      currentTask: 'Investigating runtime error...',
      avatar: '🐛',
      performance: {
        tasksCompleted: 678,
        successRate: 89.3,
        avgResponseTime: 2.8
      }
    }
  ]);

  const [activeTasks, setActiveTasks] = useState<AgentTask[]>([
    {
      id: 'task-1',
      agentId: 'copilot-pro',
      toolId: 'code-completion',
      description: 'Generate TypeScript interfaces for API responses',
      status: 'running',
      progress: 65,
      startTime: new Date(Date.now() - 120000)
    },
    {
      id: 'task-2',
      agentId: 'code-reviewer',
      toolId: 'code-analyzer',
      description: 'Security audit of authentication module',
      status: 'running',
      progress: 30,
      startTime: new Date(Date.now() - 300000)
    },
    {
      id: 'task-3',
      agentId: 'debug-assistant',
      toolId: 'semantic-search',
      description: 'Find similar error patterns in codebase',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 600000),
      endTime: new Date(Date.now() - 60000),
      result: 'Found 3 similar patterns with solutions'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 10, 100);
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running',
            endTime: newProgress >= 100 ? new Date() : undefined
          };
        }
        return task;
      }));

      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.8 ? 
          (agent.status === 'active' ? 'busy' : 'active') : 
          agent.status
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'code': return 'bg-blue-500';
      case 'file': return 'bg-green-500';
      case 'search': return 'bg-purple-500';
      case 'analysis': return 'bg-orange-500';
      case 'automation': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': case 'active': case 'completed': return 'text-green-400';
      case 'running': case 'busy': return 'text-yellow-400';
      case 'error': case 'failed': return 'text-red-400';
      case 'idle': case 'offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const renderToolsTab = () => (
    <div className="space-y-3">
      {mcpTools.map(tool => (
        <motion.div
          key={tool.id}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(tool.category)}`}>
                <tool.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">{tool.name}</h4>
                <p className="text-gray-400 text-xs">{tool.description}</p>
              </div>
            </div>
            <div className={`text-xs ${getStatusColor(tool.status)}`}>
              {tool.status}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400">
                Used {tool.usage} times
              </span>
              <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                {tool.category}
              </span>
            </div>
            <button
              onClick={() => onToolExecute?.(tool.id, {})}
              disabled={tool.status === 'running'}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-xs"
            >
              <PlayIcon className="w-3 h-3" />
              <span>Execute</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAgentsTab = () => (
    <div className="space-y-3">
      {agents.map(agent => (
        <motion.div
          key={agent.id}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-700 rounded-lg p-4 border border-gray-600"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{agent.avatar}</div>
              <div>
                <h4 className="text-white font-medium text-sm">{agent.name}</h4>
                <p className="text-gray-400 text-xs capitalize">{agent.type}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 text-xs ${getStatusColor(agent.status)}`}>
              <div className={`w-2 h-2 rounded-full ${
                agent.status === 'active' ? 'bg-green-400' :
                agent.status === 'busy' ? 'bg-yellow-400 animate-pulse' :
                agent.status === 'idle' ? 'bg-gray-400' :
                'bg-red-400'
              }`}></div>
              <span>{agent.status}</span>
            </div>
          </div>

          {agent.currentTask && (
            <div className="mb-3 p-2 bg-gray-800 rounded text-xs text-gray-300">
              {agent.currentTask}
            </div>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {agent.capabilities.map(capability => (
              <span
                key={capability}
                className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
              >
                {capability}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-3">
            <div>
              <div className="text-white font-medium">{agent.performance.tasksCompleted}</div>
              <div>Tasks</div>
            </div>
            <div>
              <div className="text-white font-medium">{agent.performance.successRate}%</div>
              <div>Success</div>
            </div>
            <div>
              <div className="text-white font-medium">{agent.performance.avgResponseTime}s</div>
              <div>Avg Time</div>
            </div>
          </div>

          <button
            onClick={() => onAgentAssign?.(agent.id, 'Custom task')}
            disabled={agent.status === 'offline'}
            className="w-full flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-xs"
          >
            <ChatBubbleLeftRightIcon className="w-3 h-3" />
            <span>Assign Task</span>
          </button>
        </motion.div>
      ))}
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-3">
      {activeTasks.map(task => {
        const agent = agents.find(a => a.id === task.agentId);
        const tool = mcpTools.find(t => t.id === task.toolId);
        
        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{agent?.avatar}</span>
                <div>
                  <h4 className="text-white font-medium text-sm">{task.description}</h4>
                  <p className="text-gray-400 text-xs">
                    {agent?.name} • {tool?.name}
                  </p>
                </div>
              </div>
              <div className={`text-xs ${getStatusColor(task.status)}`}>
                {task.status}
              </div>
            </div>

            {task.status === 'running' && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(task.progress)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-3 h-3" />
                <span>
                  Started {new Date(task.startTime).toLocaleTimeString()}
                </span>
              </div>
              {task.status === 'completed' && task.result && (
                <span className="text-green-400">{task.result}</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-800 border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          <CpuChipIcon className="w-5 h-5 text-purple-400" />
          <span>MCP Agent Tools</span>
        </h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-3 bg-gray-700 rounded-lg p-1">
          {[
            { id: 'tools', label: 'Tools', icon: WrenchScrewdriverIcon },
            { id: 'agents', label: 'Agents', icon: CpuChipIcon },
            { id: 'tasks', label: 'Tasks', icon: CommandLineIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded text-xs transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'tools' && renderToolsTab()}
          {activeTab === 'agents' && renderAgentsTab()}
          {activeTab === 'tasks' && renderTasksTab()}
        </motion.div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="text-white font-medium">{mcpTools.length}</div>
            <div className="text-gray-400">Tools</div>
          </div>
          <div>
            <div className="text-white font-medium">{agents.filter(a => a.status === 'active').length}</div>
            <div className="text-gray-400">Active</div>
          </div>
          <div>
            <div className="text-white font-medium">{activeTasks.filter(t => t.status === 'running').length}</div>
            <div className="text-gray-400">Running</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentToolsPanel;
// Export statement to make this a module
export {};