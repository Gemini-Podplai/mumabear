import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Target, Route, Brain, Cpu, MemoryStick, DollarSign,
  Clock, TrendingUp, Activity, CheckCircle, AlertCircle,
  ArrowRight, ArrowDown, Play, Pause, Square, Settings,
  Monitor, Database, Globe, Code, Container, Server,
  BarChart3, PieChart, LineChart, RefreshCw, Eye,
  Layers, Workflow, GitBranch, MapPin, Compass,
  Sparkles, Heart, Coffee, Star, Shield, Award
} from 'lucide-react';

interface ExecutionPlatform {
  id: string;
  name: string;
  type: 'e2b' | 'scrapybara' | 'local' | 'cloud' | 'vertex' | 'anthropic';
  icon: React.ComponentType<any>;
  status: 'available' | 'busy' | 'offline' | 'maintenance';
  capabilities: string[];
  performance: {
    speed: number;
    reliability: number;
    cost_efficiency: number;
    scalability: number;
  };
  current_load: number;
  queue_length: number;
  avg_response_time: number;
  cost_per_hour: number;
  success_rate: number;
}

interface TaskComplexity {
  level: 'simple' | 'moderate' | 'complex' | 'enterprise';
  score: number;
  factors: {
    computational_requirements: number;
    data_processing: number;
    integration_complexity: number;
    real_time_requirements: number;
    security_requirements: number;
  };
  estimated_duration: number;
  recommended_platforms: string[];
}

interface ExecutionStep {
  id: string;
  name: string;
  description: string;
  platform: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'skipped';
  progress: number;
  start_time?: string;
  end_time?: string;
  duration?: number;
  output?: string;
  cost?: number;
  dependencies: string[];
}

interface WorkflowExecution {
  id: string;
  title: string;
  description: string;
  complexity: TaskComplexity;
  steps: ExecutionStep[];
  status: 'planning' | 'running' | 'paused' | 'completed' | 'failed';
  total_progress: number;
  estimated_completion: string;
  actual_completion?: string;
  total_cost: number;
  created_at: string;
}

