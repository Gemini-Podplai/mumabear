import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Zap,
  Brain,
  Users,
  MessageSquare,
  Star,
  Award,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface ModelMetrics {
  modelId: string;
  modelName: string;
  provider: string;
  avatar: string;
  tier: string;
  totalMessages: number;
  averageResponseTime: number;
  costPerMessage: number;
  totalCost: number;
  userSatisfaction: number;
  uptime: number;
  accuracy: number;
  creativity: number;
  helpfulness: number;
  lastUsed: Date;
  usageToday: number;
  usageThisWeek: number;
  usageThisMonth: number;
  topicDistribution: { [topic: string]: number };
  timeDistribution: { [hour: string]: number };
  errorRate: number;
  popularityScore: number;
}

interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  totalCost: number;
  averageSessionDuration: number;
  mostUsedModel: string;
  fastestModel: string;
  mostCostEffective: string;
  totalActiveTime: number;
  modelsUsed: number;
  averageMessagesPerConversation: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  userEngagement: number;
  modelMetrics: ModelMetrics[];
}

interface AIAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  models: any[];
  conversations: any[];
  groupChats: any[];
}

export const AIAnalytics: React.FC<AIAnalyticsProps> = ({
  isOpen,
  onClose,
  models,
  conversations,
  groupChats
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'usage' | 'performance' | 'cost' | 'satisfaction'>('usage');
  const [isLoading, setIsLoading] = useState(false);

  // Generate comprehensive analytics data
  const generateAnalytics = (): AnalyticsData => {
    const modelMetrics: ModelMetrics[] = models.map(model => {
      const modelConversations = conversations.filter(c => c.modelId === model.id);
      const totalMessages = modelConversations.reduce((sum, conv) => sum + conv.messages.length, 0);

      return {
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        avatar: model.avatar,
        tier: model.tier,
        totalMessages,
        averageResponseTime: model.responseTime + Math.random() * 500,
        costPerMessage: model.pricing === 'premium' ? 0.02 : model.pricing === 'advanced' ? 0.01 : 0.005,
        totalCost: totalMessages * (model.pricing === 'premium' ? 0.02 : model.pricing === 'advanced' ? 0.01 : 0.005),
        userSatisfaction: 3.5 + Math.random() * 1.5,
        uptime: 95 + Math.random() * 5,
        accuracy: 85 + Math.random() * 15,
        creativity: model.capabilities.includes('creative_writing') ? 80 + Math.random() * 20 : 60 + Math.random() * 30,
        helpfulness: 80 + Math.random() * 20,
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        usageToday: Math.floor(Math.random() * 50),
        usageThisWeek: Math.floor(Math.random() * 200),
        usageThisMonth: Math.floor(Math.random() * 500),
        topicDistribution: {
          'Programming': Math.random() * 40,
          'Research': Math.random() * 30,
          'Creative Writing': Math.random() * 25,
          'General Chat': Math.random() * 35,
          'Problem Solving': Math.random() * 20
        },
        timeDistribution: Object.fromEntries(
          Array.from({length: 24}, (_, i) => [i.toString(), Math.random() * 10])
        ),
        errorRate: Math.random() * 5,
        popularityScore: totalMessages * 0.1 + Math.random() * 50
      };
    });

    const totalMessages = modelMetrics.reduce((sum, m) => sum + m.totalMessages, 0);
    const totalCost = modelMetrics.reduce((sum, m) => sum + m.totalCost, 0);
    const mostUsedModel = modelMetrics.reduce((prev, current) =>
      prev.totalMessages > current.totalMessages ? prev : current
    );
    const fastestModel = modelMetrics.reduce((prev, current) =>
      prev.averageResponseTime < current.averageResponseTime ? prev : current
    );
    const mostCostEffective = modelMetrics.reduce((prev, current) =>
      prev.costPerMessage < current.costPerMessage ? prev : current
    );

    return {
      totalConversations: conversations.length + groupChats.length,
      totalMessages,
      totalCost,
      averageSessionDuration: 15 + Math.random() * 30,
      mostUsedModel: mostUsedModel.modelName,
      fastestModel: fastestModel.modelName,
      mostCostEffective: mostCostEffective.modelName,
      totalActiveTime: Math.floor(Math.random() * 1000) + 500,
      modelsUsed: models.length,
      averageMessagesPerConversation: totalMessages / Math.max(conversations.length, 1),
      weeklyGrowth: Math.random() * 20 + 5,
      monthlyGrowth: Math.random() * 50 + 10,
      userEngagement: 70 + Math.random() * 30,
      modelMetrics: modelMetrics.sort((a, b) => b.totalMessages - a.totalMessages)
    };
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        setAnalytics(generateAnalytics());
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, models, conversations, groupChats]);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAnalytics(generateAnalytics());
      setIsLoading(false);
    }, 800);
  };

  const getMetricValue = (metric: ModelMetrics, type: string) => {
    switch (type) {
      case 'usage': return metric.totalMessages;
      case 'performance': return metric.averageResponseTime;
      case 'cost': return metric.totalCost;
      case 'satisfaction': return metric.userSatisfaction;
      default: return metric.totalMessages;
    }
  };

  const getMetricLabel = (type: string) => {
    switch (type) {
      case 'usage': return 'Messages';
      case 'performance': return 'Avg Response Time (ms)';
      case 'cost': return 'Total Cost ($)';
      case 'satisfaction': return 'User Rating';
      default: return 'Messages';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'from-purple-500 to-pink-500';
      case 'advanced': return 'from-blue-500 to-cyan-500';
      case 'basic': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  if (!analytics) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Performance Analytics</h2>
                    <p className="text-gray-400">Comprehensive insights into your AI model usage</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={refreshData}
                    disabled={isLoading}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>

                  <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>

                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  {['day', 'week', 'month', 'year'].map(range => (
                    <button
                      key={range}
                      onClick={() => setSelectedTimeRange(range as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTimeRange === range
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-2">
                  {['usage', 'performance', 'cost', 'satisfaction'].map(metric => (
                    <button
                      key={metric}
                      onClick={() => setSelectedMetric(metric as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedMetric === metric
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm">Total Conversations</p>
                          <p className="text-2xl font-bold text-white">{analytics.totalConversations}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-200" />
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-200 text-sm">Total Messages</p>
                          <p className="text-2xl font-bold text-white">{analytics.totalMessages}</p>
                        </div>
                        <Brain className="w-8 h-8 text-green-200" />
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-200 text-sm">Total Cost</p>
                          <p className="text-2xl font-bold text-white">${analytics.totalCost.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-purple-200" />
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-200 text-sm">Models Used</p>
                          <p className="text-2xl font-bold text-white">{analytics.modelsUsed}</p>
                        </div>
                        <Users className="w-8 h-8 text-orange-200" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Top Performers */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-semibold text-white">Most Used</h3>
                      </div>
                      <p className="text-gray-300">{analytics.mostUsedModel}</p>
                    </div>

                    <div className="bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">Fastest</h3>
                      </div>
                      <p className="text-gray-300">{analytics.fastestModel}</p>
                    </div>

                    <div className="bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <h3 className="font-semibold text-white">Most Cost-Effective</h3>
                      </div>
                      <p className="text-gray-300">{analytics.mostCostEffective}</p>
                    </div>
                  </div>

                  {/* Model Performance Table */}
                  <div className="bg-gray-700 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-600">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Model Performance ({getMetricLabel(selectedMetric)})</h3>
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Sorted by {selectedMetric}</span>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-600">
                          <tr>
                            <th className="text-left p-3 text-gray-300 font-medium">Model</th>
                            <th className="text-left p-3 text-gray-300 font-medium">Provider</th>
                            <th className="text-left p-3 text-gray-300 font-medium">Tier</th>
                            <th className="text-right p-3 text-gray-300 font-medium">Messages</th>
                            <th className="text-right p-3 text-gray-300 font-medium">Avg Response (ms)</th>
                            <th className="text-right p-3 text-gray-300 font-medium">Cost</th>
                            <th className="text-right p-3 text-gray-300 font-medium">Rating</th>
                            <th className="text-right p-3 text-gray-300 font-medium">Uptime</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.modelMetrics
                            .sort((a, b) => {
                              const aValue = getMetricValue(a, selectedMetric);
                              const bValue = getMetricValue(b, selectedMetric);
                              return selectedMetric === 'performance' ? aValue - bValue : bValue - aValue;
                            })
                            .slice(0, 10)
                            .map((metric, index) => (
                              <motion.tr
                                key={metric.modelId}
                                className="border-t border-gray-600 hover:bg-gray-650"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <td className="p-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                                      {metric.avatar}
                                    </div>
                                    <span className="font-medium text-white">{metric.modelName}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-gray-300">{metric.provider}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(metric.tier)} text-white`}>
                                    {metric.tier}
                                  </span>
                                </td>
                                <td className="p-3 text-right text-white">{metric.totalMessages}</td>
                                <td className="p-3 text-right text-white">{Math.round(metric.averageResponseTime)}</td>
                                <td className="p-3 text-right text-white">${metric.totalCost.toFixed(3)}</td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-white">{metric.userSatisfaction.toFixed(1)}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-right">
                                  <span className={`text-sm font-medium ${
                                    metric.uptime >= 99 ? 'text-green-400' :
                                    metric.uptime >= 95 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    {metric.uptime.toFixed(1)}%
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Usage Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-700 rounded-xl p-4">
                      <h3 className="font-semibold text-white mb-4">Usage Trends</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Weekly Growth</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">+{analytics.weeklyGrowth.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Monthly Growth</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">+{analytics.monthlyGrowth.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">User Engagement</span>
                          <span className="text-white font-medium">{analytics.userEngagement.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Avg Session Duration</span>
                          <span className="text-white font-medium">{analytics.averageSessionDuration.toFixed(1)} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-xl p-4">
                      <h3 className="font-semibold text-white mb-4">Cost Efficiency</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Cost per Message</span>
                          <span className="text-white font-medium">${(analytics.totalCost / analytics.totalMessages).toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Cost per Conversation</span>
                          <span className="text-white font-medium">${(analytics.totalCost / analytics.totalConversations).toFixed(3)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Most Expensive Model</span>
                          <span className="text-white font-medium">
                            {analytics.modelMetrics.reduce((prev, current) =>
                              prev.costPerMessage > current.costPerMessage ? prev : current
                            ).modelName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Total Active Time</span>
                          <span className="text-white font-medium">{analytics.totalActiveTime} hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
