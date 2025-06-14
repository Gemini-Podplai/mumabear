import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Star, Download, Play, Settings } from 'lucide-react';

interface McpAgent {
  id: string;
  name: string;
  description: string;
  author: string;
  category: string;
  rating: number;
  downloads: number;
  logo: string;
  source: 'docker' | 'continue' | 'revolutionary' | 'community';
  capabilities: string[];
  configuration?: any;
}

interface McpMarketplaceProps {
  onAgentSelect: (agent: McpAgent) => void;
  currentProject?: string;
}

export const McpMarketplace: React.FC<McpMarketplaceProps> = ({
  onAgentSelect,
  currentProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [agents, setAgents] = useState<McpAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [mamaBearSuggestions, setMamaBearSuggestions] = useState<McpAgent[]>([]);

  // Mock data representing agents from different marketplaces
  const mockAgents: McpAgent[] = [
    {
      id: 'next-assistant',
      name: 'Next.js Assistant',
      description: 'Expert in Next.js development, React Server Components, and modern web apps',
      author: 'Continue Team',
      category: 'Frontend',
      rating: 4.8,
      downloads: 12500,
      logo: '/api/placeholder/64/64',
      source: 'continue',
      capabilities: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      id: 'python-ml-assistant',
      name: 'Data Science & ML Assistant',
      description: 'Python expert for machine learning, data analysis, and scientific computing',
      author: 'Docker Community',
      category: 'Data Science',
      rating: 4.9,
      downloads: 8700,
      logo: '/api/placeholder/64/64',
      source: 'docker',
      capabilities: ['Python', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch']
    },
    {
      id: 'mama-bear-orchestrator',
      name: 'Mama Bear Orchestrator',
      description: 'Revolutionary AI that creates perfect agents for any project context',
      author: 'Podplay Sanctuary',
      category: 'AI Orchestration',
      rating: 5.0,
      downloads: 2100,
      logo: '/api/placeholder/64/64',
      source: 'revolutionary',
      capabilities: ['Agent Creation', 'Context Awareness', 'Multi-Model', 'RAG']
    },
    {
      id: 'angular-assistant',
      name: 'Angular Assistant',
      description: 'Complete Angular development support with best practices',
      author: 'Angular Team',
      category: 'Frontend',
      rating: 4.6,
      downloads: 5400,
      logo: '/api/placeholder/64/64',
      source: 'continue',
      capabilities: ['Angular', 'TypeScript', 'RxJS', 'NgRx']
    },
    {
      id: 'clean-code-assistant',
      name: 'Clean Code Assistant',
      description: 'Helps you write code that follows SOLID design principles',
      author: 'Continue Team',
      category: 'Code Quality',
      rating: 4.7,
      downloads: 9800,
      logo: '/api/placeholder/64/64',
      source: 'continue',
      capabilities: ['Code Review', 'Refactoring', 'Best Practices']
    },
    {
      id: 'pytorch-assistant',
      name: 'PyTorch Assistant',
      description: 'Deep learning and neural network development with PyTorch',
      author: 'Community',
      category: 'Machine Learning',
      rating: 4.8,
      downloads: 6300,
      logo: '/api/placeholder/64/64',
      source: 'community',
      capabilities: ['PyTorch', 'Deep Learning', 'Neural Networks', 'GPU Computing']
    }
  ];

  const categories = ['all', 'Frontend', 'Backend', 'Data Science', 'Machine Learning', 'DevOps', 'Mobile', 'AI Orchestration', 'Code Quality'];
  const sources = ['all', 'docker', 'continue', 'revolutionary', 'community'];

  useEffect(() => {
    setAgents(mockAgents);
    // Simulate Mama Bear analyzing current project context
    if (currentProject) {
      const suggestions = mockAgents.filter(agent =>
        agent.source === 'revolutionary' ||
        agent.capabilities.some(cap => currentProject.includes(cap.toLowerCase()))
      );
      setMamaBearSuggestions(suggestions);
    }
  }, [currentProject]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesSource = selectedSource === 'all' || agent.source === selectedSource;

    return matchesSearch && matchesCategory && matchesSource;
  });

  const handleMamaBearCreateAgent = async () => {
    setLoading(true);
    // Simulate Mama Bear analyzing project and creating custom agent
    await new Promise(resolve => setTimeout(resolve, 2000));

    const customAgent: McpAgent = {
      id: `mama-bear-custom-${Date.now()}`,
      name: `Custom ${currentProject} Agent`,
      description: `Specialized agent created by Mama Bear for your ${currentProject} project`,
      author: 'Mama Bear AI',
      category: 'Custom',
      rating: 5.0,
      downloads: 1,
      logo: '/api/placeholder/64/64',
      source: 'revolutionary',
      capabilities: ['Project-Specific', 'Context-Aware', 'Adaptive Learning']
    };

    setAgents(prev => [customAgent, ...prev]);
    setLoading(false);
    onAgentSelect(customAgent);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'docker': return 'bg-blue-500';
      case 'continue': return 'bg-green-500';
      case 'revolutionary': return 'bg-purple-500';
      case 'community': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Revolutionary MCP Marketplace
            </h1>
            <p className="text-gray-400 mt-2">
              Connect to all major MCP marketplaces. Let Mama Bear create perfect agents for your projects.
            </p>
          </div>
          <button
            onClick={handleMamaBearCreateAgent}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Agent...
              </>
            ) : (
              <>
                <Plus size={16} />
                Let Mama Bear Create Agent
              </>
            )}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search agents, capabilities, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Mama Bear Suggestions */}
        {mamaBearSuggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-purple-400">🐻</span>
              Mama Bear Recommendations for "{currentProject}"
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {mamaBearSuggestions.map(agent => (
                <div
                  key={agent.id}
                  className="min-w-[300px] bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 cursor-pointer hover:border-purple-400 transition-all"
                  onClick={() => onAgentSelect(agent)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img src={agent.logo} alt={agent.name} className="w-8 h-8 rounded" />
                    <span className="font-medium">{agent.name}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{agent.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map(cap => (
                      <span key={cap} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <div
            key={agent.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-200 cursor-pointer group"
            onClick={() => onAgentSelect(agent)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={agent.logo} alt={agent.name} className="w-12 h-12 rounded-lg" />
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-400">{agent.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded text-white ${getSourceBadgeColor(agent.source)}`}>
                  {agent.source}
                </span>
              </div>
            </div>

            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              {agent.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {agent.capabilities.slice(0, 4).map(capability => (
                <span
                  key={capability}
                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                >
                  {capability}
                </span>
              ))}
              {agent.capabilities.length > 4 && (
                <span className="text-xs text-gray-500">+{agent.capabilities.length - 4} more</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={14} fill="currentColor" />
                  <span>{agent.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download size={14} />
                  <span>{agent.downloads.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <Play size={14} />
                </button>
                <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <Settings size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No agents found matching your criteria.</p>
          <button
            onClick={handleMamaBearCreateAgent}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors"
          >
            Let Mama Bear Create a Custom Agent
          </button>
        </div>
      )}
    </div>
  );
};