const EnhancedExecutionRouter = ({ theme }) => {
  // Core state
  const [platforms, setPlatforms] = useState<ExecutionPlatform[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowExecution | null>(null);
  const [taskComplexity, setTaskComplexity] = useState<TaskComplexity | null>(null);
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowExecution[]>([]);

  // UI state
  const [showPlatformComparison, setShowPlatformComparison] = useState(true);
  const [showComplexityAnalysis, setShowComplexityAnalysis] = useState(true);
  const [showLiveMonitoring, setShowLiveMonitoring] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Input state
  const [taskDescription, setTaskDescription] = useState('');
  const [analysisMode, setAnalysisMode] = useState<'automatic' | 'manual'>('automatic');

  // Initialize platforms
  useEffect(() => {
    const mockPlatforms: ExecutionPlatform[] = [
      {
        id: 'e2b',
        name: 'E2B Environment',
        type: 'e2b',
        icon: Container,
        status: 'available',
        capabilities: ['Code Execution', 'File System', 'Package Management', 'Network Access'],
        performance: { speed: 85, reliability: 92, cost_efficiency: 78, scalability: 70 },
        current_load: 35,
        queue_length: 2,
        avg_response_time: 1.2,
        cost_per_hour: 0.15,
        success_rate: 94.5
      },
      {
        id: 'scrapybara',
        name: 'Scrapybara Web',
        type: 'scrapybara',
        icon: Globe,
        status: 'available',
        capabilities: ['Web Scraping', 'Browser Automation', 'Data Collection', 'API Testing'],
        performance: { speed: 78, reliability: 88, cost_efficiency: 85, scalability: 82 },
        current_load: 52,
        queue_length: 1,
        avg_response_time: 2.1,
        cost_per_hour: 0.12,
        success_rate: 91.2
      },
      {
        id: 'vertex_ai',
        name: 'Vertex AI Platform',
        type: 'vertex',
        icon: Brain,
        status: 'available',
        capabilities: ['ML Training', 'Model Inference', 'Large Language Models', 'Multi-modal AI'],
        performance: { speed: 95, reliability: 96, cost_efficiency: 65, scalability: 98 },
        current_load: 23,
        queue_length: 0,
        avg_response_time: 0.8,
        cost_per_hour: 0.45,
        success_rate: 98.1
      },
      {
        id: 'cloud_compute',
        name: 'Cloud Compute',
        type: 'cloud',
        icon: Server,
        status: 'available',
        capabilities: ['High Performance', 'Auto Scaling', 'Load Balancing', 'Container Orchestration'],
        performance: { speed: 90, reliability: 94, cost_efficiency: 72, scalability: 95 },
        current_load: 67,
        queue_length: 3,
        avg_response_time: 1.5,
        cost_per_hour: 0.28,
        success_rate: 96.3
      },
      {
        id: 'local_dev',
        name: 'Local Development',
        type: 'local',
        icon: Monitor,
        status: 'available',
        capabilities: ['Instant Access', 'Full Control', 'No Network Latency', 'Custom Environment'],
        performance: { speed: 75, reliability: 85, cost_efficiency: 95, scalability: 40 },
        current_load: 45,
        queue_length: 0,
        avg_response_time: 0.3,
        cost_per_hour: 0.00,
        success_rate: 89.7
      }
    ];

    setPlatforms(mockPlatforms);
  }, []);

  // Real-time platform updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPlatforms(prev => prev.map(platform => ({
        ...platform,
        current_load: Math.max(0, Math.min(100, platform.current_load + (Math.random() - 0.5) * 10)),
        queue_length: Math.max(0, platform.queue_length + Math.floor((Math.random() - 0.5) * 2)),
        avg_response_time: Math.max(0.1, platform.avg_response_time + (Math.random() - 0.5) * 0.3),
        success_rate: Math.max(85, Math.min(100, platform.success_rate + (Math.random() - 0.5) * 2))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Get AI-powered task analysis
  const getAITaskAnalysis = async (taskDescription: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/openai-vertex/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert task complexity analyst for execution platforms. Analyze tasks and provide numerical scores (0-100) for different complexity factors. Respond with a JSON object containing scores and analysis.'
            },
            {
              role: 'user',
              content: `Analyze this task for complexity: "${taskDescription}"

Please provide analysis with scores (0-100) for:
1. computational_requirements - CPU/memory intensive operations
2. data_processing - Amount and complexity of data handling
3. integration_complexity - Number of systems/APIs to integrate
4. real_time_requirements - Time sensitivity and latency requirements
5. security_requirements - Security and compliance needs
6. estimated_duration - Estimated time in minutes

Respond with JSON format:
{
  "computational_requirements": 50,
  "data_processing": 40,
  "integration_complexity": 30,
  "real_time_requirements": 20,
  "security_requirements": 60,
  "estimated_duration": 15,
  "reasoning": "Brief explanation of the analysis"
}`
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting AI task analysis:', error);
      return null;
    }
  };

  // Analyze task complexity with AI assistance
  const analyzeTaskComplexity = async (description: string): Promise<TaskComplexity> => {
    // First get AI analysis
    let aiAnalysis = null;
    try {
      aiAnalysis = await getAITaskAnalysis(description);
    } catch (error) {
      console.error('Error getting AI task analysis:', error);
    }

    const words = description.toLowerCase().split(' ');

    // Enhanced complexity analysis using AI + keyword fallback
    const factors = {
      computational_requirements: aiAnalysis?.computational_requirements || (
        words.some(w => ['ai', 'ml', 'training', 'compute'].includes(w)) ? 80 : 40
      ),
      data_processing: aiAnalysis?.data_processing || (
        words.some(w => ['data', 'process', 'analyze', 'transform'].includes(w)) ? 70 : 30
      ),
      integration_complexity: aiAnalysis?.integration_complexity || (
        words.some(w => ['integrate', 'api', 'connect', 'sync'].includes(w)) ? 60 : 25
      ),
      real_time_requirements: aiAnalysis?.real_time_requirements || (
        words.some(w => ['real-time', 'live', 'instant', 'streaming'].includes(w)) ? 85 : 20
      ),
      security_requirements: aiAnalysis?.security_requirements || (
        words.some(w => ['secure', 'encrypt', 'auth', 'privacy'].includes(w)) ? 75 : 35
      )
    };

    const score = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length;

    let level: 'simple' | 'moderate' | 'complex' | 'enterprise';
    if (score < 35) level = 'simple';
    else if (score < 55) level = 'moderate';
    else if (score < 75) level = 'complex';
    else level = 'enterprise';

    const recommended_platforms = platforms
      .sort((a, b) => {
        // Score platforms based on task requirements
        const scoreA = (a.performance.speed + a.performance.reliability + a.performance.scalability) / 3;
        const scoreB = (b.performance.speed + b.performance.reliability + b.performance.scalability) / 3;
        return scoreB - scoreA;
      })
      .slice(0, 3)
      .map(p => p.id);

    return {
      level,
      score,
      factors,
      estimated_duration: aiAnalysis?.estimated_duration || Math.max(1, Math.round(score / 10)),
      recommended_platforms
    };
  };
};
  };

