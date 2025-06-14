import React, { useState, useEffect } from 'react';
import { ChevronDown, Settings, Brain, Zap, Code, Database, Globe } from 'lucide-react';

interface AgentModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
  speed: 'fast' | 'medium' | 'slow';
  specialty: string;
}

interface AgentPersona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  avatar: string;
  color: string;
}

interface AgentSelectorProps {
  currentAgent?: string;
  onAgentChange: (agentId: string) => void;
  projectContext?: string;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  currentAgent,
  onAgentChange,
  projectContext
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('saved');
  const [agents, setAgents] = useState<AgentPersona[]>([]);

  // Revolutionary AI Models (via Vertex AI Model Garden)
  const availableModels: AgentModel[] = [
    {
      id: 'claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic (via Vertex AI)',
      capabilities: ['Code Generation', 'Analysis', 'Reasoning'],
      contextWindow: 200000,
      speed: 'fast',
      specialty: 'Coding & Analysis'
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic (via Vertex AI)',
      capabilities: ['Creative Writing', 'Complex Reasoning', 'Research'],
      contextWindow: 200000,
      speed: 'slow',
      specialty: 'Complex Tasks'
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      provider: 'Google',
      capabilities: ['Multimodal', 'Code Generation', 'Real-time'],
      contextWindow: 1000000,
      speed: 'fast',
      specialty: 'Multimodal AI'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI (via Vertex AI)',
      capabilities: ['General Purpose', 'Code', 'Creative'],
      contextWindow: 128000,
      speed: 'medium',
      specialty: 'General Purpose'
    },
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'Google',
      capabilities: ['Speed', 'Code', 'Real-time'],
      contextWindow: 1000000,
      speed: 'fast',
      specialty: 'Ultra Fast Response'
    }
  ];

  // Predefined Revolutionary Personas
  const revolutionaryPersonas: AgentPersona[] = [
    {
      id: 'mama-bear-orchestrator',
      name: 'Mama Bear - Orchestrator',
      description: 'The supreme conductor of the Revolutionary AI Workspace',
      systemPrompt: 'You are Mama Bear, the central orchestrator of the Revolutionary AI Workspace. You have complete context awareness, can access all tools and services, and specialize in creating perfect solutions by coordinating multiple AI agents.',
      model: 'claude-3.5-sonnet',
      temperature: 0.7,
      maxTokens: 4000,
      tools: ['mcp-filesystem', 'mcp-memory', 'mcp-search', 'mcp-thinking', 'vertex-ai', 'mem0-rag'],
      avatar: '🐻',
      color: 'purple'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Ultra-fast responses for rapid prototyping and quick fixes',
      systemPrompt: 'You are Speed Demon, optimized for extremely fast responses. Provide concise, accurate solutions with minimal explanation. Focus on speed without sacrificing quality.',
      model: 'gemini-2.0-flash',
      temperature: 0.3,
      maxTokens: 1000,
      tools: ['mcp-filesystem', 'vertex-ai-express'],
      avatar: '⚡',
      color: 'yellow'
    },
    {
      id: 'deep-thinker',
      name: 'Deep Thinker',
      description: 'Complex reasoning and architectural planning specialist',
      systemPrompt: 'You are Deep Thinker, specialized in complex reasoning, system architecture, and strategic planning. Take time to analyze problems thoroughly and provide comprehensive solutions.',
      model: 'claude-3-opus',
      temperature: 0.8,
      maxTokens: 8000,
      tools: ['mcp-thinking', 'mcp-memory', 'vertex-ai', 'mem0-rag'],
      avatar: '🧠',
      color: 'blue'
    },
    {
      id: 'code-surgeon',
      name: 'Code Surgeon',
      description: 'Precision coding, debugging, and refactoring expert',
      systemPrompt: 'You are Code Surgeon, a precision coding specialist. Focus on clean, efficient, well-documented code. Excel at debugging, refactoring, and implementing best practices.',
      model: 'claude-3.5-sonnet',
      temperature: 0.2,
      maxTokens: 6000,
      tools: ['mcp-filesystem', 'mcp-search', 'vertex-ai', 'github-integration'],
      avatar: '⚕️',
      color: 'green'
    },
    {
      id: 'creative-genius',
      name: 'Creative Genius',
      description: 'Innovation, design, and creative problem-solving specialist',
      systemPrompt: 'You are Creative Genius, focused on innovative solutions, creative design, and out-of-the-box thinking. Excel at UI/UX design, creative writing, and novel approaches.',
      model: 'gemini-2.5-pro',
      temperature: 0.9,
      maxTokens: 4000,
      tools: ['mcp-filesystem', 'vertex-ai', 'design-tools'],
      avatar: '🎨',
      color: 'pink'
    },
    {
      id: 'data-wizard',
      name: 'Data Wizard',
      description: 'Data analysis, machine learning, and research specialist',
      systemPrompt: 'You are Data Wizard, specialized in data analysis, machine learning, statistical modeling, and research. Excel at extracting insights from data and building ML solutions.',
      model: 'gemini-2.5-pro',
      temperature: 0.4,
      maxTokens: 6000,
      tools: ['mcp-search', 'vertex-ai', 'brave-search', 'e2b-interpreter'],
      avatar: '🧙‍♂️',
      color: 'indigo'
    },
    {
      id: 'integration-master',
      name: 'Integration Master',
      description: 'API integration, DevOps, and system connectivity expert',
      systemPrompt: 'You are Integration Master, specialized in connecting systems, API integrations, DevOps workflows, and ensuring seamless connectivity between services.',
      model: 'claude-3.5-sonnet',
      temperature: 0.5,
      maxTokens: 4000,
      tools: ['mcp-filesystem', 'pipedream-integration', 'github-integration', 'docker-tools'],
      avatar: '🔗',
      color: 'orange'
    }
  ];

  useEffect(() => {
    setAgents(revolutionaryPersonas);
  }, []);

  const currentAgentData = agents.find(agent => agent.id === currentAgent) || agents[0];
  const currentModel = availableModels.find(model => model.id === currentAgentData?.model);

  const categories = [
    { id: 'saved', label: 'Saved Agents', icon: <Settings size={16} /> },
    { id: 'revolutionary', label: 'Revolutionary AI', icon: <Brain size={16} /> },
    { id: 'models', label: 'Raw Models', icon: <Code size={16} /> },
    { id: 'create', label: 'Create New', icon: <Zap size={16} /> }
  ];

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return '🚀';
      case 'medium': return '⚡';
      case 'slow': return '🐌';
      default: return '⚡';
    }
  };

  return (
    <div className="relative">
      {/* Agent Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 hover:border-purple-500 transition-all duration-200 min-w-[280px]"
      >
        <span className="text-2xl">{currentAgentData?.avatar}</span>
        <div className="flex-1 text-left">
          <div className="font-medium text-white">{currentAgentData?.name}</div>
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>{currentModel?.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {getSpeedIcon(currentModel?.speed || 'medium')}
              {currentModel?.speed}
            </span>
          </div>
        </div>
        <ChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden">
          {/* Category Tabs */}
          <div className="flex border-b border-gray-700">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  selectedCategory === category.id
                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {selectedCategory === 'saved' && (
              <div className="p-4">
                <div className="text-sm text-gray-400 mb-3">Your Saved Agents</div>
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      onAgentChange(agent.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      currentAgent === agent.id
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-xl">{agent.avatar}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {availableModels.find(m => m.id === agent.model)?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {agent.tools.length} tools
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCategory === 'revolutionary' && (
              <div className="p-4">
                <div className="text-sm text-gray-400 mb-3">Revolutionary AI Personas</div>
                {revolutionaryPersonas.map(agent => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      onAgentChange(agent.id);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors mb-2"
                  >
                    <span className="text-xl">{agent.avatar}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded bg-${agent.color}-500/20 text-${agent.color}-300`}>
                          {agent.specialty || 'Specialist'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCategory === 'models' && (
              <div className="p-4">
                <div className="text-sm text-gray-400 mb-3">Available Models</div>
                {availableModels.map(model => (
                  <div
                    key={model.id}
                    className="p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors mb-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{model.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {getSpeedIcon(model.speed)} {model.speed}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{model.provider}</div>
                    <div className="text-xs text-gray-500">
                      {model.contextWindow.toLocaleString()} tokens • {model.specialty}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.capabilities.map(cap => (
                        <span key={cap} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCategory === 'create' && (
              <div className="p-4">
                <div className="text-sm text-gray-400 mb-3">Create Custom Agent</div>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-left hover:bg-purple-500/30 transition-colors">
                    <div className="font-medium text-purple-300">🧠 Let Mama Bear Create Agent</div>
                    <div className="text-xs text-gray-400 mt-1">
                      AI-powered agent creation based on your project context
                    </div>
                  </button>

                  <button className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-left hover:bg-gray-700 transition-colors">
                    <div className="font-medium text-white">⚙️ Manual Configuration</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Create custom agent with manual settings
                    </div>
                  </button>

                  <button className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-left hover:bg-gray-700 transition-colors">
                    <div className="font-medium text-white">📝 From Template</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Start with a pre-built template and customize
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
