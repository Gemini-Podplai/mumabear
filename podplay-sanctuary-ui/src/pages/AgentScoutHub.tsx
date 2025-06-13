import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Code, 
  TestTube, 
  Rocket, 
  Settings,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Cpu,
  BarChart3,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface WorkflowStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  model_used?: string;
  duration?: number;
  health_score?: number;
  icon: React.ComponentType<any>;
  description: string;
}

interface GeminiModel {
  id: string;
  name: string;
  tier: 'primary' | 'secondary' | 'fallback' | 'emergency';
  health_score: number;
  specialties: string[];
  scout_roles: string[];
  quota_usage: {
    minute: string;
    day: string;
  };
  is_healthy: boolean;
  context_window: number;
  cost_tier: string;
  latency: string;
}

interface WorkflowExecution {
  workflow_id: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  stages: WorkflowStage[];
  models_used: string[];
  started_at: string;
  estimated_completion?: string;
}

const AgentScoutHub: React.FC = () => {
  const [activeWorkflows, setActiveWorkflows] = useState<WorkflowExecution[]>([]);
  const [availableModels, setAvailableModels] = useState<GeminiModel[]>([]);
  const [orchestrationStatus, setOrchestrationStatus] = useState<any>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);

  // Mock data representing your actual backend
  const mockWorkflowStages: WorkflowStage[] = [
    {
      id: 'planning',
      name: 'Planning',
      status: 'completed',
      model_used: 'gemini-2.5-pro-preview-06-05',
      duration: 45,
      health_score: 0.95,
      icon: Brain,
      description: 'Strategic planning and project architecture'
    },
    {
      id: 'environment',
      name: 'Environment',
      status: 'completed',
      model_used: 'gemini-2.5-flash-preview-04-17',
      duration: 32,
      health_score: 0.88,
      icon: Settings,
      description: 'Infrastructure setup and configuration'
    },
    {
      id: 'coding',
      name: 'Coding',
      status: 'running',
      model_used: 'gemini-2.5-flash-preview-05-20',
      health_score: 0.92,
      icon: Code,
      description: 'Full-stack development implementation'
    },
    {
      id: 'testing',
      name: 'Testing',
      status: 'pending',
      icon: TestTube,
      description: 'Comprehensive testing and quality validation'
    },
    {
      id: 'deployment',
      name: 'Deployment',
      status: 'pending',
      icon: Rocket,
      description: 'Production deployment and monitoring'
    }
  ];

  const mockGeminiModels: GeminiModel[] = [
    {
      id: 'gemini-2.5-pro-preview-06-05',
      name: 'Gemini 2.5 Pro (Latest)',
      tier: 'primary',
      health_score: 0.95,
      specialties: ['orchestration', 'complex_planning', 'architecture'],
      scout_roles: ['master_planner', 'architect', 'orchestrator'],
      quota_usage: { minute: '12/60', day: '247/1500' },
      is_healthy: true,
      context_window: 1048576,
      cost_tier: 'high',
      latency: 'medium'
    },
    {
      id: 'gemini-2.5-flash-preview-05-20',
      name: 'Gemini 2.5 Flash (Speed)',
      tier: 'secondary',
      health_score: 0.92,
      specialties: ['rapid_development', 'code_generation'],
      scout_roles: ['rapid_developer', 'code_generator'],
      quota_usage: { minute: '8/120', day: '156/3000' },
      is_healthy: true,
      context_window: 1048576,
      cost_tier: 'medium',
      latency: 'fast'
    },
    {
      id: 'gemini-2.5-flash-preview-04-17-thinking',
      name: 'Gemini 2.5 Flash (Thinking)',
      tier: 'fallback',
      health_score: 0.87,
      specialties: ['complex_reasoning', 'debugging', 'optimization'],
      scout_roles: ['debugger', 'optimizer', 'problem_solver'],
      quota_usage: { minute: '3/60', day: '89/1500' },
      is_healthy: true,
      context_window: 1048576,
      cost_tier: 'medium',
      latency: 'slow'
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro (Emergency)',
      tier: 'emergency',
      health_score: 0.78,
      specialties: ['large_context', 'emergency_fallback'],
      scout_roles: ['context_master', 'emergency_backup'],
      quota_usage: { minute: '1/60', day: '23/1500' },
      is_healthy: true,
      context_window: 2000000,
      cost_tier: 'medium',
      latency: 'medium'
    }
  ];

  useEffect(() => {
    // Simulate loading data from your backend APIs
    setAvailableModels(mockGeminiModels);
    setActiveWorkflows([
      {
        workflow_id: 'scout_user123_1734567890',
        status: 'running',
        progress: 60,
        stages: mockWorkflowStages,
        models_used: ['gemini-2.5-pro-preview-06-05', 'gemini-2.5-flash-preview-04-17'],
        started_at: '2024-12-18T10:30:00Z',
        estimated_completion: '2024-12-18T10:45:00Z'
      }
    ]);

    setOrchestrationStatus({
      active_workflows: 1,
      total_models: 8,
      healthy_models: 7,
      system_load: 0.34
    });
  }, []);

  const startNewWorkflow = async () => {
    if (!newWorkflowDescription.trim()) return;
    
    setIsCreatingWorkflow(true);
    
    // Simulate API call to /api/scout/workflow/start
    setTimeout(() => {
      const newWorkflow: WorkflowExecution = {
        workflow_id: `scout_${Date.now()}`,
        status: 'running',
        progress: 0,
        stages: mockWorkflowStages.map(stage => ({ ...stage, status: 'pending' })),
        models_used: [],
        started_at: new Date().toISOString()
      };
      
      setActiveWorkflows(prev => [...prev, newWorkflow]);
      setNewWorkflowDescription('');
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-400">7</p>
                <p className="text-sm text-gray-400">Mama Bear Variants</p>
              </div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">3</p>
                <p className="text-sm text-gray-400">Virtual Computers</p>
              </div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${agent.gradient}`}>
                  <agent.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                  } animate-pulse`}></div>
                  <span className={`text-xs font-medium ${
                    agent.status === 'active' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{agent.description}</p>
              
              {/* Capabilities */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 2).map((capability, idx) => (
                    <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                      {capability}
                    </span>
                  ))}
                  {agent.capabilities.length > 2 && (
                    <span className="text-xs text-gray-500">+{agent.capabilities.length - 2} more</span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                  Configure
                </button>
                <button 
                  onClick={() => handleStartAgent(agent.name)}
                  className={`flex-1 bg-gradient-to-r ${agent.gradient} text-white text-sm py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-1`}
                >
                  <PlayIcon className="w-3 h-3" />
                  <span>Start</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4" />
              <span>Create New Agent</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
              <ArrowRightIcon className="w-4 h-4" />
              <span>Import Agent</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
              <BeakerIcon className="w-4 h-4" />
              <span>Run Diagnostics</span>
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
              <BoltIcon className="w-4 h-4" />
              <span>Performance Monitor</span>
            </button>
          </div>
        </motion.div>

        {/* Virtual Computer Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CpuChipIcon className="w-5 h-5 text-blue-400" />
            <span>Virtual Computer Environment</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Scrapybara Instances</p>
              <p className="text-xl font-bold text-blue-400">2 Active</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">E2B Code Interpreters</p>
              <p className="text-xl font-bold text-green-400">1 Running</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Memory Usage</p>
              <p className="text-xl font-bold text-yellow-400">2.4 GB</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scout Agent Chat Interface */}
      <div className={`fixed right-0 top-16 bottom-0 w-96 transition-all duration-300 ${chatCollapsed ? 'translate-x-full' : 'translate-x-0'}`}>
        <MultimodalChatInterface
          agentName="Scout Agent"
          agentType="scout"
          agentDescription="AI Agent Discovery & Management Specialist"
          isCollapsed={chatCollapsed}
          onToggleCollapse={() => setChatCollapsed(!chatCollapsed)}
          className="h-full"
        />
      </div>

      {/* Start Prompt Modal */}
      {showStartPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/20 p-8 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                🐻
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Start {selectedAgent}</h2>
              <p className="text-gray-400">What would you like this agent to work on?</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                placeholder="Describe your task or project..."
                className="w-full h-32 bg-black/30 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStartPrompt(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLaunchWorkspace(currentTask)}
                  disabled={!currentTask.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white py-3 px-4 rounded-lg transition-opacity flex items-center justify-center space-x-2"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Launch</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transition Animation */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-6 text-6xl"
            >
              🐻
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white mb-4"
            >
              Mama Bear is Creating Your Plan
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2 text-gray-400"
            >
              <p>🔍 Analyzing your requirements...</p>
              <p>🧠 Designing optimal workflow...</p>
              <p>⚡ Setting up virtual environment...</p>
              <p>🚀 Preparing autonomous workspace...</p>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Muma Scout Workspace */}
      <MumaScoutWorkspace
        isOpen={showWorkspace}
        onClose={handleCloseWorkspace}
        agentName={selectedAgent || 'Scout Agent'}
        currentTask={currentTask}
        workspaceId={workspaceId || undefined}
      />
    </div>
  );
};

export default AgentScoutHub;