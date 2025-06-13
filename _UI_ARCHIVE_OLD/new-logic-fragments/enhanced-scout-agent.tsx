import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  Clock,
  Container,
  Cpu,
  Eye,
  Globe,
  HardDrive,
  MemoryStick,
  Monitor,
  Network,
  Pause,
  Play,
  Server,
  Settings,
  Sparkles,
  Square,
  Target
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface EnvironmentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
  details?: string[];
  progress?: number;
}

interface ExecutionEnvironment {
  id: string;
  name: string;
  type: 'e2b' | 'scrapybara' | 'local' | 'cloud';
  status: 'initializing' | 'ready' | 'running' | 'stopped' | 'error';
  resources: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  capabilities: string[];
  uptime?: number;
  lastActivity?: string;
}

interface TaskExecution {
  id: string;
  title: string;
  environment: string;
  status: 'queued' | 'running' | 'paused' | 'completed' | 'failed';
  steps: EnvironmentStep[];
  startTime?: string;
  estimatedCompletion?: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
}

const EnhancedScoutAgent = ({ theme }) => {
  // Core state
  const [activeEnvironment, setActiveEnvironment] = useState<string>('e2b-dev');
  const [currentTask, setCurrentTask] = useState<TaskExecution | null>(null);
  const [environments, setEnvironments] = useState<ExecutionEnvironment[]>([
    {
      id: 'e2b-dev',
      name: 'E2B Development',
      type: 'e2b',
      status: 'ready',
      resources: { cpu: 45, memory: 32, storage: 18, network: 78 },
      capabilities: ['Code Execution', 'File System', 'Network Access', 'Package Management'],
      uptime: 12847,
      lastActivity: '2 minutes ago'
    },
    {
      id: 'scrapybara-web',
      name: 'Scrapybara Web',
      type: 'scrapybara',
      status: 'ready',
      resources: { cpu: 23, memory: 41, storage: 8, network: 92 },
      capabilities: ['Web Scraping', 'Browser Automation', 'Data Collection', 'API Testing'],
      uptime: 8943,
      lastActivity: '5 minutes ago'
    },
    {
      id: 'cloud-scale',
      name: 'Cloud Scale',
      type: 'cloud',
      status: 'initializing',
      resources: { cpu: 78, memory: 85, storage: 34, network: 95 },
      capabilities: ['High Performance', 'Auto Scaling', 'Load Balancing', 'Container Orchestration'],
      uptime: 0,
      lastActivity: 'Starting...'
    }
  ]);

  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showResourceMonitor, setShowResourceMonitor] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'creating' | 'deploying' | 'ready'>('idle');
  const [aiGuidance, setAiGuidance] = useState<string>('');
  const [showAiGuidance, setShowAiGuidance] = useState(false);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);

  // Animation timer
  const animationRef = useRef<NodeJS.Timeout>();

  // Scout Variants
  const scoutVariants = [
    {
      id: 'environment_specialist',
      name: 'Environment Specialist',
      emoji: '🏗️',
      color: 'blue',
      description: 'Environment setup & management',
      expertise: ['Container Setup', 'Resource Optimization', 'Environment Configuration']
    },
    {
      id: 'execution_commander',
      name: 'Execution Commander',
      emoji: '⚡',
      color: 'yellow',
      description: 'Task execution & orchestration',
      expertise: ['Task Coordination', 'Workflow Management', 'Performance Monitoring']
    },
    {
      id: 'integration_architect',
      name: 'Integration Architect',
      emoji: '🔗',
      color: 'purple',
      description: 'System integration & connectivity',
      expertise: ['API Integration', 'Service Mesh', 'Data Pipelines']
    }
  ];

  // Environment creation steps
  const createEnvironmentSteps: EnvironmentStep[] = [
    {
      id: 'validate',
      name: 'Validate Requirements',
      description: 'Checking system requirements and dependencies',
      status: 'pending',
      details: ['Memory requirements', 'CPU availability', 'Network connectivity', 'Storage space']
    },
    {
      id: 'allocate',
      name: 'Allocate Resources',
      description: 'Reserving computational resources',
      status: 'pending',
      details: ['CPU cores allocation', 'Memory reservation', 'Storage provisioning', 'Network setup']
    },
    {
      id: 'initialize',
      name: 'Initialize Environment',
      description: 'Setting up execution environment',
      status: 'pending',
      details: ['Container creation', 'Runtime installation', 'Security configuration', 'File system setup']
    },
    {
      id: 'configure',
      name: 'Configure Services',
      description: 'Installing and configuring services',
      status: 'pending',
      details: ['Package installation', 'Service configuration', 'Environment variables', 'Security policies']
    },
    {
      id: 'verify',
      name: 'Verify Environment',
      description: 'Running health checks and validation',
      status: 'pending',
      details: ['Connectivity tests', 'Performance benchmarks', 'Security validation', 'Integration tests']
    },
    {
      id: 'finalize',
      name: 'Finalize Setup',
      description: 'Completing environment initialization',
      status: 'pending',
      details: ['Final optimizations', 'Monitoring setup', 'Logging configuration', 'Ready for tasks']
    }
  ];

  // Simulate environment creation
  const createEnvironment = async (envType: 'e2b' | 'scrapybara' | 'cloud') => {
    setAnimationPhase('creating');
    setShowCreatePanel(true);

    const newTask: TaskExecution = {
      id: `task_${Date.now()}`,
      title: `Creating ${envType.toUpperCase()} Environment`,
      environment: envType,
      status: 'running',
      steps: [...createEnvironmentSteps],
      startTime: new Date().toLocaleTimeString(),
      complexity: 'moderate'
    };

    setCurrentTask(newTask);

    // Simulate step-by-step execution
    for (let i = 0; i < createEnvironmentSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setCurrentTask(prev => {
        if (!prev) return prev;
        const updatedSteps = [...prev.steps];

        // Mark current step as completed
        updatedSteps[i] = {
          ...updatedSteps[i],
          status: 'completed',
          duration: Math.random() * 3 + 1,
          progress: 100
        };

        // Mark next step as running
        if (i < createEnvironmentSteps.length - 1) {
          updatedSteps[i + 1] = {
            ...updatedSteps[i + 1],
            status: 'running',
            progress: 0
          };
        }

        return {
          ...prev,
          steps: updatedSteps
        };
      });
    }

    // Complete the task
    setCurrentTask(prev => prev ? { ...prev, status: 'completed' } : null);
    setAnimationPhase('ready');

    // Add new environment
    const newEnv: ExecutionEnvironment = {
      id: `${envType}-${Date.now()}`,
      name: `${envType.toUpperCase()} Environment`,
      type: envType,
      status: 'ready',
      resources: {
        cpu: Math.random() * 50 + 20,
        memory: Math.random() * 60 + 20,
        storage: Math.random() * 30 + 10,
        network: Math.random() * 40 + 60
      },
      capabilities: envType === 'e2b'
        ? ['Code Execution', 'File System', 'Network Access', 'Package Management']
        : envType === 'scrapybara'
          ? ['Web Scraping', 'Browser Automation', 'Data Collection', 'API Testing']
          : ['High Performance', 'Auto Scaling', 'Load Balancing', 'Container Orchestration'],
      uptime: 0,
      lastActivity: 'Just created'
    };

    setEnvironments(prev => [...prev, newEnv]);

    setTimeout(() => {
      setShowCreatePanel(false);
      setAnimationPhase('idle');
    }, 3000);
  };

  // Get AI guidance for environment setup
  const getAiGuidance = async (envType: 'e2b' | 'scrapybara' | 'cloud', projectDescription?: string) => {
    setIsLoadingGuidance(true);
    setShowAiGuidance(true);

    try {
      const prompt = `As an Environment Specialist AI, provide guidance for setting up a ${envType.toUpperCase()} environment${projectDescription ? ` for: ${projectDescription}` : ''}.

Environment Type: ${envType}
${envType === 'e2b' ? 'E2B: Code execution sandbox for running any code securely' : ''}
${envType === 'scrapybara' ? 'Scrapybara: Web scraping and browser automation platform' : ''}
${envType === 'cloud' ? 'Cloud: High-performance cloud computing environment' : ''}

Please provide:
1. Recommended configuration settings
2. Required dependencies and packages
3. Performance optimization tips
4. Security best practices
5. Common pitfalls to avoid

Keep the response practical and actionable.`;

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
              content: 'You are an expert Environment Specialist AI assistant helping developers set up optimal execution environments. Provide clear, actionable guidance with specific recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const guidance = data.choices?.[0]?.message?.content || 'No guidance available at the moment.';

      setAiGuidance(guidance);
    } catch (error) {
      console.error('Error getting AI guidance:', error);
      setAiGuidance('Unable to get AI guidance at the moment. Please check your connection and try again.');
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  // Real-time resource updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironments(prev => prev.map(env => ({
        ...env,
        resources: {
          cpu: Math.max(0, Math.min(100, env.resources.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, env.resources.memory + (Math.random() - 0.5) * 8)),
          storage: Math.max(0, Math.min(100, env.resources.storage + (Math.random() - 0.5) * 3)),
          network: Math.max(0, Math.min(100, env.resources.network + (Math.random() - 0.5) * 15))
        },
        uptime: env.status === 'ready' ? env.uptime! + 1 : env.uptime
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'initializing': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'stopped': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResourceColor = (value: number) => {
    if (value < 30) return 'text-green-600 bg-green-100';
    if (value < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'comfort'
        ? 'bg-gradient-to-br from-purple-50 to-pink-50'
        : theme === 'professional'
          ? 'bg-gray-50'
          : 'bg-gray-900'
      }`}>

      {/* Enhanced Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-md'
        }`}>

        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme === 'comfort'
              ? 'bg-gradient-to-br from-blue-400 to-purple-400'
              : theme === 'professional'
                ? 'bg-blue-600'
                : 'bg-blue-600'
            }`}>
            <Bot className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className={`font-bold text-xl flex items-center gap-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'
              }`}>
              Enhanced Scout Agent
              <Target className="w-5 h-5 text-blue-500" />
            </h1>
            <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
              Environment Creation & Task Execution • {environments.length} environments active
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowResourceMonitor(!showResourceMonitor)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${theme === 'custom'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Monitor size={16} />
            {showResourceMonitor ? 'Hide' : 'Show'} Monitor
          </button>

          <button
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${theme === 'custom'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Settings size={16} />
            Configure
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">

          {/* Scout Variant Selector */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Scout Variants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scoutVariants.map((variant) => (
                <div
                  key={variant.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${theme === 'custom'
                      ? 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                      : 'bg-white hover:shadow-md border'
                    } border hover:scale-105`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{variant.emoji}</span>
                    <div>
                      <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {variant.name}
                      </h3>
                      <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {variant.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {variant.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${theme === 'custom'
                            ? `bg-${variant.color}-900 text-${variant.color}-300`
                            : `bg-${variant.color}-100 text-${variant.color}-700`
                          }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Creation Panel */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Environment Creation
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAiGuidance(!showAiGuidance)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${theme === 'custom'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                >
                  <Brain size={16} />
                  AI Guidance
                </button>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status: {animationPhase}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${animationPhase === 'idle' ? 'bg-gray-400' :
                      animationPhase === 'creating' ? 'bg-yellow-400 animate-pulse' :
                        animationPhase === 'deploying' ? 'bg-blue-400 animate-pulse' :
                          'bg-green-400'
                    }`} />
                </div>
              </div>
            </div>

            {/* AI Guidance Panel */}
            {showAiGuidance && (
              <div className={`mb-6 p-4 rounded-xl ${theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
                } border`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold flex items-center gap-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'
                    }`}>
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    AI Environment Guidance
                  </h3>
                  <button
                    onClick={() => setShowAiGuidance(false)}
                    className={`p-1 rounded ${theme === 'custom' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {[
                    { type: 'e2b' as const, name: 'E2B Guidance', icon: Container, color: 'blue' },
                    { type: 'scrapybara' as const, name: 'Scrapybara Guidance', icon: Globe, color: 'green' },
                    { type: 'cloud' as const, name: 'Cloud Guidance', icon: Server, color: 'purple' }
                  ].map((env) => (
                    <button
                      key={env.type}
                      onClick={() => getAiGuidance(env.type)}
                      disabled={isLoadingGuidance}
                      className={`p-3 rounded-lg transition-colors flex items-center gap-2 ${theme === 'custom'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border'
                        } ${isLoadingGuidance ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <env.icon size={16} className={`text-${env.color}-500`} />
                      Get {env.name}
                    </button>
                  ))}
                </div>

                {isLoadingGuidance && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className={`ml-3 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Getting AI guidance...
                    </span>
                  </div>
                )}

                {aiGuidance && !isLoadingGuidance && (
                  <div className={`p-4 rounded-lg ${theme === 'custom' ? 'bg-gray-900' : 'bg-white'
                    } border`}>
                    <h4 className={`font-semibold mb-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      AI Recommendations:
                    </h4>
                    <div className={`prose prose-sm max-w-none ${theme === 'custom' ? 'prose-invert' : ''
                      }`}>
                      <pre className="whitespace-pre-wrap text-sm">{aiGuidance}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: 'e2b' as const, name: 'E2B Environment', icon: Container, color: 'blue' },
                { type: 'scrapybara' as const, name: 'Scrapybara Environment', icon: Globe, color: 'green' },
                { type: 'cloud' as const, name: 'Cloud Environment', icon: Server, color: 'purple' }
              ].map((env) => (
                <button
                  key={env.type}
                  onClick={() => createEnvironment(env.type)}
                  disabled={animationPhase !== 'idle'}
                  className={`p-6 rounded-xl text-left transition-all duration-200 border-2 border-dashed ${animationPhase === 'idle'
                      ? `border-${env.color}-300 hover:border-${env.color}-500 hover:scale-105`
                      : 'border-gray-300 opacity-50 cursor-not-allowed'
                    } ${theme === 'custom' ? 'bg-gray-800' : 'bg-white hover:shadow-lg'}`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <env.icon className={`w-8 h-8 text-${env.color}-500`} />
                    <div>
                      <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        Create {env.name}
                      </h3>
                      <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Deploy new {env.type.toUpperCase()} environment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full ${theme === 'custom'
                        ? `bg-${env.color}-900 text-${env.color}-300`
                        : `bg-${env.color}-100 text-${env.color}-700`
                      }`}>
                      {animationPhase === 'idle' ? 'Ready to deploy' : 'Deploying...'}
                    </span>
                    <ArrowRight className={`w-4 h-4 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Environments */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Active Environments
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {environments.map((env) => (
                <div
                  key={env.id}
                  className={`p-6 rounded-xl ${theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-sm'
                    } border`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${env.type === 'e2b' ? 'bg-blue-100' :
                          env.type === 'scrapybara' ? 'bg-green-100' :
                            'bg-purple-100'
                        }`}>
                        {env.type === 'e2b' ? <Container className="w-5 h-5 text-blue-600" /> :
                          env.type === 'scrapybara' ? <Globe className="w-5 h-5 text-green-600" /> :
                            <Server className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                          {env.name}
                        </h3>
                        <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {env.lastActivity}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(env.status)}`}>
                      {env.status}
                    </span>
                  </div>

                  {/* Resource monitoring */}
                  <div className="space-y-3 mb-4">
                    {[
                      { name: 'CPU', value: env.resources.cpu, icon: Cpu },
                      { name: 'Memory', value: env.resources.memory, icon: MemoryStick },
                      { name: 'Storage', value: env.resources.storage, icon: HardDrive },
                      { name: 'Network', value: env.resources.network, icon: Network }
                    ].map((resource) => (
                      <div key={resource.name} className="flex items-center space-x-3">
                        <resource.icon className={`w-4 h-4 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium w-16 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {resource.name}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${resource.value < 30 ? 'bg-green-500' :
                                resource.value < 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                              }`}
                            style={{ width: `${resource.value}%` }}
                          />
                        </div>
                        <span className={`text-sm font-mono w-12 text-right ${getResourceColor(resource.value).split(' ')[0]}`}>
                          {Math.round(resource.value)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Capabilities */}
                  <div>
                    <p className={`text-sm font-medium mb-2 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Capabilities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {env.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-xs rounded-full ${theme === 'custom'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                        <Play size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
                        <Pause size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                        <Square size={16} />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className={`p-2 rounded-lg transition-colors ${theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}>
                        <Eye size={16} />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}>
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Monitor Sidebar */}
        {showResourceMonitor && (
          <div className={`w-80 border-l p-6 ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
            <h3 className={`font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              Resource Monitor
            </h3>

            {/* Live Ticker */}
            <div className={`p-4 rounded-lg mb-4 ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                  System Load
                </span>
                <Activity className={`w-4 h-4 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <div className="text-2xl font-bold text-green-500">
                {Math.round(environments.reduce((acc, env) => acc + env.resources.cpu, 0) / environments.length)}%
              </div>
              <div className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                Average across {environments.length} environments
              </div>
            </div>

            {/* Environment Status */}
            <div className="space-y-3">
              {environments.map((env) => (
                <div
                  key={env.id}
                  className={`p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {env.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${env.status === 'ready' ? 'bg-green-400' :
                        env.status === 'running' ? 'bg-blue-400' :
                          env.status === 'initializing' ? 'bg-yellow-400' :
                            'bg-red-400'
                      }`} />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>CPU</span>
                      <span className="font-mono">{Math.round(env.resources.cpu)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory</span>
                      <span className="font-mono">{Math.round(env.resources.memory)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Environment Creation Modal */}
      {showCreatePanel && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl mx-4 p-6 rounded-2xl ${theme === 'custom' ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                {currentTask.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentTask.status === 'running' ? 'bg-blue-100 text-blue-700' :
                  currentTask.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                {currentTask.status}
              </span>
            </div>

            <div className="space-y-4">
              {currentTask.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-l-4 ${step.status === 'completed' ? 'border-green-500 bg-green-50' :
                      step.status === 'running' ? 'border-blue-500 bg-blue-50' :
                        step.status === 'error' ? 'border-red-500 bg-red-50' :
                          'border-gray-300 bg-gray-50'
                    } ${theme === 'custom' ? 'bg-gray-700 border-opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : step.status === 'running' ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                          {step.name}
                        </h4>
                        <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {step.duration && (
                      <span className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {step.duration.toFixed(1)}s
                      </span>
                    )}
                  </div>

                  {step.details && step.status === 'running' && (
                    <div className="ml-8 space-y-1">
                      {step.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className={`text-sm flex items-center space-x-2 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                          <div className="w-1 h-1 bg-current rounded-full" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {currentTask.status === 'completed' && (
              <div className="mt-6 text-center">
                <div className="text-green-500 mb-2">
                  <CheckCircle className="w-8 h-8 mx-auto" />
                </div>
                <p className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  Environment created successfully!
                </p>
                <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your new environment is ready for task execution.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedScoutAgent;