// Create workflow execution plan
const createWorkflowPlan = (description: string, complexity: TaskComplexity): WorkflowExecution => {
  const steps: ExecutionStep[] = [
    {
      id: 'analyze',
      name: 'Task Analysis',
      description: 'Analyze task requirements and dependencies',
      platform: 'vertex_ai',
      status: 'pending',
      progress: 0,
      dependencies: []
    },
    {
      id: 'prepare',
      name: 'Environment Preparation',
      description: 'Set up execution environment and resources',
      platform: complexity.recommended_platforms[0],
      status: 'pending',
      progress: 0,
      dependencies: ['analyze']
    },
    {
      id: 'execute',
      name: 'Main Execution',
      description: 'Execute the primary task workflow',
      platform: complexity.recommended_platforms[0],
      status: 'pending',
      progress: 0,
      dependencies: ['prepare']
    },
    {
      id: 'validate',
      name: 'Result Validation',
      description: 'Validate outputs and perform quality checks',
      platform: 'vertex_ai',
      status: 'pending',
      progress: 0,
      dependencies: ['execute']
    },
    {
      id: 'optimize',
      name: 'Optimization',
      description: 'Optimize results and cleanup resources',
      platform: complexity.recommended_platforms[1] || 'local_dev',
      status: 'pending',
      progress: 0,
      dependencies: ['validate']
    }
  ];

  return {
    id: `workflow_${Date.now()}`,
    title: `Task: ${description.slice(0, 50)}${description.length > 50 ? '...' : ''}`,
    description,
    complexity,
    steps,
    status: 'planning',
    total_progress: 0,
    estimated_completion: new Date(Date.now() + complexity.estimated_duration * 60 * 1000).toLocaleTimeString(),
    total_cost: complexity.estimated_duration * 0.25,
    created_at: new Date().toLocaleTimeString()
  };
};

// Execute workflow
const executeWorkflow = async (workflow: WorkflowExecution) => {
  setActiveWorkflow({ ...workflow, status: 'running' });

  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];

    // Update step status to running
    setActiveWorkflow(prev => {
      if (!prev) return prev;
      const updatedSteps = [...prev.steps];
      updatedSteps[i] = { ...step, status: 'running', start_time: new Date().toLocaleTimeString() };
      return { ...prev, steps: updatedSteps };
    });

    // Simulate step execution with progress updates
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));

      setActiveWorkflow(prev => {
        if (!prev) return prev;
        const updatedSteps = [...prev.steps];
        updatedSteps[i] = { ...updatedSteps[i], progress };

        const totalProgress = updatedSteps.reduce((sum, s, idx) => {
          if (idx < i) return sum + 100;
          if (idx === i) return sum + progress;
          return sum;
        }, 0) / updatedSteps.length;

        return { ...prev, steps: updatedSteps, total_progress: totalProgress };
      });
    }

    // Complete step
    setActiveWorkflow(prev => {
      if (!prev) return prev;
      const updatedSteps = [...prev.steps];
      updatedSteps[i] = {
        ...updatedSteps[i],
        status: 'completed',
        progress: 100,
        end_time: new Date().toLocaleTimeString(),
        duration: Math.random() * 3 + 1,
        cost: Math.random() * 0.1 + 0.05,
        output: `Step ${i + 1} completed successfully`
      };
      return { ...prev, steps: updatedSteps };
    });
  }

  // Complete workflow
  setActiveWorkflow(prev => {
    if (!prev) return prev;
    const completed = {
      ...prev,
      status: 'completed' as const,
      total_progress: 100,
      actual_completion: new Date().toLocaleTimeString()
    };
    setWorkflowHistory(history => [completed, ...history]);
    return completed;
  });
};

// Handle task submission
const handleTaskSubmission = async () => {
  if (!taskDescription.trim()) return;

  const complexity = await analyzeTaskComplexity(taskDescription);
  setTaskComplexity(complexity);

  const workflow = createWorkflowPlan(taskDescription, complexity);
  executeWorkflow(workflow);

  setTaskDescription('');
};

// Get platform status color
const getPlatformStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'text-green-600 bg-green-100';
    case 'busy': return 'text-yellow-600 bg-yellow-100';
    case 'offline': return 'text-red-600 bg-red-100';
    case 'maintenance': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Get complexity color
const getComplexityColor = (level: string) => {
  switch (level) {
    case 'simple': return 'text-green-600 bg-green-100';
    case 'moderate': return 'text-blue-600 bg-blue-100';
    case 'complex': return 'text-orange-600 bg-orange-100';
    case 'enterprise': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

return (
  <div className={`h-screen flex flex-col ${theme === 'comfort'
      ? 'bg-gradient-to-br from-purple-50 to-pink-50'
      : theme === 'professional'
        ? 'bg-gray-50'
        : 'bg-gray-900'
    }`}>

    {/* Header */}
    <div className={`flex items-center justify-between p-4 border-b ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-md'
      }`}>

      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme === 'comfort'
            ? 'bg-gradient-to-br from-orange-400 to-red-400'
            : theme === 'professional'
              ? 'bg-orange-600'
              : 'bg-orange-600'
          }`}>
          <Route className="w-6 h-6 text-white" />
        </div>

        <div>
          <h1 className={`font-bold text-xl flex items-center gap-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'
            }`}>
            Enhanced Execution Router
            <Zap className="w-5 h-5 text-orange-500" />
          </h1>
          <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
            Intelligent task routing & workflow optimization • {platforms.length} platforms available
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowPlatformComparison(!showPlatformComparison)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${theme === 'custom'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <BarChart3 size={16} />
          Platform Analysis
        </button>

        <button
          onClick={() => setShowLiveMonitoring(!showLiveMonitoring)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${theme === 'custom'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <Activity size={16} />
          Live Monitor
        </button>
      </div>
    </div>

    {/* Task Input & Analysis */}
    <div className={`p-6 border-b ${theme === 'custom' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
          Task Submission & Complexity Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Input */}
          <div className="lg:col-span-2">
            <div className={`p-4 rounded-xl ${theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border'
              } border`}>
              <label className={`block text-sm font-medium mb-2 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Task Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Describe your task in detail... (e.g., 'Train an AI model to classify user sentiments from social media data with real-time processing')"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${theme === 'custom'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                  }`}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={analysisMode === 'automatic'}
                      onChange={() => setAnalysisMode('automatic')}
                      className="text-orange-500"
                    />
                    <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Automatic Analysis
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={analysisMode === 'manual'}
                      onChange={() => setAnalysisMode('manual')}
                      className="text-orange-500"
                    />
                    <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Manual Selection
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleTaskSubmission}
                  disabled={!taskDescription.trim()}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${taskDescription.trim()
                      ? 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <Target size={16} />
                  Analyze & Route
                </button>
              </div>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div>
            {taskComplexity && (
              <div className={`p-4 rounded-xl ${theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border'
                } border`}>
                <h3 className={`font-semibold mb-3 flex items-center gap-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'
                  }`}>
                  <Brain className="w-4 h-4" />
                  Complexity Analysis
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Level
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(taskComplexity.level)}`}>
                      {taskComplexity.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Score
                    </span>
                    <span className={`text-sm font-mono ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      {Math.round(taskComplexity.score)}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Est. Duration
                    </span>
                    <span className={`text-sm font-mono ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      {taskComplexity.estimated_duration}min
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className={`text-xs font-medium mb-2 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Complexity Factors
                    </p>
                    {Object.entries(taskComplexity.factors).map(([factor, value]) => (
                      <div key={factor} className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {factor.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${value > 70 ? 'bg-red-500' :
                                  value > 50 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className={`text-xs font-mono w-8 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {Math.round(value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Area */}
    <div className="flex-1 flex">

      {/* Platform Comparison */}
      {showPlatformComparison && (
        <div className={`w-96 border-r ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          } p-6 overflow-y-auto`}>

          <h3 className={`font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
            Platform Comparison
          </h3>

          <div className="space-y-4">
            {platforms.map(platform => (
              <div
                key={platform.id}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedPlatforms.includes(platform.id)
                    ? 'ring-2 ring-orange-500 bg-orange-50'
                    : theme === 'custom' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-md border'
                  } ${!selectedPlatforms.includes(platform.id) && theme !== 'custom' ? 'border' : ''}`}
                onClick={() => {
                  setSelectedPlatforms(prev =>
                    prev.includes(platform.id)
                      ? prev.filter(id => id !== platform.id)
                      : [...prev, platform.id]
                  );
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <platform.icon className={`w-6 h-6 ${platform.type === 'e2b' ? 'text-blue-500' :
                        platform.type === 'scrapybara' ? 'text-green-500' :
                          platform.type === 'vertex' ? 'text-purple-500' :
                            platform.type === 'cloud' ? 'text-red-500' :
                              'text-gray-500'
                      }`} />
                    <div>
                      <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {platform.name}
                      </h4>
                      <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {platform.type.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformStatusColor(platform.status)}`}>
                    {platform.status}
                  </span>
                </div>

                {/* Performance metrics */}
                <div className="space-y-2 mb-3">
                  {[
                    { name: 'Speed', value: platform.performance.speed },
                    { name: 'Reliability', value: platform.performance.reliability },
                    { name: 'Cost Efficiency', value: platform.performance.cost_efficiency },
                    { name: 'Scalability', value: platform.performance.scalability }
                  ].map(metric => (
                    <div key={metric.name} className="flex items-center justify-between">
                      <span className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {metric.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${metric.value > 80 ? 'bg-green-500' :
                                metric.value > 60 ? 'bg-yellow-500' :
                                  'bg-red-500'
                              }`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                        <span className={`text-xs font-mono w-8 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {metric.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current status */}
                <div className={`text-xs space-y-1 pt-2 border-t ${theme === 'custom' ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
                  }`}>
                  <div className="flex justify-between">
                    <span>Load: {Math.round(platform.current_load)}%</span>
                    <span>Queue: {platform.queue_length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>${platform.cost_per_hour}/hr</span>
                    <span>{platform.success_rate.toFixed(1)}% success</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Execution View */}
      <div className="flex-1 flex flex-col">

        {/* Active Workflow */}
        {activeWorkflow && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">

              {/* Workflow header */}
              <div className={`p-6 rounded-xl mb-6 ${theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border'
                } border`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className={`text-xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      {activeWorkflow.title}
                    </h2>
                    <p className={`text-sm mt-1 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activeWorkflow.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${activeWorkflow.status === 'running' ? 'bg-blue-100 text-blue-700' :
                        activeWorkflow.status === 'completed' ? 'bg-green-100 text-green-700' :
                          activeWorkflow.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                      }`}>
                      {activeWorkflow.status}
                    </span>
                    <div className={`text-sm mt-2 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {Math.round(activeWorkflow.total_progress)}% complete
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${activeWorkflow.total_progress}%` }}
                    />
                  </div>
                </div>

                {/* Workflow stats */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      {activeWorkflow.steps.length}
                    </div>
                    <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Steps
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      {activeWorkflow.estimated_completion}
                    </div>
                    <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Est. Completion
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      ${activeWorkflow.total_cost.toFixed(2)}
                    </div>
                    <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Est. Cost
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${activeWorkflow.complexity.level === 'simple' ? 'text-green-500' :
                        activeWorkflow.complexity.level === 'moderate' ? 'text-blue-500' :
                          activeWorkflow.complexity.level === 'complex' ? 'text-orange-500' :
                            'text-red-500'
                      }`}>
                      {activeWorkflow.complexity.level}
                    </div>
                    <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Complexity
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow steps */}
              <div className="space-y-4">
                {activeWorkflow.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl ${theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border'
                      } border`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-green-100 text-green-600' :
                            step.status === 'running' ? 'bg-blue-100 text-blue-600' :
                              step.status === 'error' ? 'bg-red-100 text-red-600' :
                                'bg-gray-100 text-gray-600'
                          }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : step.status === 'running' ? (
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          ) : step.status === 'error' ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                            {step.name}
                          </h4>
                          <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-sm font-medium ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Platform: {platforms.find(p => p.id === step.platform)?.name}
                        </div>
                        {step.duration && (
                          <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Duration: {step.duration.toFixed(1)}s
                          </div>
                        )}
                        {step.cost && (
                          <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Cost: ${step.cost.toFixed(3)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress bar for running steps */}
                    {step.status === 'running' && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                        <div className={`text-xs mt-1 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {step.progress}% complete
                        </div>
                      </div>
                    )}

                    {/* Step output */}
                    {step.output && (
                      <div className={`mt-3 p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-900' : 'bg-gray-50'
                        }`}>
                        <pre className={`text-xs font-mono ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          {step.output}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Default state */}
        {!activeWorkflow && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Route className={`w-16 h-16 mx-auto mb-4 ${theme === 'custom' ? 'text-gray-600' : 'text-gray-400'
                }`} />
              <p className={`text-lg font-medium ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                Submit a task to see workflow execution
              </p>
              <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                The intelligent router will analyze and optimize your task execution
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Live Monitoring Panel */}
      {showLiveMonitoring && (
        <div className={`w-80 border-l ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          } p-6 overflow-y-auto`}>

          <h3 className={`font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
            Live Monitoring
          </h3>

          {/* System overview */}
          <div className={`p-4 rounded-lg mb-4 ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
            }`}>
            <h4 className={`font-medium mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              System Overview
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}>
                  Active Platforms
                </span>
                <span className="font-mono text-green-500">
                  {platforms.filter(p => p.status === 'available').length}/{platforms.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}>
                  Avg Load
                </span>
                <span className="font-mono">
                  {Math.round(platforms.reduce((sum, p) => sum + p.current_load, 0) / platforms.length)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}>
                  Queue Length
                </span>
                <span className="font-mono">
                  {platforms.reduce((sum, p) => sum + p.queue_length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}>
                  Avg Response
                </span>
                <span className="font-mono">
                  {(platforms.reduce((sum, p) => sum + p.avg_response_time, 0) / platforms.length).toFixed(1)}s
                </span>
              </div>
            </div>
          </div>

          {/* Platform health */}
          <div className="space-y-3">
            {platforms.map(platform => (
              <div
                key={platform.id}
                className={`p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                    {platform.name}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${platform.status === 'available' ? 'bg-green-400' :
                      platform.status === 'busy' ? 'bg-yellow-400' :
                        'bg-red-400'
                    }`} />
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Load</span>
                    <span className="font-mono">{Math.round(platform.current_load)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-mono">{platform.success_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="font-mono">{platform.avg_response_time.toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow history */}
          {workflowHistory.length > 0 && (
            <div className="mt-6">
              <h4 className={`font-medium mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Recent Workflows
              </h4>
              <div className="space-y-2">
                {workflowHistory.slice(0, 3).map(workflow => (
                  <div
                    key={workflow.id}
                    className={`p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {workflow.title.slice(0, 20)}...
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${workflow.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {workflow.actual_completion} • ${workflow.total_cost.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
};

export default EnhancedExecutionRouter;
