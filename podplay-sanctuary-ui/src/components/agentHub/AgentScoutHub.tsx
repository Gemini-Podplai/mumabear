import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon,
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  CodeBracketIcon,
  BeakerIcon,
  RocketLaunchIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress: number;
  model?: string;
  agents?: string[];
}

interface ScoutWorkflow {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  currentStage: number;
  stages: WorkflowStage[];
  startTime?: Date;
  endTime?: Date;
}

const AgentScoutHub: React.FC = () => {
  const [workflows, setWorkflows] = useState<ScoutWorkflow[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<ScoutWorkflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Initialize with default workflow stages based on your backend
  const defaultStages: WorkflowStage[] = [
    {
      id: 'planning',
      name: 'Planning & Analysis',
      description: 'Collaborative agents analyze requirements and create development plan',
      icon: LightBulbIcon,
      color: 'from-purple-500 to-blue-500',
      status: 'pending',
      progress: 0,
      agents: ['Planning Specialist', 'Requirements Analyst', 'Architecture Designer']
    },
    {
      id: 'environment',
      name: 'Environment Setup',
      description: 'Configure development environment and dependencies',
      icon: CogIcon,
      color: 'from-blue-500 to-cyan-500',
      status: 'pending',
      progress: 0,
      model: 'gemini-1.5-pro',
      agents: ['Environment Specialist', 'DevOps Agent']
    },
    {
      id: 'coding',
      name: 'Code Generation',
      description: 'Intelligent code generation with collaborative review',
      icon: CodeBracketIcon,
      color: 'from-green-500 to-teal-500',
      status: 'pending',
      progress: 0,
      model: 'gemini-1.5-flash',
      agents: ['Code Generator', 'Code Reviewer', 'Quality Assurance']
    },
    {
      id: 'testing',
      name: 'Testing & Validation',
      description: 'Comprehensive testing and validation workflows',
      icon: BeakerIcon,
      color: 'from-orange-500 to-red-500',
      status: 'pending',
      progress: 0,
      model: 'gemini-1.5-pro',
      agents: ['Test Engineer', 'Validation Specialist']
    },
    {
      id: 'deployment',
      name: 'Deployment & Launch',
      description: 'Deploy and monitor application launch',
      icon: RocketLaunchIcon,
      color: 'from-pink-500 to-purple-500',
      status: 'pending',
      progress: 0,
      model: 'gemini-1.5-flash',
      agents: ['Deployment Specialist', 'Monitoring Agent']
    }
  ];

  useEffect(() => {
    // Listen for workflow updates from backend
    socket.on('scout_workflow_update', (data) => {
      setWorkflows(prev => 
        prev.map(w => w.id === data.workflow_id ? { ...w, ...data } : w)
      );
      
      if (activeWorkflow?.id === data.workflow_id) {
        setActiveWorkflow(prev => prev ? { ...prev, ...data } : null);
      }
    });

    socket.on('scout_stage_update', (data) => {
      setWorkflows(prev => 
        prev.map(w => {
          if (w.id === data.workflow_id) {
            const updatedStages = w.stages.map(stage => 
              stage.id === data.stage_id ? { ...stage, ...data.stage_data } : stage
            );
            return { ...w, stages: updatedStages, currentStage: data.current_stage };
          }
          return w;
        })
      );
    });

    return () => {
      socket.off('scout_workflow_update');
      socket.off('scout_stage_update');
    };
  }, [activeWorkflow]);

  const createNewWorkflow = () => {
    setIsCreating(true);
    
    const newWorkflow: ScoutWorkflow = {
      id: `workflow_${Date.now()}`,
      name: `Scout Workflow ${workflows.length + 1}`,
      status: 'idle',
      currentStage: 0,
      stages: [...defaultStages]
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setActiveWorkflow(newWorkflow);
    setIsCreating(false);
  };

  const startWorkflow = (workflow: ScoutWorkflow) => {
    const updatedWorkflow = {
      ...workflow,
      status: 'running' as const,
      startTime: new Date(),
      stages: workflow.stages.map((stage, index) => ({
        ...stage,
        status: index === 0 ? 'active' as const : 'pending' as const
      }))
    };

    setWorkflows(prev => 
      prev.map(w => w.id === workflow.id ? updatedWorkflow : w)
    );
    setActiveWorkflow(updatedWorkflow);

    // Send to backend
    socket.emit('scout_workflow_start', {
      workflow_id: workflow.id,
      workflow_name: workflow.name,
      stages: workflow.stages.map(s => s.id)
    });
  };

  const stopWorkflow = (workflow: ScoutWorkflow) => {
    const updatedWorkflow = {
      ...workflow,
      status: 'idle' as const,
      stages: workflow.stages.map(stage => ({
        ...stage,
        status: 'pending' as const,
        progress: 0
      }))
    };

    setWorkflows(prev => 
      prev.map(w => w.id === workflow.id ? updatedWorkflow : w)
    );

    socket.emit('scout_workflow_stop', { workflow_id: workflow.id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Agent Scout Command
              </h1>
              <p className="text-gray-400 mt-2">
                Autonomous full-stack development workflows with collaborative AI agents
              </p>
            </div>
            
            <button
              onClick={createNewWorkflow}
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : '+ New Workflow'}
            </button>
          </div>
        </div>

        {/* Active Workflow Detail */}
        {activeWorkflow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{activeWorkflow.name}</h2>
                <p className="text-gray-400">
                  Stage {activeWorkflow.currentStage + 1} of {activeWorkflow.stages.length}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {activeWorkflow.status === 'running' ? (
                  <button
                    onClick={() => stopWorkflow(activeWorkflow)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <StopIcon className="w-4 h-4" />
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => startWorkflow(activeWorkflow)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <PlayIcon className="w-4 h-4" />
                    Start
                  </button>
                )}
              </div>
            </div>

            {/* Workflow Stages */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {activeWorkflow.stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === activeWorkflow.currentStage;
                const isCompleted = stage.status === 'completed';
                
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 rounded-lg border transition-all duration-300 ${
                      isActive 
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg' 
                        : isCompleted
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-slate-600 bg-slate-700/50'
                    }`}
                  >
                    {/* Stage Icon */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stage.color} flex items-center justify-center mb-3`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Stage Info */}
                    <h3 className="font-semibold text-white mb-2">{stage.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{stage.description}</p>

                    {/* Progress Bar */}
                    {isActive && (
                      <div className="mb-3">
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${stage.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{stage.progress}% complete</p>
                      </div>
                    )}

                    {/* Model & Agents */}
                    {stage.model && (
                      <div className="text-xs text-purple-300 mb-2">
                        Model: {stage.model}
                      </div>
                    )}
                    
                    {stage.agents && (
                      <div className="text-xs text-gray-400">
                        Agents: {stage.agents.join(', ')}
                      </div>
                    )}

                    {/* Status Indicator */}
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      isActive ? 'bg-purple-500 animate-pulse' :
                      isCompleted ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Workflow List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-slate-800/50 backdrop-blur border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                activeWorkflow?.id === workflow.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => setActiveWorkflow(workflow)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{workflow.name}</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  workflow.status === 'running' ? 'bg-green-500/20 text-green-400' :
                  workflow.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  workflow.status === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {workflow.status}
                </div>
              </div>

              <div className="space-y-2">
                {workflow.stages.slice(0, 3).map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      stage.status === 'completed' ? 'bg-green-500' :
                      stage.status === 'active' ? 'bg-purple-500 animate-pulse' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-sm text-gray-300">{stage.name}</span>
                  </div>
                ))}
                {workflow.stages.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{workflow.stages.length - 3} more stages
                  </div>
                )}
              </div>

              {workflow.startTime && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    Started: {workflow.startTime.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {workflows.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No workflows yet</h3>
            <p className="text-gray-500 mb-6">Create your first Scout workflow to get started</p>
            <button
              onClick={createNewWorkflow}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Create First Workflow
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentScoutHub;