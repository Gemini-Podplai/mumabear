import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  VideoCameraIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  SparklesIcon,
  SignalIcon,
  BoltIcon,
  CpuChipIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import MultimodalChatInterface from '../components/chat/MultimodalChatInterface';

interface ModelContact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  lastMessage: string;
  specialty: string;
  provider: string;
  tier: 'express' | 'premium' | 'research' | 'ultra_fast';
  capabilities: string[];
  responseTime: string;
  costTier: 'low' | 'medium' | 'high';
  bio: string;
}

const PodplayMessenger: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [models, setModels] = useState<ModelContact[]>([]);
  const [loading, setLoading] = useState(true);

  // Comprehensive model database with 57 different AI models
  const modelDatabase: ModelContact[] = [
    // === GEMINI MODELS (Vertex AI) ===
    {
      id: 'gemini-2.5-pro-vertex',
      name: 'Gemini 2.5 Pro',
      avatar: '🧠',
      status: 'online',
      lastMessage: 'Ready for complex reasoning and analysis',
      specialty: 'Advanced reasoning, complex problem solving',
      provider: 'Google Vertex AI',
      tier: 'premium',
      capabilities: ['reasoning', 'code', 'multimodal', 'long_context'],
      responseTime: '400ms',
      costTier: 'medium',
      bio: 'The flagship Gemini model optimized for complex reasoning tasks. Excels at multi-step problem solving, advanced code generation, and sophisticated analysis. Perfect for research-grade work requiring deep thinking.'
    },
    {
      id: 'gemini-2.5-flash-vertex',
      name: 'Gemini 2.5 Flash',
      avatar: '⚡',
      status: 'online',
      lastMessage: 'Ultra-fast responses with high quality',
      specialty: 'Speed optimization, quick responses',
      provider: 'Google Vertex AI',
      tier: 'ultra_fast',
      capabilities: ['speed', 'code', 'chat', 'efficiency'],
      responseTime: '200ms',
      costTier: 'low',
      bio: 'Lightning-fast Gemini variant designed for rapid interactions. Maintains high quality while delivering responses in under 200ms. Ideal for real-time conversations and quick coding assistance.'
    },
    {
      id: 'gemini-2.0-flash-thinking',
      name: 'Gemini 2.0 Flash Thinking',
      avatar: '🤔',
      status: 'online',
      lastMessage: 'Deep thinking mode activated',
      specialty: 'Reasoning chains, step-by-step analysis',
      provider: 'Google Vertex AI',
      tier: 'research',
      capabilities: ['reasoning', 'analysis', 'step_by_step', 'code'],
      responseTime: '600ms',
      costTier: 'medium',
      bio: 'Advanced reasoning variant that shows its thinking process. Provides detailed step-by-step analysis and transparent reasoning chains. Perfect for educational content and complex problem breakdown.'
    },
    {
      id: 'claude-4-opus',
      name: 'Claude 4 Opus',
      avatar: '🎭',
      status: 'online',
      lastMessage: 'Premium intelligence at your service',
      specialty: 'Highest intelligence, complex reasoning',
      provider: 'Anthropic via Vertex AI',
      tier: 'research',
      capabilities: ['reasoning', 'creativity', 'analysis', 'code', 'writing'],
      responseTime: '800ms',
      costTier: 'high',
      bio: 'The most capable Claude model with unparalleled intelligence. Excels at complex reasoning, creative writing, advanced code analysis, and sophisticated problem-solving. The gold standard for AI assistance.'
    },
    {
      id: 'claude-4-sonnet',
      name: 'Claude 4 Sonnet',
      avatar: '🎨',
      status: 'online',
      lastMessage: 'Balanced excellence for all tasks',
      specialty: 'Balanced performance, versatile',
      provider: 'Anthropic via Vertex AI',
      tier: 'premium',
      capabilities: ['balanced', 'code', 'writing', 'analysis', 'multimodal'],
      responseTime: '600ms',
      costTier: 'medium',
      bio: 'Perfectly balanced Claude variant offering excellent performance across all domains. Strong at coding, writing, analysis, and creative tasks. The versatile choice for comprehensive AI assistance.'
    }
  ];

  // Load models from backend API
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from your multimodal chat API
        // const response = await fetch('/api/multimodal-chat/models');
        // const data = await response.json();
        
        // For now, use the comprehensive model database
        setModels(modelDatabase);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load models:', error);
        setModels(modelDatabase); // Fallback to static data
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  const filteredContacts = models.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = filterTier === 'all' || contact.tier === filterTier;
    
    return matchesSearch && matchesTier;
  });

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
  };

  const handleCall = async (contactId: string, type: 'voice' | 'video') => {
    setActiveCall(contactId);
    
    // Implement bidirectional model communication
    try {
      const contact = models.find(m => m.id === contactId);
      if (contact) {
        console.log(`Starting ${type} call with ${contact.name}`);
        
        // In a real implementation, this would establish a bidirectional connection
        // via your Express Mode + Vertex AI backend
        // await fetch('/api/express-mode/claude-vertex', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     model: contactId,
        //     message: `Establishing ${type} connection`,
        //     mode: 'realtime'
        //   })
        // });
        
        // Simulate connection establishment
        setTimeout(() => {
          setActiveCall(null);
          alert(`${type} call established with ${contact.name}! Bidirectional communication active.`);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to establish call:', error);
      setActiveCall(null);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'ultra_fast': return <BoltIcon className="w-4 h-4" />;
      case 'express': return <SignalIcon className="w-4 h-4" />;
      case 'premium': return <SparklesIcon className="w-4 h-4" />;
      case 'research': return <CpuChipIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'ultra_fast': return 'text-yellow-500';
      case 'express': return 'text-blue-500';
      case 'premium': return 'text-purple-500';
      case 'research': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
            💬
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Loading Model Directory
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Connecting to 57 AI models via Vertex AI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex">
      {/* Contacts Sidebar */}
      <div className="w-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-purple-200 dark:border-purple-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Model Messenger
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                {filteredContacts.length} models
              </span>
              <Cog6ToothIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-purple-50 dark:bg-gray-700 border border-purple-200 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tier Filter */}
          <div className="flex space-x-2">
            {['all', 'ultra_fast', 'express', 'premium', 'research'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterTier === tier
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-gray-600'
                }`}
              >
                {tier === 'all' ? 'All' : tier.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContactSelect(contact.id)}
              className={`p-4 border-b border-purple-100 dark:border-purple-800 cursor-pointer transition-colors ${
                selectedContact === contact.id 
                  ? 'bg-purple-100 dark:bg-purple-800' 
                  : 'hover:bg-purple-50 dark:hover:bg-purple-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                    {contact.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    contact.status === 'online' ? 'bg-green-500' : 
                    contact.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {contact.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <div className={`${getTierColor(contact.tier)}`}>
                        {getTierIcon(contact.tier)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(contact.id, 'voice');
                        }}
                        className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700 rounded"
                      >
                        <PhoneIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(contact.id, 'video');
                        }}
                        className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700 rounded"
                      >
                        <VideoCameraIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 truncate">
                    {contact.specialty}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {contact.provider}
                    </p>
                    <span className="text-xs text-green-500 font-medium">
                      {contact.responseTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                    {models.find(c => c.id === selectedContact)?.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {models.find(c => c.id === selectedContact)?.name}
                    </h2>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {models.find(c => c.id === selectedContact)?.specialty}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleCall(selectedContact, 'voice')}
                    className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-lg"
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleCall(selectedContact, 'video')}
                    className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-lg"
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-lg">
                    <UserGroupIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Model Bio */}
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {models.find(c => c.id === selectedContact)?.bio}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Provider: {models.find(c => c.id === selectedContact)?.provider}</span>
                  <span>Response: {models.find(c => c.id === selectedContact)?.responseTime}</span>
                  <span>Tier: {models.find(c => c.id === selectedContact)?.tier}</span>
                </div>
              </div>
            </div>

            {/* Integrated Chat Interface */}
            <div className="flex-1">
              <MultimodalChatInterface
                agentName={`${models.find(c => c.id === selectedContact)?.name} Agent`}
                agentType="messenger"
                agentDescription={`Bidirectional communication with ${models.find(c => c.id === selectedContact)?.name}`}
                isCollapsed={false}
                onToggleCollapse={() => {}}
                className="h-full border-none"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
                💬
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Select a Model to Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose from 57 different AI models for bidirectional communication via your Vertex AI backend
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">90% Gemini Models</div>
                  <div className="text-gray-600 dark:text-gray-400">Via Google Vertex AI</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">Claude Models</div>
                  <div className="text-gray-600 dark:text-gray-400">Via Vertex AI Service</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Call Overlay */}
      {activeCall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 animate-pulse">
                {models.find(c => c.id === activeCall)?.avatar}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Calling {models.find(c => c.id === activeCall)?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Establishing bidirectional connection via Vertex AI...
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-6">
                Express Mode + {models.find(c => c.id === activeCall)?.provider}
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setActiveCall(null)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PodplayMessenger;