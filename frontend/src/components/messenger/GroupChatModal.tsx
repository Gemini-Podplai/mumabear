import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Crown } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  fullName: string;
  provider: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing' | 'busy';
  color: string;
  tier: 'basic' | 'advanced' | 'premium' | 'enterprise';
  specialty: string;
}

interface GroupChatModalProps {
  models: AIModel[];
  onCreateGroup: (groupData: GroupChatData) => void;
  onClose: () => void;
}

interface GroupChatData {
  name: string;
  description: string;
  participants: string[];
  isPrivate: boolean;
  maxParticipants: number;
  groupType: 'collaboration' | 'research' | 'creative' | 'coding' | 'general';
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({
  models,
  onCreateGroup,
  onClose
}) => {
  const [step, setStep] = useState<'basic' | 'participants' | 'settings'>('basic');
  const [groupData, setGroupData] = useState<GroupChatData>({
    name: '',
    description: '',
    participants: [],
    isPrivate: false,
    maxParticipants: 10,
    groupType: 'general'
  });

  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const groupTypes = [
    {
      id: 'collaboration',
      name: 'Collaboration Hub',
      description: 'Work together with AI models on projects',
      icon: '🤝',
      color: 'from-blue-500 to-cyan-500',
      recommendedModels: ['gpt-4o', 'claude-3-5-sonnet', 'gemini-pro']
    },
    {
      id: 'research',
      name: 'Research Team',
      description: 'Deep research and analysis with specialized models',
      icon: '🔬',
      color: 'from-purple-500 to-pink-500',
      recommendedModels: ['claude-3-5-sonnet', 'gpt-4o', 'perplexity-70b']
    },
    {
      id: 'creative',
      name: 'Creative Studio',
      description: 'Brainstorming and creative work with artistic AI',
      icon: '🎨',
      color: 'from-orange-500 to-red-500',
      recommendedModels: ['dall-e-3', 'midjourney-v6', 'claude-3-5-sonnet']
    },
    {
      id: 'coding',
      name: 'Code Squad',
      description: 'Programming and development with coding experts',
      icon: '💻',
      color: 'from-green-500 to-emerald-500',
      recommendedModels: ['gpt-4o', 'claude-3-5-sonnet', 'codellama-70b']
    },
    {
      id: 'general',
      name: 'General Chat',
      description: 'Open discussions with any combination of models',
      icon: '💬',
      color: 'from-gray-500 to-slate-500',
      recommendedModels: []
    }
  ];

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModelSelection = (modelId: string) => {
    const newSelected = new Set(selectedModels);
    if (newSelected.has(modelId)) {
      newSelected.delete(modelId);
    } else if (newSelected.size < groupData.maxParticipants) {
      newSelected.add(modelId);
    }
    setSelectedModels(newSelected);
    setGroupData(prev => ({
      ...prev,
      participants: Array.from(newSelected)
    }));
  };

  const applyRecommendedModels = (recommendedIds: string[]) => {
    const availableRecommended = recommendedIds.filter(id =>
      models.find(m => m.id === id)
    );
    const newSelected = new Set(availableRecommended.slice(0, groupData.maxParticipants));
    setSelectedModels(newSelected);
    setGroupData(prev => ({
      ...prev,
      participants: Array.from(newSelected)
    }));
  };

  const handleCreateGroup = () => {
    if (groupData.name && selectedModels.size > 0) {
      onCreateGroup(groupData);
      onClose();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'basic':
        return groupData.name.length >= 3 && groupData.description.length >= 10;
      case 'participants':
        return selectedModels.size >= 2;
      case 'settings':
        return true;
      default:
        return false;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Group Chat</h2>
              <p className="text-gray-400">
                {step === 'basic' && 'Set up your group basics'}
                {step === 'participants' && 'Choose AI models to invite'}
                {step === 'settings' && 'Configure group settings'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-750">
          <div className="flex items-center justify-between">
            {['basic', 'participants', 'settings'].map((stepName, index) => (
              <React.Fragment key={stepName}>
                <div className={`flex items-center space-x-2 ${
                  step === stepName ? 'text-blue-400' :
                  ['basic', 'participants', 'settings'].indexOf(step) > index ? 'text-green-400' : 'text-gray-500'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === stepName ? 'border-blue-400 bg-blue-400/20' :
                    ['basic', 'participants', 'settings'].indexOf(step) > index ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
                  }`}>
                    {['basic', 'participants', 'settings'].indexOf(step) > index ? '✓' : index + 1}
                  </div>
                  <span className="capitalize font-medium">{stepName}</span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    ['basic', 'participants', 'settings'].indexOf(step) > index ? 'bg-green-400' : 'bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <AnimatePresence mode="wait">
            {step === 'basic' && (
              <motion.div
                key="basic"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6"
              >
                {/* Group Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Group Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupTypes.map(type => (
                      <motion.button
                        key={type.id}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          groupData.groupType === type.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setGroupData(prev => ({ ...prev, groupType: type.id as any }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-semibold text-white">{type.name}</span>
                        </div>
                        <p className="text-sm text-gray-400">{type.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={groupData.name}
                    onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter group name..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">{groupData.name.length}/50 characters</p>
                </div>

                {/* Group Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={groupData.description}
                    onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the purpose of this group..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">{groupData.description.length}/200 characters</p>
                </div>
              </motion.div>
            )}

            {step === 'participants' && (
              <motion.div
                key="participants"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6"
              >
                {/* Recommended Models */}
                {groupTypes.find(t => t.id === groupData.groupType)?.recommendedModels && 
                 groupTypes.find(t => t.id === groupData.groupType)!.recommendedModels.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-300">
                        Recommended for {groupTypes.find(t => t.id === groupData.groupType)?.name}
                      </label>
                      <button
                        onClick={() => applyRecommendedModels(
                          groupTypes.find(t => t.id === groupData.groupType)?.recommendedModels || []
                        )}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Add All Recommended
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupTypes.find(t => t.id === groupData.groupType)?.recommendedModels
                        .map(id => models.find(m => m.id === id))
                        .filter(Boolean)
                        .map(model => (
                          <div
                            key={model!.id}
                            className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                          >
                            <span className="text-xl">{model!.avatar}</span>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-white">{model!.name}</span>
                              <p className="text-xs text-gray-400">{model!.provider}</p>
                            </div>
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Search AI Models
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, provider, or specialty..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Selected Count */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Selected: {selectedModels.size}/{groupData.maxParticipants} models
                  </span>
                  {selectedModels.size >= groupData.maxParticipants && (
                    <span className="text-orange-400">Maximum reached</span>
                  )}
                </div>

                {/* Model Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredModels.map(model => {
                    const isSelected = selectedModels.has(model.id);
                    const isRecommended = groupTypes
                      .find(t => t.id === groupData.groupType)?.recommendedModels
                      .includes(model.id);

                    return (
                      <motion.div
                        key={model.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        } ${selectedModels.size >= groupData.maxParticipants && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => toggleModelSelection(model.id)}
                        whileHover={{ scale: selectedModels.size >= groupData.maxParticipants && !isSelected ? 1 : 1.02 }}
                        whileTap={{ scale: selectedModels.size >= groupData.maxParticipants && !isSelected ? 1 : 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{model.avatar}</span>
                            <div>
                              <span className="font-semibold text-white">{model.name}</span>
                              <p className="text-xs text-gray-400">{model.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {isRecommended && <Crown className="w-4 h-4 text-yellow-400" />}
                            {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{model.specialty}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            model.tier === 'premium' ? 'bg-purple-500/20 text-purple-300' :
                            model.tier === 'advanced' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {model.tier}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            model.status === 'online' ? 'bg-green-500' :
                            model.status === 'busy' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 'settings' && (
              <motion.div
                key="settings"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6"
              >
                {/* Privacy Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Privacy Settings
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={groupData.isPrivate}
                        onChange={(e) => setGroupData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-white font-medium">Private Group</span>
                        <p className="text-xs text-gray-400">Only invited members can join</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Participants: {groupData.maxParticipants}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={groupData.maxParticipants}
                    onChange={(e) => setGroupData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Group Summary */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Group Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{groupData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">
                        {groupTypes.find(t => t.id === groupData.groupType)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participants:</span>
                      <span className="text-white">{selectedModels.size} AI models</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Privacy:</span>
                      <span className="text-white">{groupData.isPrivate ? 'Private' : 'Open'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={() => {
              if (step === 'basic') {
                onClose();
              } else if (step === 'participants') {
                setStep('basic');
              } else if (step === 'settings') {
                setStep('participants');
              }
            }}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            {step === 'basic' ? 'Cancel' : 'Back'}
          </button>

          <div className="flex space-x-3">
            {step !== 'settings' && (
              <button
                onClick={() => {
                  if (step === 'basic') setStep('participants');
                  else if (step === 'participants') setStep('settings');
                }}
                disabled={!canProceed()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            )}
            {step === 'settings' && (
              <button
                onClick={handleCreateGroup}
                disabled={!canProceed()}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Group
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
