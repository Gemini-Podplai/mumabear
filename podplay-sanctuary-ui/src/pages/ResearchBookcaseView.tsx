import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  StarIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BeakerIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import MultimodalChatInterface from '../components/chat/MultimodalChatInterface';

const ResearchBookcaseView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatCollapsed, setChatCollapsed] = useState(false);

  const categories = [
    { id: 'all', name: 'All Research', count: 247 },
    { id: 'ai-ml', name: 'AI & Machine Learning', count: 89 },
    { id: 'web-dev', name: 'Web Development', count: 67 },
    { id: 'data-science', name: 'Data Science', count: 45 },
    { id: 'cybersecurity', name: 'Cybersecurity', count: 28 },
    { id: 'blockchain', name: 'Blockchain', count: 18 }
  ];

  const researchItems = [
    {
      id: 1,
      title: "Advanced Neural Network Architectures for Natural Language Processing",
      author: "Dr. Sarah Chen",
      category: "ai-ml",
      rating: 4.8,
      tags: ["NLP", "Transformers", "BERT", "GPT"],
      lastUpdated: "2 days ago",
      summary: "Comprehensive analysis of modern transformer architectures and their applications in NLP tasks.",
      type: "paper"
    },
    {
      id: 2,
      title: "React 18 Concurrent Features: A Deep Dive",
      author: "Alex Rodriguez",
      category: "web-dev",
      rating: 4.6,
      tags: ["React", "Concurrent", "Suspense", "Performance"],
      lastUpdated: "1 week ago",
      summary: "Exploring React 18's concurrent features and their impact on application performance.",
      type: "article"
    },
    {
      id: 3,
      title: "Zero-Knowledge Proofs in Blockchain Applications",
      author: "Prof. Michael Zhang",
      category: "blockchain",
      rating: 4.9,
      tags: ["ZK-Proofs", "Privacy", "Ethereum", "Cryptography"],
      lastUpdated: "3 days ago",
      summary: "Implementation strategies for zero-knowledge proofs in decentralized applications.",
      type: "research"
    },
    {
      id: 4,
      title: "Advanced Data Visualization Techniques with D3.js",
      author: "Emma Thompson",
      category: "data-science",
      rating: 4.5,
      tags: ["D3.js", "Visualization", "Interactive", "Charts"],
      lastUpdated: "5 days ago",
      summary: "Creating interactive and responsive data visualizations using D3.js library.",
      type: "tutorial"
    },
    {
      id: 5,
      title: "Modern Cybersecurity Threat Detection Using AI",
      author: "Dr. James Wilson",
      category: "cybersecurity",
      rating: 4.7,
      tags: ["AI Security", "Threat Detection", "Machine Learning", "Anomaly"],
      lastUpdated: "1 day ago",
      summary: "Leveraging artificial intelligence for real-time cybersecurity threat detection.",
      type: "paper"
    },
    {
      id: 6,
      title: "Microservices Architecture Best Practices",
      author: "Lisa Park",
      category: "web-dev",
      rating: 4.4,
      tags: ["Microservices", "Architecture", "Docker", "Kubernetes"],
      lastUpdated: "4 days ago",
      summary: "Design patterns and best practices for building scalable microservices.",
      type: "guide"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'paper': return AcademicCapIcon;
      case 'research': return BeakerIcon;
      case 'tutorial': return BookOpenIcon;
      case 'guide': return DocumentTextIcon;
      default: return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'paper': return 'text-blue-400 bg-blue-400/20';
      case 'research': return 'text-purple-400 bg-purple-400/20';
      case 'tutorial': return 'text-green-400 bg-green-400/20';
      case 'guide': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredResearch = researchItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${chatCollapsed ? 'mr-0' : 'mr-96'}`}>
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2"
          >
            Research Bookcase
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Curated knowledge base and research documentation
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search research, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Category Filter */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id} className="bg-gray-800">
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResearch.map((item, index) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{item.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{item.summary}</p>

                {/* Author and Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{item.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{item.lastUpdated}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.slice(0, 4).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 4 && (
                    <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded">
                      +{item.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                    Read
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                    Save
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Research Tools */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Research Tools</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 p-3 rounded-lg transition-colors">
              <BeakerIcon className="w-5 h-5" />
              <span className="text-sm font-medium">AI Research</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 p-3 rounded-lg transition-colors">
              <ChartBarIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Analytics</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 p-3 rounded-lg transition-colors">
              <DocumentTextIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Citations</span>
            </button>
            <button className="flex items-center space-x-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 p-3 rounded-lg transition-colors">
              <TagIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Tag Manager</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Research Agent Chat Interface */}
      <div className={`fixed right-0 top-16 bottom-0 w-96 transition-all duration-300 ${chatCollapsed ? 'translate-x-full' : 'translate-x-0'}`}>
        <MultimodalChatInterface
          agentName="Research Agent"
          agentType="research"
          agentDescription="Knowledge Base & Research Specialist"
          isCollapsed={chatCollapsed}
          onToggleCollapse={() => setChatCollapsed(!chatCollapsed)}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default ResearchBookcaseView;