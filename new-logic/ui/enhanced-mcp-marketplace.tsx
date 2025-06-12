import React, { useState, useEffect, useRef } from 'react';
import {
  Package, Download, Star, Github, Search, Filter, Grid,
  List, Heart, Share2, Eye, CheckCircle, AlertCircle,
  Clock, TrendingUp, Zap, Shield, Award, Code, Users,
  GitBranch, Tag, ExternalLink, Play, Pause, Settings,
  RefreshCw, Plus, X, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';

interface MCPPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  tags: string[];
  rating: number;
  downloads: number;
  stars: number;
  forks: number;
  issues: number;
  lastUpdated: string;
  repository: string;
  documentation: string;
  license: string;
  status: 'available' | 'installed' | 'updating' | 'error';
  dependencies: string[];
  capabilities: string[];
  screenshots: string[];
  size: number;
  verified: boolean;
  featured: boolean;
}

interface InstallationProgress {
  packageId: string;
  stage: 'downloading' | 'installing' | 'configuring' | 'testing' | 'complete' | 'error';
  progress: number;
  message: string;
  startTime: string;
}

const EnhancedMCPMarketplace = ({ theme }) => {
  // Core state
  const [packages, setPackages] = useState<MCPPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<MCPPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MCPPackage | null>(null);
  const [installations, setInstallations] = useState<InstallationProgress[]>([]);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating' | 'name'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Categories
  const categories = [
    { id: 'all', name: 'All Packages', count: 0 },
    { id: 'ai-models', name: 'AI Models', count: 0 },
    { id: 'integrations', name: 'Integrations', count: 0 },
    { id: 'tools', name: 'Developer Tools', count: 0 },
    { id: 'data', name: 'Data Processing', count: 0 },
    { id: 'ui', name: 'UI Components', count: 0 },
    { id: 'automation', name: 'Automation', count: 0 }
  ];

  // Initialize mock packages
  useEffect(() => {
    const mockPackages: MCPPackage[] = [
      {
        id: 'gemini-2-flash-thinking',
        name: 'Gemini 2.0 Flash Thinking',
        description: 'Advanced reasoning capabilities with step-by-step thinking for complex problem solving',
        version: '2.0.1',
        author: 'Google AI',
        category: 'ai-models',
        tags: ['AI', 'Reasoning', 'Thinking', 'Google', 'Gemini'],
        rating: 4.9,
        downloads: 15420,
        stars: 2341,
        forks: 187,
        issues: 12,
        lastUpdated: '2025-06-10',
        repository: 'https://github.com/google/gemini-2-flash-thinking',
        documentation: 'https://docs.google.com/gemini-2-flash-thinking',
        license: 'Apache 2.0',
        status: 'available',
        dependencies: ['@google/vertex-ai', '@google/auth'],
        capabilities: ['Text Generation', 'Step-by-step Reasoning', 'Problem Solving', 'Multi-modal Input'],
        screenshots: [],
        size: 245,
        verified: true,
        featured: true
      },
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        description: 'Anthropic\'s most capable model for complex reasoning, coding, and creative tasks',
        version: '3.5.2',
        author: 'Anthropic',
        category: 'ai-models',
        tags: ['AI', 'Claude', 'Reasoning', 'Coding', 'Anthropic'],
        rating: 4.8,
        downloads: 12876,
        stars: 1987,
        forks: 156,
        issues: 8,
        lastUpdated: '2025-06-08',
        repository: 'https://github.com/anthropic/claude-3-5-sonnet',
        documentation: 'https://docs.anthropic.com/claude/docs',
        license: 'Custom License',
        status: 'installed',
        dependencies: ['@anthropic/sdk'],
        capabilities: ['Text Generation', 'Code Analysis', 'Creative Writing', 'Computer Use'],
        screenshots: [],
        size: 198,
        verified: true,
        featured: true
      },
      {
        id: 'express-mode-vertex',
        name: 'Express Mode Vertex Integration',
        description: 'Streamlined integration with Google Vertex AI for rapid model deployment and scaling',
        version: '1.3.0',
        author: 'Podplay Team',
        category: 'integrations',
        tags: ['Vertex AI', 'Google Cloud', 'Integration', 'Express Mode'],
        rating: 4.7,
        downloads: 8934,
        stars: 1456,
        forks: 234,
        issues: 15,
        lastUpdated: '2025-06-12',
        repository: 'https://github.com/podplay/express-mode-vertex',
        documentation: 'https://docs.podplay.com/express-mode-vertex',
        license: 'MIT',
        status: 'available',
        dependencies: ['@google-cloud/vertex-ai', '@google-cloud/auth'],
        capabilities: ['Model Deployment', 'Auto Scaling', 'Express Configuration', 'Monitoring'],
        screenshots: [],
        size: 156,
        verified: true,
        featured: false
      },
      {
        id: 'scrapybara-enhanced',
        name: 'Scrapybara Enhanced Web Scraper',
        description: 'Advanced web scraping capabilities with AI-powered content extraction and analysis',
        version: '2.1.4',
        author: 'Scrapybara Labs',
        category: 'tools',
        tags: ['Web Scraping', 'Data Extraction', 'AI Analysis', 'Browser Automation'],
        rating: 4.6,
        downloads: 7234,
        stars: 892,
        forks: 145,
        issues: 23,
        lastUpdated: '2025-06-09',
        repository: 'https://github.com/scrapybara/enhanced-scraper',
        documentation: 'https://docs.scrapybara.com/enhanced',
        license: 'BSD 3-Clause',
        status: 'available',
        dependencies: ['selenium', 'beautifulsoup4', 'requests'],
        capabilities: ['Smart Extraction', 'Content Analysis', 'Rate Limiting', 'Proxy Support'],
        screenshots: [],
        size: 89,
        verified: true,
        featured: false
      },
      {
        id: 'neurodivergent-ui-kit',
        name: 'Neurodivergent-Friendly UI Kit',
        description: 'Comprehensive UI components designed specifically for neurodivergent users with ADHD and autism considerations',
        version: '1.2.0',
        author: 'Inclusive Design Collective',
        category: 'ui',
        tags: ['UI', 'Accessibility', 'Neurodivergent', 'ADHD', 'Autism', 'Inclusive Design'],
        rating: 4.9,
        downloads: 5678,
        stars: 743,
        forks: 89,
        issues: 7,
        lastUpdated: '2025-06-11',
        repository: 'https://github.com/inclusive-design/neurodivergent-ui-kit',
        documentation: 'https://neurodivergent-ui.com/docs',
        license: 'MIT',
        status: 'available',
        dependencies: ['react', 'styled-components', 'framer-motion'],
        capabilities: ['Sensory-Friendly Themes', 'Reduced Motion', 'Clear Navigation', 'Focus Management'],
        screenshots: [],
        size: 67,
        verified: true,
        featured: true
      },
      {
        id: 'mama-bear-memory',
        name: 'Mama Bear Memory System',
        description: 'Advanced memory management system with Mem0 integration for persistent AI conversations',
        version: '3.0.1',
        author: 'Podplay Team',
        category: 'ai-models',
        tags: ['Memory', 'Mem0', 'Persistence', 'AI Conversations', 'Context'],
        rating: 4.8,
        downloads: 4523,
        stars: 567,
        forks: 78,
        issues: 5,
        lastUpdated: '2025-06-12',
        repository: 'https://github.com/podplay/mama-bear-memory',
        documentation: 'https://docs.podplay.com/mama-bear-memory',
        license: 'Apache 2.0',
        status: 'installed',
        dependencies: ['mem0ai', 'chromadb', 'sentence-transformers'],
        capabilities: ['Long-term Memory', 'Context Preservation', 'User Preferences', 'Conversation History'],
        screenshots: [],
        size: 234,
        verified: true,
        featured: false
      }
    ];

    setPackages(mockPackages);
    setFilteredPackages(mockPackages);
  }, []);

  // Filter and search packages
  useEffect(() => {
    let filtered = packages;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query) ||
        pkg.tags.some(tag => tag.toLowerCase().includes(query)) ||
        pkg.author.toLowerCase().includes(query)
      );
    }

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredPackages(filtered);
  }, [packages, selectedCategory, searchQuery, sortBy]);

  // One-click installation
  const installPackage = async (pkg: MCPPackage) => {
    const installation: InstallationProgress = {
      packageId: pkg.id,
      stage: 'downloading',
      progress: 0,
      message: `Downloading ${pkg.name}...`,
      startTime: new Date().toLocaleTimeString()
    };

    setInstallations(prev => [installation, ...prev]);
    setShowInstallModal(true);

    const stages = [
      { stage: 'downloading' as const, message: `Downloading ${pkg.name}...`, duration: 2000 },
      { stage: 'installing' as const, message: 'Installing dependencies...', duration: 3000 },
      { stage: 'configuring' as const, message: 'Configuring package...', duration: 1500 },
      { stage: 'testing' as const, message: 'Running integration tests...', duration: 2500 },
      { stage: 'complete' as const, message: 'Installation complete!', duration: 500 }
    ];

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      
      setInstallations(prev => prev.map(inst =>
        inst.packageId === pkg.id
          ? { ...inst, stage: stage.stage, message: stage.message, progress: 0 }
          : inst
      ));

      // Progress simulation
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, stage.duration / 10));
        setInstallations(prev => prev.map(inst =>
          inst.packageId === pkg.id
            ? { ...inst, progress }
            : inst
        ));
      }
    }

    // Update package status
    setPackages(prev => prev.map(p =>
      p.id === pkg.id ? { ...p, status: 'installed' } : p
    ));

    // Auto-close modal after success
    setTimeout(() => {
      setShowInstallModal(false);
    }, 2000);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'installed': return 'text-green-600 bg-green-100';
      case 'updating': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai-models': return 'text-purple-600 bg-purple-100';
      case 'integrations': return 'text-blue-600 bg-blue-100';
      case 'tools': return 'text-green-600 bg-green-100';
      case 'data': return 'text-orange-600 bg-orange-100';
      case 'ui': return 'text-pink-600 bg-pink-100';
      case 'automation': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'comfort' 
        ? 'bg-gradient-to-br from-purple-50 to-pink-50' 
        : theme === 'professional' 
          ? 'bg-gray-50' 
          : 'bg-gray-900'
    }`}>

      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-md'
      }`}>
        
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            theme === 'comfort' 
              ? 'bg-gradient-to-br from-pink-400 to-purple-400' 
              : theme === 'professional'
                ? 'bg-pink-600'
                : 'bg-pink-600'
          }`}>
            <Package className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h1 className={`font-bold text-xl flex items-center gap-2 ${
              theme === 'custom' ? 'text-white' : 'text-gray-900'
            }`}>
              MCP Marketplace
              <Github className="w-5 h-5 text-pink-500" />
            </h1>
            <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
              GitHub Integration & One-Click Installation • {packages.length} packages available
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              theme === 'custom' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              theme === 'custom' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-4 border-b ${theme === 'custom' ? 'border-gray-700' : 'border-gray-200'}`}>
        
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              theme === 'custom' ? 'text-gray-400' : 'text-gray-500'
            }`} size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages, tools, integrations..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                theme === 'custom' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center justify-between">
            
            {/* Categories */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                Category:
              </span>
              <div className="flex space-x-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-pink-100 text-pink-700'
                        : theme === 'custom'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort options */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-1 rounded-lg border text-sm ${
                  theme === 'custom'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Updated</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        
        {/* Package List */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* Featured packages */}
          {selectedCategory === 'all' && (
            <div className="mb-8">
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                theme === 'custom' ? 'text-white' : 'text-gray-900'
              }`}>
                <Star className="w-5 h-5 text-yellow-500" />
                Featured Packages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {packages.filter(pkg => pkg.featured).map(pkg => (
                  <div
                    key={pkg.id}
                    className={`p-6 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                      theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-sm'
                    } border ring-2 ring-yellow-200`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(pkg.category)}`}>
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                            {pkg.name}
                          </h3>
                          <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                            by {pkg.author}
                          </p>
                        </div>
                      </div>
                      
                      {pkg.verified && (
                        <Shield className="w-5 h-5 text-blue-500" title="Verified Package" />
                      )}
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {pkg.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{pkg.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4 text-gray-400" />
                          <span>{pkg.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Github className="w-4 h-4 text-gray-400" />
                          <span>{pkg.stars}</span>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                        {pkg.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {pkg.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-full ${
                              theme === 'custom' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (pkg.status === 'available') {
                            installPackage(pkg);
                          }
                        }}
                        disabled={pkg.status !== 'available'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pkg.status === 'available'
                            ? 'bg-pink-600 text-white hover:bg-pink-700'
                            : pkg.status === 'installed'
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {pkg.status === 'available' ? 'Install' :
                         pkg.status === 'installed' ? 'Installed' :
                         pkg.status === 'updating' ? 'Updating...' :
                         'Error'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All packages */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
              {selectedCategory === 'all' ? 'All Packages' : categories.find(c => c.id === selectedCategory)?.name}
              <span className={`ml-2 text-sm font-normal ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                ({filteredPackages.length} results)
              </span>
            </h2>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`p-6 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                      theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-sm'
                    } border`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(pkg.category)}`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                            {pkg.name}
                          </h3>
                          <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                            v{pkg.version}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {pkg.verified && (
                          <Shield className="w-4 h-4 text-blue-500" />
                        )}
                        {pkg.featured && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-3 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {pkg.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{pkg.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3 text-gray-400" />
                          <span>{(pkg.downloads / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(pkg.category)}`}>
                        {pkg.category.replace('-', ' ')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pkg.status === 'available') {
                          installPackage(pkg);
                        }
                      }}
                      disabled={pkg.status !== 'available'}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        pkg.status === 'available'
                          ? 'bg-pink-600 text-white hover:bg-pink-700'
                          : pkg.status === 'installed'
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {pkg.status === 'available' ? 'Install Package' :
                       pkg.status === 'installed' ? 'Installed ✓' :
                       pkg.status === 'updating' ? 'Updating...' :
                       'Installation Error'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      theme === 'custom' ? 'bg-gray-800 border-gray-700' : 'bg-white border shadow-sm'
                    } border hover:shadow-md`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(pkg.category)}`}>
                          <Package className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`font-semibold text-lg ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                              {pkg.name}
                            </h3>
                            <span className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                              v{pkg.version}
                            </span>
                            <div className="flex items-center space-x-1">
                              {pkg.verified && <Shield className="w-4 h-4 text-blue-500" />}
                              {pkg.featured && <Star className="w-4 h-4 text-yellow-500" />}
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-3 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {pkg.description}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm">
                            <span className={`${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                              by {pkg.author}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{pkg.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="w-4 h-4 text-gray-400" />
                              <span>{pkg.downloads.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Github className="w-4 h-4 text-gray-400" />
                              <span>{pkg.stars}</span>
                            </div>
                            <span className={`${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Updated {pkg.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
                          {pkg.status}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (pkg.status === 'available') {
                              installPackage(pkg);
                            }
                          }}
                          disabled={pkg.status !== 'available'}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pkg.status === 'available'
                              ? 'bg-pink-600 text-white hover:bg-pink-700'
                              : pkg.status === 'installed'
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {pkg.status === 'available' ? 'Install' :
                           pkg.status === 'installed' ? 'Installed' :
                           'Error'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Package Detail Panel */}
        {selectedPackage && (
          <div className={`w-96 border-l ${
            theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          } p-6 overflow-y-auto`}>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Package Details
              </h3>
              <button
                onClick={() => setSelectedPackage(null)}
                className={`p-1 rounded ${theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X size={16} />
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(selectedPackage.category)}`}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPackage.name}
                  </h4>
                  <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    v{selectedPackage.version} by {selectedPackage.author}
                  </p>
                </div>
              </div>
              
              <p className={`text-sm mb-4 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedPackage.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className={`block ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Rating
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{selectedPackage.rating}</span>
                  </div>
                </div>
                <div>
                  <span className={`block ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Downloads
                  </span>
                  <span className="font-medium">{selectedPackage.downloads.toLocaleString()}</span>
                </div>
                <div>
                  <span className={`block ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Size
                  </span>
                  <span className="font-medium">{selectedPackage.size} MB</span>
                </div>
                <div>
                  <span className={`block ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    License
                  </span>
                  <span className="font-medium">{selectedPackage.license}</span>
                </div>
              </div>

              <button
                onClick={() => installPackage(selectedPackage)}
                disabled={selectedPackage.status !== 'available'}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedPackage.status === 'available'
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : selectedPackage.status === 'installed'
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedPackage.status === 'available' ? '🚀 One-Click Install' :
                 selectedPackage.status === 'installed' ? '✅ Installed' :
                 selectedPackage.status === 'updating' ? '⏳ Updating...' :
                 '❌ Installation Error'}
              </button>
            </div>

            {/* GitHub Integration */}
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
            }`}>
              <h5 className={`font-medium mb-3 flex items-center gap-2 ${
                theme === 'custom' ? 'text-white' : 'text-gray-900'
              }`}>
                <Github className="w-4 h-4" />
                GitHub Repository
              </h5>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}>
                    Stars
                  </span>
                  <span>{selectedPackage.stars}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}>
                    Forks
                  </span>
                  <span>{selectedPackage.forks}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}>
                    Issues
                  </span>
                  <span>{selectedPackage.issues}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}>
                    Last Updated
                  </span>
                  <span>{selectedPackage.lastUpdated}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 py-2 px-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2">
                  <Github size={14} />
                  View Repo
                </button>
                <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
                  <ExternalLink size={14} />
                  Docs
                </button>
              </div>
            </div>

            {/* Capabilities */}
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
            }`}>
              <h5 className={`font-medium mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Capabilities
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedPackage.capabilities.map((capability, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs rounded-full ${
                      theme === 'custom' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            {/* Dependencies */}
            <div className={`p-4 rounded-lg ${
              theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
            }`}>
              <h5 className={`font-medium mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Dependencies
              </h5>
              <div className="space-y-2">
                {selectedPackage.dependencies.map((dep, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      theme === 'custom' ? 'bg-gray-600' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm font-mono ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {dep}
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Installation Modal */}
      {showInstallModal && installations.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-lg mx-4 p-6 rounded-2xl ${
            theme === 'custom' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Package Installation
              </h3>
              {installations[0].stage === 'complete' && (
                <button
                  onClick={() => setShowInstallModal(false)}
                  className={`p-2 rounded-lg ${theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {installations.slice(0, 3).map(installation => {
              const pkg = packages.find(p => p.id === installation.packageId);
              return (
                <div
                  key={installation.packageId}
                  className={`p-4 rounded-lg mb-4 ${
                    theme === 'custom' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {pkg?.name}
                      </h4>
                      <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {installation.message}
                      </p>
                    </div>
                    
                    {installation.stage === 'complete' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : installation.stage === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>

                  {installation.stage !== 'complete' && installation.stage !== 'error' && (
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${installation.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}>
                          {installation.stage}
                        </span>
                        <span className={theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}>
                          {installation.progress}%
                        </span>
                      </div>
                    </div>
                  )}

                  {installation.stage === 'complete' && (
                    <div className={`text-sm ${theme === 'custom' ? 'text-green-400' : 'text-green-600'}`}>
                      ✅ Package installed successfully! Ready to use.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CSS for line clamping */}
      <style jsx>{`
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

export default EnhancedMCPMarketplace;
