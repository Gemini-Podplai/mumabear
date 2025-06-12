import React, { useState, useEffect, useRef } from 'react';
import {
  Search, BookOpen, Globe, Database, Brain, Zap, Eye, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Filter, Settings, Download, Share2, Bookmark, Star,
  Clock, TrendingUp, AlertCircle, CheckCircle, RefreshCw,
  FileText, Image, Video, Audio, Link, Code, Archive,
  Layers, Target, Compass, Microscope, Telescope, Map,
  Coffee, Heart, Sparkles, ArrowRight, Plus, X, Maximize2
} from 'lucide-react';

interface ResearchQuery {
  id: string;
  query: string;
  source: 'academic' | 'web' | 'database' | 'docs' | 'code';
  status: 'pending' | 'searching' | 'analyzing' | 'completed' | 'error';
  results: ResearchResult[];
  timestamp: string;
  progress?: number;
}

interface ResearchResult {
  id: string;
  title: string;
  snippet: string;
  source: string;
  url?: string;
  relevance: number;
  type: 'article' | 'code' | 'documentation' | 'video' | 'data' | 'academic';
  metadata: {
    author?: string;
    date?: string;
    domain?: string;
    language?: string;
    citations?: number;
  };
}

interface ResearchSession {
  id: string;
  title: string;
  queries: ResearchQuery[];
  bookmarks: string[];
  synthesis: string;
  created: string;
  updated: string;
}

