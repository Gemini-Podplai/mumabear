import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  PaperAirplaneIcon, 
  PhoneIcon, 
  VideoCameraIcon,
  SparklesIcon,
  BoltIcon,
  BookOpenIcon,
  PaintBrushIcon,
  MicrophoneIcon,
  CpuChipIcon,
  EyeIcon,
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  model_used?: string;
  provider?: string;
  capabilities_used?: string[];
  processing_time?: number;
}

interface ModelOrchestra {
  section: string;
  models: AIModel[];
}

interface AIModel {
  id: string;
  name: string;
  specialty: string;
  capabilities: string[];
  status: 'available' | 'busy' | 'offline';
  latency_tier: string;
  cost_tier: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const PodplayMessenger = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(['function_calling']);
  const [preferredProvider, setPreferredProvider] = useState<string>('auto');
  const [orchestraStatus, setOrchestraStatus] = useState<ModelOrchestra[]>([]);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  const orchestraSections: ModelOrchestra[] = [
    {
      section: "🎼 Conductors",
      models: [
        {
          id: "conductor",
          name: "Gemini 2.5 Pro Conductor",
          specialty: "Task routing and orchestration",
          capabilities: ["reasoning", "long_output", "code_generation"],
          status: "available",
          latency_tier: "medium",
          cost_tier: "high",
          icon: SparklesIcon,
          color: "from-purple-500 to-indigo-500"
        }
      ]
    },
    {
      section: "🧠 Deep Thinkers", 
      models: [
        {
          id: "deep_thinker_primary",
          name: "Gemini 2.0 Flash Thinking",
          specialty: "Complex reasoning and debugging",
          capabilities: ["thinking", "reasoning", "code_generation"],
          status: "available",
          latency_tier: "slow",
          cost_tier: "medium",
          icon: BeakerIcon,
          color: "from-blue-500 to-cyan-500"
        }
      ]
    },
    {
      section: "⚡ Speed Demons",
      models: [
        {
          id: "speed_demon_primary",
          name: "Gemini 2.0 Flash Lite",
          specialty: "Instant responses",
          capabilities: ["speed", "batch_processing"],
          status: "available",
          latency_tier: "ultra_fast",
          cost_tier: "low",
          icon: BoltIcon,
          color: "from-yellow-500 to-orange-500"
        }
      ]
    },
    {
      section: "📚 Context Masters",
      models: [
        {
          id: "context_master_primary",
          name: "Gemini 1.5 Pro (2M Context)",
          specialty: "Massive document analysis",
          capabilities: ["long_context", "code_generation", "reasoning"],
          status: "available",
          latency_tier: "medium",
          cost_tier: "medium",
          icon: BookOpenIcon,
          color: "from-green-500 to-teal-500"
        }
      ]
    },
    {
      section: "🎨 Creative Writers",
      models: [
        {
          id: "creative_writer_primary",
          name: "Gemini 2.5 Flash Creative",
          specialty: "Long-form content generation",
          capabilities: ["creative", "long_output", "code_generation"],
          status: "available",
          latency_tier: "fast",
          cost_tier: "medium",
          icon: PaintBrushIcon,
          color: "from-pink-500 to-rose-500"
        }
      ]
    },
    {
      section: "🎵 Audio Specialists",
      models: [
        {
          id: "tts_specialist",
          name: "Gemini 2.5 Flash TTS",
          specialty: "Text-to-speech generation",
          capabilities: ["tts", "audio"],
          status: "available",
          latency_tier: "fast",
          cost_tier: "medium",
          icon: MicrophoneIcon,
          color: "from-violet-500 to-purple-500"
        }
      ]
    },
    {
      section: "🔄 Real-time Collaborators",
      models: [
        {
          id: "realtime_primary",
          name: "Gemini 2.0 Flash Experimental",
          specialty: "Live coding sessions",
          capabilities: ["real_time", "bidirectional", "live_collaboration"],
          status: "available",
          latency_tier: "fast",
          cost_tier: "medium",
          icon: CpuChipIcon,
          color: "from-cyan-500 to-blue-500"
        }
      ]
    },
    {
      section: "🎯 Specialists",
      models: [
        {
          id: "vision_specialist",
          name: "Gemini Pro Vision",
          specialty: "Image analysis",
          capabilities: ["vision", "reasoning"],
          status: "available",
          latency_tier: "medium",
          cost_tier: "medium",
          icon: EyeIcon,
          color: "from-emerald-500 to-green-500"
        }
      ]
    }
  ];

  const capabilities = [
    { id: 'function_calling', name: 'Function Calling', description: 'Execute functions and tools' },
    { id: 'computer_use', name: 'Computer Use', description: 'Claude 3.5 Computer Use API' },
    { id: 'code_execution', name: 'Code Execution', description: 'Execute and analyze code' },
    { id: 'web_browsing', name: 'Web Browsing', description: 'Browse and analyze websites' },
    { id: 'memory_operations', name: 'Memory Operations', description: 'Store and retrieve memories' },
    { id: 'reasoning', name: 'Deep Reasoning', description: 'Complex analysis and thinking' },
    { id: 'creative', name: 'Creative Writing', description: 'Long-form creative content' },
    { id: 'speed', name: 'Ultra Speed', description: 'Instant responses' }
  ];

  const providers = [
    { id: 'auto', name: 'Auto Route', description: 'Intelligent routing based on capabilities' },
    { id: 'claude', name: 'Claude 3.5', description: 'Anthropic Claude with Computer Use' },
    { id: 'gemini', name: 'Gemini Orchestra', description: '50+ specialized Gemini models' },
    { id: 'openai', name: 'OpenAI GPT-4', description: 'OpenAI GPT-4 for specialized tasks' }
  ];

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/multi-model/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          user_id: 'podplay_user',
          capabilities: selectedCapabilities,
          preferred_provider: preferredProvider === 'auto' ? null : preferredProvider
        })
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: result.data.response || 'I received your message!',
          timestamp: new Date(),
          model_used: result.data.model,
          provider: result.data.provider,
          capabilities_used: selectedCapabilities
        };

        setMessages(prev => [...prev, aiMessage]);
        setActiveModel(result.data.model);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const initiateCall = (type: 'voice' | 'video') => {
    alert(`🎵 Initiating ${type} call with Gemini Audio Specialist...`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      case 'busy':
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLatencyColor = (tier: string) => {
    switch (tier) {
      case 'ultra_fast': return 'text-green-400';
      case 'fast': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'slow': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex">
      
      {/* Model Orchestra Sidebar */}
      <div className="w-80 bg-slate-800/50 backdrop-blur border-r border-indigo-500/20 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🎼 Gemini Orchestra
        </h2>
        
        <div className="space-y-4">
          {orchestraSections.map((section) => (
            <div key={section.section} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">{section.section}</h3>
              {section.models.map((model) => {
                const Icon = model.icon;
                const isActive = activeModel === model.id;
                
                return (
                  <motion.div
                    key={model.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isActive 
                        ? 'border-indigo-500 bg-indigo-500/20' 
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${model.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {getStatusIcon(model.status)}
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1">{model.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{model.specialty}</p>
                    
                    <div className="flex justify-between text-xs">
                      <span className={getLatencyColor(model.latency_tier)}>
                        {model.latency_tier}
                      </span>
                      <span className="text-gray-500">{model.cost_tier}</span>
                    </div>
                    
                    <div className="flex gap-1 mt-2">
                      {model.capabilities.slice(0, 2).map(cap => (
                        <span key={cap} className="px-2 py-1 bg-slate-600/50 text-xs rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Chat Header */}
        <div className="bg-slate-800/50 backdrop-blur border-b border-indigo-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">💬 Podplay Messenger</h1>
              <p className="text-gray-400">Multi-Model AI Orchestra at your service</p>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon 
                className="w-6 h-6 text-indigo-300 cursor-pointer hover:text-white transition-colors" 
                onClick={() => initiateCall('voice')}
              />
              <VideoCameraIcon 
                className="w-6 h-6 text-indigo-300 cursor-pointer hover:text-white transition-colors" 
                onClick={() => initiateCall('video')}
              />
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-slate-800/30 backdrop-blur border-b border-slate-700/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Capabilities Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Required Capabilities</label>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((cap) => (
                  <button
                    key={cap.id}
                    onClick={() => {
                      setSelectedCapabilities(prev => 
                        prev.includes(cap.id) 
                          ? prev.filter(c => c !== cap.id)
                          : [...prev, cap.id]
                      );
                    }}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      selectedCapabilities.includes(cap.id)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                    }`}
                  >
                    {cap.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Provider</label>
              <select
                value={preferredProvider}
                onChange={(e) => setPreferredProvider(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} - {provider.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-4 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-700 text-white'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs opacity-70">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.model_used && (
                      <div className="flex items-center gap-2">
                        <span>via {message.model_used}</span>
                        {message.provider && (
                          <span className="px-2 py-1 bg-black/20 rounded">
                            {message.provider}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {message.capabilities_used && message.capabilities_used.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {message.capabilities_used.map(cap => (
                        <span key={cap} className="px-2 py-1 bg-black/20 text-xs rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-gray-400">Orchestra is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-slate-800/50 backdrop-blur border-t border-indigo-500/20 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message the AI Orchestra..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              Send
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Selected: {selectedCapabilities.join(', ')} • Provider: {preferredProvider}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodplayMessenger;