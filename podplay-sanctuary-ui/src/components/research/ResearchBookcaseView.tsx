import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpenIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

interface ResearchMode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  models: string[];
  collaborative: boolean;
}

interface ResearchDepth {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  thoroughness: number;
}

interface ResearchSession {
  id: string;
  topic: string;
  mode: ResearchMode;
  depth: ResearchDepth;
  status: 'idle' | 'running' | 'completed' | 'paused';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  findings: string[];
  currentPhase: string;
}

const ResearchBookcaseView: React.FC = () => {
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(null);
  const [selectedMode, setSelectedMode] = useState<ResearchMode | null>(null);
  const [selectedDepth, setSelectedDepth] = useState<ResearchDepth | null>(null);
  const [researchTopic, setResearchTopic] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Research modes based on your backend
  const researchModes: ResearchMode[] = [
    {
      id: 'claude_only',
      name: 'Claude Only',
      description: 'Deep analytical research using Claude\'s reasoning capabilities',
      icon: BookOpenIcon,
      color: 'from-orange-500 to-red-500',
      models: ['claude-3.5-sonnet'],
      collaborative: false
    },
    {
      id: 'gemini_only',
      name: 'Gemini Only',
      description: 'Fast, comprehensive research using Gemini models',
      icon: LightBulbIcon,
      color: 'from-blue-500 to-cyan-500',
      models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
      collaborative: false
    },
    {
      id: 'collaborative',
      name: 'Collaborative',
      description: 'Claude and Gemini working together on research',
      icon: UserGroupIcon,
      color: 'from-purple-500 to-pink-500',
      models: ['claude-3.5-sonnet', 'gemini-1.5-pro'],
      collaborative: true
    },
    {
      id: 'consensus',
      name: 'Consensus',
      description: 'Multiple models reaching agreement on findings',
      icon: ScaleIcon,
      color: 'from-green-500 to-teal-500',
      models: ['claude-3.5-sonnet', 'gemini-1.5-pro', 'gemini-1.5-flash'],
      collaborative: true
    },
    {
      id: 'debate',
      name: 'Debate Mode',
      description: 'Models challenge each other\'s findings for deeper insights',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-indigo-500 to-purple-500',
      models: ['claude-3.5-sonnet', 'gemini-1.5-pro'],
      collaborative: true
    }
  ];

  // Research depths based on your backend
  const researchDepths: ResearchDepth[] = [
    {
      id: 'quick',
      name: 'Quick Scan',
      description: 'Fast overview and key insights',
      estimatedTime: '2-5 minutes',
      thoroughness: 25
    },
    {
      id: 'standard',
      name: 'Standard Research',
      description: 'Balanced depth and speed',
      estimatedTime: '10-15 minutes',
      thoroughness: 50
    },
    {
      id: 'deep',
      name: 'Deep Dive',
      description: 'Comprehensive analysis with multiple sources',
      estimatedTime: '20-30 minutes',
      thoroughness: 75
    },
    {
      id: 'exhaustive',
      name: 'Exhaustive Study',
      description: 'Maximum thoroughness and cross-referencing',
      estimatedTime: '45-60 minutes',
      thoroughness: 100
    }
  ];

  useEffect(() => {
    // Listen for research updates from backend
    socket.on('research_session_update', (data) => {
      setSessions(prev => 
        prev.map(s => s.id === data.session_id ? { ...s, ...data } : s)
      );
      
      if (activeSession?.id === data.session_id) {
        setActiveSession(prev => prev ? { ...prev, ...data } : null);
      }
    });

    socket.on('research_finding', (data) => {
      setSessions(prev => 
        prev.map(s => {
          if (s.id === data.session_id) {
            return { ...s, findings: [...s.findings, data.finding] };
          }
          return s;
        })
      );
    });

    return () => {
      socket.off('research_session_update');
      socket.off('research_finding');
    };
  }, [activeSession]);

  const startResearchSession = () => {
    if (!selectedMode || !selectedDepth || !researchTopic.trim()) return;

    setIsCreating(true);

    const newSession: ResearchSession = {
      id: `research_${Date.now()}`,
      topic: researchTopic,
      mode: selectedMode,
      depth: selectedDepth,
      status: 'running',
      progress: 0,
      startTime: new Date(),
      findings: [],
      currentPhase: 'Initializing research...'
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSession(newSession);

    // Send to backend
    socket.emit('research_session_start', {
      session_id: newSession.id,
      topic: researchTopic,
      mode: selectedMode.id,
      depth: selectedDepth.id,
      models: selectedMode.models
    });

    // Reset form
    setResearchTopic('');
    setSelectedMode(null);
    setSelectedDepth(null);
    setIsCreating(false);
  };

  const pauseSession = (session: ResearchSession) => {
    const updatedSession = { ...session, status: 'paused' as const };
    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    socket.emit('research_session_pause', { session_id: session.id });
  };

  const resumeSession = (session: ResearchSession) => {
    const updatedSession = { ...session, status: 'running' as const };
    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    socket.emit('research_session_resume', { session_id: session.id });
  };

  const stopSession = (session: ResearchSession) => {
    const updatedSession = { ...session, status: 'idle' as const };
    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    socket.emit('research_session_stop', { session_id: session.id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Research Center
          </h1>
          <p className="text-gray-400 mt-2">
            Claude & Gemini collaborative research with multiple modes and depths
          </p>
        </div>

        {/* New Research Session Form */}
        <div className="bg-slate-800/50 backdrop-blur border border-indigo-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Start New Research</h2>
          
          {/* Research Topic */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Research Topic
            </label>
            <input
              type="text"
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              placeholder="What would you like to research?"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Research Modes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Research Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {researchModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode?.id === mode.id;
                
                return (
                  <motion.div
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMode(mode)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/20 shadow-lg'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{mode.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{mode.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {mode.models.map((model) => (
                        <span key={model} className="text-xs bg-slate-600 px-2 py-1 rounded">
                          {model.split('-')[0]}
                        </span>
                      ))}
                    </div>
                    {mode.collaborative && (
                      <div className="mt-2 text-xs text-indigo-300">
                        🤝 Collaborative
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Research Depths */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Research Depth
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {researchDepths.map((depth) => {
                const isSelected = selectedDepth?.id === depth.id;
                
                return (
                  <motion.div
                    key={depth.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDepth(depth)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{depth.name}</h3>
                      <div className="text-xs text-gray-400">{depth.thoroughness}%</div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{depth.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      {depth.estimatedTime}
                    </div>
                    
                    {/* Thoroughness Bar */}
                    <div className="mt-3 w-full bg-slate-600 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full"
                        style={{ width: `${depth.thoroughness}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startResearchSession}
            disabled={!selectedMode || !selectedDepth || !researchTopic.trim() || isCreating}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            {isCreating ? 'Starting Research...' : 'Start Research'}
          </button>
        </div>

        {/* Active Research Session */}
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur border border-indigo-500/20 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{activeSession.topic}</h2>
                <p className="text-gray-400">
                  {activeSession.mode.name} • {activeSession.depth.name}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {activeSession.status === 'running' ? (
                  <>
                    <button
                      onClick={() => pauseSession(activeSession)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <PauseIcon className="w-4 h-4" />
                      Pause
                    </button>
                    <button
                      onClick={() => stopSession(activeSession)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <StopIcon className="w-4 h-4" />
                      Stop
                    </button>
                  </>
                ) : activeSession.status === 'paused' ? (
                  <button
                    onClick={() => resumeSession(activeSession)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <PlayIcon className="w-4 h-4" />
                    Resume
                  </button>
                ) : null}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Progress</span>
                <span className="text-sm text-gray-400">{activeSession.progress}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${activeSession.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">{activeSession.currentPhase}</p>
            </div>

            {/* Findings */}
            {activeSession.findings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Research Findings</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {activeSession.findings.map((finding, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-700/50 p-3 rounded-lg border border-slate-600"
                    >
                      <p className="text-gray-300">{finding}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Research Sessions Library */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-slate-800/50 backdrop-blur border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                activeSession?.id === session.id
                  ? 'border-indigo-500 shadow-lg'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => setActiveSession(session)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white truncate">{session.topic}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.status === 'running' ? 'bg-green-500/20 text-green-400' :
                  session.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  session.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {session.status}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${session.mode.color}`} />
                  {session.mode.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <BeakerIcon className="w-4 h-4" />
                  {session.depth.name}
                </div>
              </div>

              {session.findings.length > 0 && (
                <div className="text-sm text-gray-400">
                  {session.findings.length} findings
                </div>
              )}

              {session.startTime && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    Started: {session.startTime.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No research sessions yet</h3>
            <p className="text-gray-500">Start your first research session to begin exploring topics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchBookcaseView;