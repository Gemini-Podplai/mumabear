import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';

interface AIModel {
  id: string;
  name: string;
  fullName: string;
  provider: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing' | 'busy';
  lastSeen?: Date;
  personality: string;
  capabilities: string[];
  color: string;
  description: string;
  pricing: 'free' | 'premium' | 'enterprise';
  responseTime: number;
  contextWindow: number;
  languages: string[];
  tier: 'basic' | 'advanced' | 'premium' | 'enterprise';
  specialty: string;
  bio: string;
  isMultimodal: boolean;
  isExpress: boolean;
}

interface ModelSelectorModalProps {
  models: AIModel[];
  onSelect: (model: AIModel) => void;
  onClose: () => void;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  models,
  onSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'provider' | 'tier' | 'responseTime'>('name');
  const [showFilters, setShowFilters] = useState(false);

  const providers = useMemo(() => {
    const providerList = Array.from(new Set(models.map(m => m.provider)));
    return [
      { id: 'all', name: 'All Providers', count: models.length },
      ...providerList.map(provider => ({
        id: provider,
        name: provider,
        count: models.filter(m => m.provider === provider).length
      }))
    ];
  }, [models]);

  const tiers = [
    { id: 'all', name: 'All Tiers', count: models.length },
    { id: 'basic', name: 'Basic', count: models.filter(m => m.tier === 'basic').length },
    { id: 'advanced', name: 'Advanced', count: models.filter(m => m.tier === 'advanced').length },
    { id: 'premium', name: 'Premium', count: models.filter(m => m.tier === 'premium').length },
    { id: 'enterprise', name: 'Enterprise', count: models.filter(m => m.tier === 'enterprise').length }
  ];

  const pricingOptions = [
    { id: 'all', name: 'All Pricing', count: models.length },
    { id: 'free', name: 'Free', count: models.filter(m => m.pricing === 'free').length },
    { id: 'premium', name: 'Premium', count: models.filter(m => m.pricing === 'premium').length },
    { id: 'enterprise', name: 'Enterprise', count: models.filter(m => m.pricing === 'enterprise').length }
  ];

  const filteredAndSortedModels = useMemo(() => {
    let filtered = models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
      const matchesTier = selectedTier === 'all' || model.tier === selectedTier;
      const matchesPricing = selectedPricing === 'all' || model.pricing === selectedPricing;

      return matchesSearch && matchesProvider && matchesTier && matchesPricing;
    });

    // Sort models
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'provider':
          return a.provider.localeCompare(b.provider);
        case 'tier':
          const tierOrder = { basic: 0, advanced: 1, premium: 2, enterprise: 3 };
          return tierOrder[a.tier] - tierOrder[b.tier];
        case 'responseTime':
          return a.responseTime - b.responseTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [models, searchQuery, selectedProvider, selectedTier, selectedPricing, sortBy]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="relative bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Choose Your AI Model
              </h2>
              <p className="text-gray-400 mt-1">Select from 57+ AI models for your conversation</p>
            </div>
            <motion.button
              className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search models by name, capability, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-4 h-4 absolute left-3 top-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="provider">Sort by Provider</option>
              <option value="tier">Sort by Tier</option>
              <option value="responseTime">Sort by Speed</option>
            </select>

            {/* Filter Toggle */}
            <motion.button
              className={`px-4 py-3 rounded-lg font-medium ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {filteredAndSortedModels.length !== models.length && `(${filteredAndSortedModels.length})`}
            </motion.button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-4 p-4 bg-gray-800 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Provider Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {providers.map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name} ({provider.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tier Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {tiers.map(tier => (
                        <option key={tier.id} value={tier.id}>
                          {tier.name} ({tier.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Pricing</label>
                    <select
                      value={selectedPricing}
                      onChange={(e) => setSelectedPricing(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {pricingOptions.map(pricing => (
                        <option key={pricing.id} value={pricing.id}>
                          {pricing.name} ({pricing.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Models Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredAndSortedModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredAndSortedModels.map(model => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onSelect={() => onSelect(model)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-400 text-lg">No models found</p>
              <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

interface ModelCardProps {
  model: AIModel;
  onSelect: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'typing': return 'bg-blue-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-gray-600';
      case 'advanced': return 'bg-blue-600';
      case 'premium': return 'bg-purple-600';
      case 'enterprise': return 'bg-gold-600';
      default: return 'bg-gray-600';
    }
  };

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free': return { text: 'Free', color: 'bg-green-600' };
      case 'premium': return { text: 'Premium', color: 'bg-blue-600' };
      case 'enterprise': return { text: 'Enterprise', color: 'bg-purple-600' };
      default: return { text: 'Unknown', color: 'bg-gray-600' };
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  const pricingBadge = getPricingBadge(model.pricing);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg"
              style={{ backgroundColor: model.color }}
            >
              {model.avatar || model.name.slice(0, 2).toUpperCase()}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(model.status)}`} />
            {model.isExpress && (
              <div className="absolute -top-1 -right-1 text-yellow-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-lg">{model.name}</h3>
            <p className="text-sm text-gray-400">{model.provider}</p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${pricingBadge.color}`}>
            {pricingBadge.text}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTierColor(model.tier)}`}>
            {model.tier}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
        {model.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="bg-gray-700 rounded p-2">
          <div className="text-gray-400">Response Time</div>
          <div className="text-white font-medium">{formatResponseTime(model.responseTime)}</div>
        </div>
        <div className="bg-gray-700 rounded p-2">
          <div className="text-gray-400">Context</div>
          <div className="text-white font-medium">{formatContextWindow(model.contextWindow)}</div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {model.capabilities.slice(0, 4).map(capability => (
            <span
              key={capability}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
            >
              {capability.replace(/_/g, ' ')}
            </span>
          ))}
          {model.capabilities.length > 4 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
              +{model.capabilities.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {model.isMultimodal && (
            <span className="flex items-center space-x-1 text-purple-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span>Multimodal</span>
            </span>
          )}
          {model.isExpress && (
            <span className="flex items-center space-x-1 text-yellow-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Express</span>
            </span>
          )}
        </div>

        <span className={`text-${model.status === 'online' ? 'green' : 'gray'}-400`}>
          {model.status === 'online' ? 'Online' :
            model.lastSeen ? `Last seen ${model.lastSeen.toLocaleTimeString()}` : 'Offline'}
        </span>
      </div>
    </motion.div>
  );
};

export default ModelSelectorModal;
