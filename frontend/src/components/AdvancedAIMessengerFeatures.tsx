// 🚀 Advanced AI Messenger Features
// Enhanced capabilities for the world's first AI instant messenger

import React, { useState, useCallback, useEffect } from 'react';
import { MessageSquare, Settings, Star, Bookmark, TrendingUp, Activity, Users, Bot } from 'lucide-react';

interface ModelPerformanceMetrics {
  modelId: string;
  averageResponseTime: number;
  successRate: number;
  totalMessages: number;
  userRating: number;
  lastUsed: Date;
  tokens_used: number;
  cost_total: number;
}

interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  favoriteModels: string[];
  totalTokensUsed: number;
  totalCostSpent: number;
  averageSessionTime: number;
}

// Advanced Analytics Dashboard Component
export const AIMessengerAnalytics = ({ conversations, models }) => {
  const [stats, setStats] = useState<ConversationStats>({
    totalConversations: 0,
    totalMessages: 0,
    favoriteModels: [],
    totalTokensUsed: 0,
    totalCostSpent: 0,
    averageSessionTime: 0
  });

  const [modelMetrics, setModelMetrics] = useState<ModelPerformanceMetrics[]>([]);

  useEffect(() => {
    calculateStats();
  }, [conversations]);

  const calculateStats = useCallback(() => {
    if (!conversations || conversations.length === 0) return;

    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    const modelUsage = {};
    let totalTokens = 0;
    let totalCost = 0;

    conversations.forEach(conv => {
      const modelId = conv.modelId;
      if (!modelUsage[modelId]) {
        modelUsage[modelId] = 0;
      }
      modelUsage[modelId] += conv.messages.length;

      // Estimate tokens and cost
      conv.messages.forEach(msg => {
        const estimatedTokens = Math.ceil(msg.text.length / 4);
        totalTokens += estimatedTokens;

        const model = models[modelId];
        if (model && model.price) {
          const pricePerToken = parseFloat(model.price.replace(/[$,]/g, '').split('/')[0]) / 1000;
          totalCost += estimatedTokens * pricePerToken;
        }
      });
    });

    const favoriteModels = Object.entries(modelUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([modelId]) => modelId);

    setStats({
      totalConversations: conversations.length,
      totalMessages,
      favoriteModels,
      totalTokensUsed: totalTokens,
      totalCostSpent: totalCost,
      averageSessionTime: totalMessages > 0 ? conversations.length * 5 : 0 // Estimate 5min per conversation
    });
  }, [conversations, models]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">📊 AI Messenger Analytics</h3>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <MessageSquare className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.totalConversations}</div>
          <div className="text-sm text-gray-400">Conversations</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <Activity className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
          <div className="text-sm text-gray-400">Messages</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{Math.round(stats.totalTokensUsed / 1000)}K</div>
          <div className="text-sm text-gray-400">Tokens Used</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">${stats.totalCostSpent.toFixed(4)}</div>
          <div className="text-sm text-gray-400">Total Cost</div>
        </div>
      </div>

      {/* Favorite Models */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Most Used AI Models
        </h4>
        <div className="space-y-2">
          {stats.favoriteModels.map((modelId, index) => {
            const model = models[modelId];
            if (!model) return null;
            return (
              <div key={modelId} className="flex items-center space-x-3">
                <span className="text-lg">{model.avatar}</span>
                <span className="flex-1 text-gray-300">{model.name}</span>
                <span className="text-sm text-gray-400">#{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Model Comparison Tool
export const ModelComparison = ({ models, onSelectModel }) => {
  const [selectedModels, setSelectedModels] = useState([]);
  const [comparisonMetrics, setComparisonMetrics] = useState([]);

  const addModelToComparison = (modelId) => {
    if (selectedModels.length < 4 && !selectedModels.includes(modelId)) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const removeModelFromComparison = (modelId) => {
    setSelectedModels(selectedModels.filter(id => id !== modelId));
  };

  const compareModels = () => {
    const metrics = ['responseTime', 'price', 'maxTokens', 'capabilities'];
    const comparison = selectedModels.map(modelId => {
      const model = models[modelId];
      return {
        ...model,
        id: modelId,
        responseTimeMs: parseInt(model.responseTime),
        pricePerToken: parseFloat(model.price.replace(/[$,]/g, '').split('/')[0]) / 1000,
        capabilityCount: model.capabilities.length
      };
    });
    setComparisonMetrics(comparison);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">⚖️ Model Comparison Tool</h3>

      {/* Model Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedModels.map(modelId => {
            const model = models[modelId];
            return (
              <div key={modelId} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <span className="mr-1">{model.avatar}</span>
                <span className="mr-2">{model.name}</span>
                <button
                  onClick={() => removeModelFromComparison(modelId)}
                  className="text-blue-200 hover:text-white"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {selectedModels.length < 4 && (
          <div className="text-sm text-gray-400 mb-2">
            Select up to 4 models to compare ({selectedModels.length}/4 selected)
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {comparisonMetrics.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2 text-gray-300">Model</th>
                <th className="text-left p-2 text-gray-300">Speed</th>
                <th className="text-left p-2 text-gray-300">Cost</th>
                <th className="text-left p-2 text-gray-300">Context</th>
                <th className="text-left p-2 text-gray-300">Features</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map(model => (
                <tr key={model.id} className="border-b border-gray-700">
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{model.avatar}</span>
                      <span className="text-white">{model.name}</span>
                    </div>
                  </td>
                  <td className="p-2 text-green-400">{model.responseTime}</td>
                  <td className="p-2 text-yellow-400">{model.price}</td>
                  <td className="p-2 text-blue-400">{model.maxTokens}</td>
                  <td className="p-2 text-purple-400">{model.capabilityCount} features</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={compareModels}
        disabled={selectedModels.length < 2}
        className="mt-4 px-4 py-2 bg-blue-600 disabled:bg-gray-600 text-white rounded-lg"
      >
        Compare Selected Models
      </button>
    </div>
  );
};

// Smart Model Recommendations
export const SmartRecommendations = ({ userPreferences, models, conversationHistory }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    generateRecommendations();
  }, [userPreferences, conversationHistory]);

  const generateRecommendations = () => {
    // Analyze user preferences and conversation patterns
    const recommendations = [];

    // Speed preference analysis
    if (userPreferences.prefersFastResponse) {
      const expressModels = Object.entries(models)
        .filter(([_, model]) => model.tier === 'express')
        .slice(0, 3);

      recommendations.push({
        type: 'speed',
        title: '⚡ For Lightning-Fast Responses',
        models: expressModels,
        reason: 'Based on your preference for quick responses'
      });
    }

    // Task-based recommendations
    const recentTopics = extractTopicsFromHistory(conversationHistory);
    if (recentTopics.includes('code')) {
      recommendations.push({
        type: 'coding',
        title: '💻 Perfect for Coding Tasks',
        models: [['code-llama-34b', models['code-llama-34b']]],
        reason: 'You\'ve been working on coding projects'
      });
    }

    if (recentTopics.includes('creative') || recentTopics.includes('image')) {
      const creativeModels = Object.entries(models)
        .filter(([_, model]) => model.tier === 'creative')
        .slice(0, 2);

      recommendations.push({
        type: 'creative',
        title: '🎨 For Creative Projects',
        models: creativeModels,
        reason: 'Based on your creative work patterns'
      });
    }

    setRecommendations(recommendations);
  };

  const extractTopicsFromHistory = (history) => {
    // Simple topic extraction based on keywords
    const text = history.map(conv =>
      conv.messages.map(msg => msg.text).join(' ')
    ).join(' ').toLowerCase();

    const topics = [];
    if (text.includes('code') || text.includes('programming')) topics.push('code');
    if (text.includes('image') || text.includes('picture')) topics.push('image');
    if (text.includes('creative') || text.includes('art')) topics.push('creative');

    return topics;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Bot className="h-6 w-6 mr-2" />
        Smart Recommendations
      </h3>

      {recommendations.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Start chatting with AI models to get personalized recommendations!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">{rec.title}</h4>
              <p className="text-sm text-gray-400 mb-3">{rec.reason}</p>
              <div className="space-y-2">
                {rec.models.map(([modelId, model]) => (
                  <div
                    key={modelId}
                    className="flex items-center justify-between p-2 bg-gray-600 rounded cursor-pointer hover:bg-gray-500"
                    onClick={() => onSelectModel(model)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{model.avatar}</span>
                      <div>
                        <div className="text-white font-medium">{model.name}</div>
                        <div className="text-sm text-gray-300">{model.specialty}</div>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300">
                      Try Now →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ModelPerformanceMetrics, ConversationStats };