const DeepResearchCenter = ({ theme }) => {
  // Core state
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(null);
  const [searchQueries, setSearchQueries] = useState<ResearchQuery[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'academic' | 'web' | 'database' | 'docs' | 'code'>('web');
  
  // Layout state
  const [flowerExpanded, setFlowerExpanded] = useState(true);
  const [activePreview, setActivePreview] = useState<'search1' | 'search2' | 'master'>('master');
  const [showSideTickers, setShowSideTickers] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  // Research state
  const [liveSearches, setLiveSearches] = useState<ResearchQuery[]>([]);
  const [masterSynthesis, setMasterSynthesis] = useState('');
  const [researchHistory, setResearchHistory] = useState<ResearchSession[]>([]);

  // Refs for animations
  const flowerRef = useRef<HTMLDivElement>(null);
  const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Research tools configuration
  const researchTools = [
    {
      id: 'academic_search',
      name: 'Academic Search',
      icon: BookOpen,
      color: 'blue',
      description: 'Search academic papers and journals',
      sources: ['Google Scholar', 'arXiv', 'PubMed', 'IEEE'],
      capabilities: ['Peer-reviewed sources', 'Citation analysis', 'Impact metrics']
    },
    {
      id: 'web_research',
      name: 'Web Research',
      icon: Globe,
      color: 'green',
      description: 'Deep web search and analysis',
      sources: ['Google', 'Bing', 'DuckDuckGo', 'Specialized APIs'],
      capabilities: ['Real-time data', 'News analysis', 'Trend detection']
    },
    {
      id: 'database_query',
      name: 'Database Query',
      icon: Database,
      color: 'purple',
      description: 'Structured data research',
      sources: ['SQL databases', 'APIs', 'Data warehouses'],
      capabilities: ['Structured queries', 'Data aggregation', 'Statistical analysis']
    },
    {
      id: 'documentation_search',
      name: 'Documentation',
      icon: FileText,
      color: 'orange',
      description: 'Technical documentation research',
      sources: ['GitHub', 'Stack Overflow', 'Dev docs'],
      capabilities: ['Code examples', 'API references', 'Best practices']
    },
    {
      id: 'code_analysis',
      name: 'Code Analysis',
      icon: Code,
      color: 'red',
      description: 'Code repository research',
      sources: ['GitHub', 'GitLab', 'Package registries'],
      capabilities: ['Code search', 'Dependency analysis', 'Usage patterns']
    },
    {
      id: 'visual_research',
      name: 'Visual Research',
      icon: Image,
      color: 'pink',
      description: 'Image and video analysis',
      sources: ['Image databases', 'Video platforms', 'Visual APIs'],
      capabilities: ['Image recognition', 'Content analysis', 'Visual trends']
    }
  ];

  // Mock research data for demonstration
  const mockResults: ResearchResult[] = [
    {
      id: '1',
      title: 'Advanced AI Integration Patterns in Modern Web Applications',
      snippet: 'This comprehensive study explores the latest patterns for integrating AI capabilities into web applications, including considerations for neurodivergent users...',
      source: 'academic',
      url: 'https://example.com/research/ai-integration',
      relevance: 95,
      type: 'academic',
      metadata: {
        author: 'Dr. Sarah Chen',
        date: '2024-01-15',
        domain: 'Computer Science',
        language: 'English',
        citations: 47
      }
    },
    {
      id: '2',
      title: 'Real-time Collaborative Workspaces: Implementation Guide',
      snippet: 'A detailed technical guide covering the implementation of real-time collaborative features in web applications, with focus on accessibility and performance...',
      source: 'web',
      url: 'https://example.com/guide/collaborative-workspaces',
      relevance: 88,
      type: 'documentation',
      metadata: {
        author: 'TechCorp Engineering',
        date: '2024-02-01',
        domain: 'engineering.techcorp.com',
        language: 'English'
      }
    },
    {
      id: '3',
      title: 'Neurodivergent-Friendly UI Design Principles',
      snippet: 'Essential design principles for creating user interfaces that are accessible and comfortable for neurodivergent users, including ADHD and autism considerations...',
      source: 'web',
      url: 'https://example.com/design/neurodivergent-ui',
      relevance: 92,
      type: 'article',
      metadata: {
        author: 'Alex Rivera',
        date: '2024-01-28',
        domain: 'uxdesign.cc',
        language: 'English'
      }
    }
  ];

  // Initialize mock data
  useEffect(() => {
    const mockQuery: ResearchQuery = {
      id: 'initial',
      query: 'AI-powered development environments for neurodivergent developers',
      source: 'web',
      status: 'completed',
      results: mockResults,
      timestamp: new Date().toLocaleString(),
      progress: 100
    };
    
    setSearchQueries([mockQuery]);
    setLiveSearches([mockQuery]);
  }, []);

  // Simulate live research updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSearches(prev => prev.map(query => ({
        ...query,
        results: query.results.map(result => ({
          ...result,
          relevance: Math.max(70, Math.min(100, result.relevance + (Math.random() - 0.5) * 5))
        }))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Perform research query
  const performResearch = async (query: string, source: string) => {
    const newQuery: ResearchQuery = {
      id: `query_${Date.now()}`,
      query,
      source: source as any,
      status: 'searching',
      results: [],
      timestamp: new Date().toLocaleString(),
      progress: 0
    };

    setSearchQueries(prev => [newQuery, ...prev]);
    setLiveSearches(prev => [newQuery, ...prev]);

    // Simulate search progress
    const progressInterval = setInterval(() => {
      setSearchQueries(prev => prev.map(q => 
        q.id === newQuery.id 
          ? { ...q, progress: Math.min(100, (q.progress || 0) + Math.random() * 20) }
          : q
      ));
    }, 500);

    // Simulate completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setSearchQueries(prev => prev.map(q => 
        q.id === newQuery.id 
          ? { 
              ...q, 
              status: 'completed', 
              progress: 100,
              results: mockResults.map((result, idx) => ({
                ...result,
                id: `${newQuery.id}_result_${idx}`,
                relevance: Math.random() * 30 + 70
              }))
            }
          : q
      ));
    }, 3000);

    setCurrentQuery('');
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      performResearch(currentQuery, selectedSource);
    }
  };

  // Get tool configuration
  const getToolConfig = (source: string) => {
    return researchTools.find(tool => tool.id.includes(source)) || researchTools[0];
  };

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'comfort' 
        ? 'bg-gradient-to-br from-purple-50 to-pink-50' 
        : theme === 'professional' 
          ? 'bg-gray-50' 
          : 'bg-gray-900'
    }`}>

      {/* Enhanced Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-md'
      }`}>
        
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            theme === 'comfort' 
              ? 'bg-gradient-to-br from-purple-400 to-blue-400' 
              : theme === 'professional'
                ? 'bg-purple-600'
                : 'bg-purple-600'
          }`}>
            <Microscope className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h1 className={`font-bold text-xl flex items-center gap-2 ${
              theme === 'custom' ? 'text-white' : 'text-gray-900'
            }`}>
              Deep Research Center
              <Brain className="w-5 h-5 text-purple-500" />
            </h1>
            <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
              Multi-source research & synthesis • {searchQueries.length} active queries
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFlowerExpanded(!flowerExpanded)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              theme === 'custom' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Layers size={16} />
            {flowerExpanded ? 'Collapse' : 'Expand'} Tools
          </button>
          
          <button
            onClick={() => setShowSideTickers(!showSideTickers)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              theme === 'custom' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <TrendingUp size={16} />
            {showSideTickers ? 'Hide' : 'Show'} Tickers
          </button>
        </div>
      </div>

      {/* Research Flower/Toolbox Layout */}
      {flowerExpanded && (
        <div className={`p-4 border-b ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-purple-50'}`}>
          <div 
            ref={flowerRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {researchTools.map((tool, index) => (
              <div
                key={tool.id}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedSource === tool.id.split('_')[0] 
                    ? `bg-${tool.color}-100 border-2 border-${tool.color}-300 shadow-lg`
                    : theme === 'custom' 
                      ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                      : 'bg-white hover:shadow-md border border-gray-200'
                }`}
                onClick={() => setSelectedSource(tool.id.split('_')[0] as any)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: flowerExpanded ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                }}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                    selectedSource === tool.id.split('_')[0]
                      ? `bg-${tool.color}-200`
                      : theme === 'custom' 
                        ? 'bg-gray-600' 
                        : 'bg-gray-100'
                  }`}>
                    <tool.icon className={`w-6 h-6 ${
                      selectedSource === tool.id.split('_')[0] 
                        ? `text-${tool.color}-600` 
                        : theme === 'custom' ? 'text-gray-300' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <h3 className={`font-semibold text-sm mb-1 ${
                    theme === 'custom' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {tool.name}
                  </h3>
                  
                  <p className={`text-xs ${
                    theme === 'custom' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {tool.description}
                  </p>
                  
                  {/* Capabilities indicators */}
                  <div className="mt-2 flex justify-center">
                    <div className="flex space-x-1">
                      {tool.capabilities.slice(0, 3).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            selectedSource === tool.id.split('_')[0] 
                              ? `bg-${tool.color}-400` 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Interface */}
      <div className={`p-4 border-b ${theme === 'custom' ? 'border-gray-700' : 'border-gray-200'}`}>
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                theme === 'custom' ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
              <input
                type="text"
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                placeholder={`Search with ${getToolConfig(selectedSource).name}...`}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  theme === 'custom' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <button
              type="submit"
              disabled={!currentQuery.trim()}
              className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                currentQuery.trim()
                  ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Search size={16} />
              Research
            </button>
          </div>
          
          {/* Source indicator */}
          <div className="mt-2 flex items-center justify-center">
            <span className={`text-sm px-3 py-1 rounded-full ${
              theme === 'custom' 
                ? `bg-${getToolConfig(selectedSource).color}-900 text-${getToolConfig(selectedSource).color}-300` 
                : `bg-${getToolConfig(selectedSource).color}-100 text-${getToolConfig(selectedSource).color}-700`
            }`}>
              {getToolConfig(selectedSource).name} • {getToolConfig(selectedSource).sources.join(', ')}
            </span>
          </div>
        </form>
      </div>

      {/* Three Preview Windows Layout */}
      <div className="flex-1 flex">
        {/* Side Tickers */}
        {showSideTickers && (
          <>
            {/* Left Ticker - Search 1 */}
            <div className={`w-64 border-r ${
              theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            } p-4 overflow-y-auto`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  Search Stream 1
                </h3>
                <button
                  onClick={() => setActivePreview('search1')}
                  className={`p-1 rounded ${
                    activePreview === 'search1' ? 'bg-purple-100 text-purple-600' : ''
                  }`}
                >
                  <Eye size={16} />
                </button>
              </div>
              
              {/* Live ticker content */}
              <div className="space-y-3">
                {liveSearches.slice(0, 5).map((query, index) => (
                  <div
                    key={query.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      theme === 'custom' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-white hover:shadow-sm border'
                    }`}
                    onClick={() => setActivePreview('search1')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        query.status === 'completed' ? 'bg-green-100 text-green-700' :
                        query.status === 'searching' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {query.status}
                      </span>
                      <span className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {query.results.length} results
                      </span>
                    </div>
                    
                    <p className={`text-sm font-medium mb-1 line-clamp-2 ${
                      theme === 'custom' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {query.query}
                    </p>
                    
                    <p className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {query.timestamp}
                    </p>
                    
                    {query.progress !== undefined && query.progress < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${query.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Ticker - Search 2 */}
            <div className={`w-64 border-l ${
              theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            } p-4 overflow-y-auto order-last`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  Search Stream 2
                </h3>
                <button
                  onClick={() => setActivePreview('search2')}
                  className={`p-1 rounded ${
                    activePreview === 'search2' ? 'bg-purple-100 text-purple-600' : ''
                  }`}
                >
                  <Eye size={16} />
                </button>
              </div>
              
              {/* Results preview */}
              <div className="space-y-3">
                {mockResults.map((result, index) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      theme === 'custom' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-white hover:shadow-sm border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.type === 'academic' ? 'bg-blue-100 text-blue-700' :
                        result.type === 'documentation' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {result.type}
                      </span>
                      <span className={`text-xs font-mono ${
                        result.relevance > 90 ? 'text-green-600' :
                        result.relevance > 75 ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {Math.round(result.relevance)}%
                      </span>
                    </div>
                    
                    <h4 className={`text-sm font-medium mb-1 line-clamp-2 ${
                      theme === 'custom' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {result.title}
                    </h4>
                    
                    <p className={`text-xs line-clamp-2 ${
                      theme === 'custom' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {result.snippet}
                    </p>
                    
                    <div className={`mt-2 text-xs ${theme === 'custom' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {result.metadata.author} • {result.metadata.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Master Search View */}
        <div className="flex-1 flex flex-col">
          {/* Master view header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            theme === 'custom' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <Target className={`w-5 h-5 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Master Research View
              </h3>
              <span className={`text-sm px-3 py-1 rounded-full ${
                theme === 'custom' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {searchQueries.length} queries • {searchQueries.reduce((acc, q) => acc + q.results.length, 0)} results
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className={`p-2 rounded-lg transition-colors ${
                theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Filter size={16} />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Download size={16} />
              </button>
              <button
                onClick={() => setPreviewExpanded(!previewExpanded)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Research results */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {searchQueries.map((query) => (
                <div
                  key={query.id}
                  className={`p-6 rounded-xl ${
                    theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-sm'
                  } border`}
                >
                  {/* Query header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          query.status === 'completed' ? 'bg-green-400' :
                          query.status === 'searching' ? 'bg-blue-400 animate-pulse' :
                          query.status === 'error' ? 'bg-red-400' :
                          'bg-gray-400'
                        }`} />
                        <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                          {query.query}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          theme === 'custom' 
                            ? `bg-${getToolConfig(query.source).color}-900 text-${getToolConfig(query.source).color}-300`
                            : `bg-${getToolConfig(query.source).color}-100 text-${getToolConfig(query.source).color}-700`
                        }`}>
                          {getToolConfig(query.source).name}
                        </span>
                        <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}>
                          {query.timestamp}
                        </span>
                        <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}>
                          {query.results.length} results
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className={`p-2 rounded-lg transition-colors ${
                        theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <Bookmark size={16} />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar for active searches */}
                  {query.status === 'searching' && query.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}>
                          Searching...
                        </span>
                        <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}>
                          {Math.round(query.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${query.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Results grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {query.results.map((result) => (
                      <div
                        key={result.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                          theme === 'custom' 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            result.type === 'academic' ? 'bg-blue-100 text-blue-700' :
                            result.type === 'documentation' ? 'bg-orange-100 text-orange-700' :
                            result.type === 'code' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {result.type}
                          </span>
                          <div className={`text-xs font-mono ${
                            result.relevance > 90 ? 'text-green-600' :
                            result.relevance > 75 ? 'text-yellow-600' :
                            'text-gray-500'
                          }`}>
                            {Math.round(result.relevance)}%
                          </div>
                        </div>
                        
                        <h4 className={`font-semibold mb-2 line-clamp-2 ${
                          theme === 'custom' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {result.title}
                        </h4>
                        
                        <p className={`text-sm mb-3 line-clamp-3 ${
                          theme === 'custom' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {result.snippet}
                        </p>
                        
                        <div className={`text-xs flex items-center justify-between ${
                          theme === 'custom' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <span>{result.metadata.author}</span>
                          <span>{result.metadata.date}</span>
                        </div>
                        
                        {result.metadata.citations && (
                          <div className={`text-xs mt-1 ${
                            theme === 'custom' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {result.metadata.citations} citations
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating synthesis panel */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className={`w-80 p-4 rounded-xl shadow-lg ${
          theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border'
        } border`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold flex items-center gap-2 ${
              theme === 'custom' ? 'text-white' : 'text-gray-900'
            }`}>
              <Brain className="w-4 h-4" />
              Research Synthesis
            </h4>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          
          <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
            AI-powered synthesis of your research findings will appear here as you gather more data.
          </p>
          
          <div className="mt-3 flex justify-between text-xs">
            <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}>
              {searchQueries.reduce((acc, q) => acc + q.results.length, 0)} sources analyzed
            </span>
            <button className="text-purple-500 hover:text-purple-600">
              Generate →
            </button>
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DeepResearchCenter;
