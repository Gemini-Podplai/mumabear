import { motion } from 'framer-motion';
import { Activity, GitMerge, Users, Zap } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

interface CollaborationMetrics {
  participantCount: number;
  activeCollaborations: number;
  responseTimeMs: number; // Express Mode response time
  codeExecutions: number;
  realTimeSync: {
    cursorUpdates: number;
    stateUpdates: number;
  };
  expressMode: {
    speedImprovement: number;
    agenticAssistance: number;
  };
}

interface VisualizationProps {
  metrics: CollaborationMetrics;
  className?: string;
}

export const CollaborationInsights: React.FC<VisualizationProps> = ({
  metrics,
  className = ''
}) => {
  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    return {
      syncRate: (metrics.realTimeSync.cursorUpdates + metrics.realTimeSync.stateUpdates) / 2,
      efficiencyScore: Math.min((metrics.expressMode.speedImprovement / 6) * 100, 100),
      collaborationScore: Math.min((metrics.activeCollaborations / metrics.participantCount) * 100, 100)
    };
  }, [metrics]);

  // Generate visualization data
  const heatMapData = useCallback(() => {
    // This would generate data for a collaboration activity heat map
    return Array(24).fill(0).map((_, hour) => ({
      hour,
      intensity: Math.random() * 100 // Mock data - replace with real activity data
    }));
  }, []);

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Users size={20} />
            <span className="font-medium">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {metrics.participantCount}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
            <Activity size={20} />
            <span className="font-medium">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {metrics.responseTimeMs}ms
          </div>
        </div>

        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
            <GitMerge size={20} />
            <span className="font-medium">Collaborations</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {metrics.activeCollaborations}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
            <Zap size={20} />
            <span className="font-medium">Express Mode</span>
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {metrics.expressMode.speedImprovement}x
          </div>
        </div>
      </div>

      {/* Activity Heat Map */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Collaboration Activity
        </h3>
        <div className="flex gap-1 h-24">
          {heatMapData().map((data, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="flex-1 bg-blue-100 dark:bg-blue-900/20 rounded-t"
              style={{
                height: `${data.intensity}%`,
                backgroundColor: `rgba(59, 130, 246, ${data.intensity / 100})`
              }}
            />
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sync Rate</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {derivedMetrics.syncRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${derivedMetrics.syncRate}%` }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Express Mode Efficiency</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {derivedMetrics.efficiencyScore.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${derivedMetrics.efficiencyScore}%` }}
              className="h-full bg-green-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Collaboration Score</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {derivedMetrics.collaborationScore.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${derivedMetrics.collaborationScore}%` }}
              className="h-full bg-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
