import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  PhotoIcon,
  DocumentIcon,
  CodeBracketIcon,
  BeakerIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mama-bear';
  timestamp: Date;
  type: 'text' | 'image' | 'code';
}

const MamaBearChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🐻 Hello there! I'm Mama Bear, your caring AI companion. I'm here to help you with anything you need - from coding and research to creative projects and emotional support. What would you like to work on together today?",
      sender: 'mama-bear',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Function to send message to AI backend
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setInputMessage('');

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Send to backend API
      const response = await fetch('http://localhost:5000/api/multi-model/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: content.trim(),
          user_id: 'mama-bear-user',
          capabilities: ['function_calling'],
          preferred_provider: 'gemini',
          context: {
            type: 'mama_bear_chat',
            personality: 'caring_supportive_neurodivergent_friendly'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.data?.response || data.data?.content || 'I received your message and I\'m here to help!',
        sender: 'mama-bear',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `🐻 I'm having trouble connecting right now, but I'm still here for you! The error was: ${error instanceof Error ? error.message : String(error)}. Please try again in a moment.`,
        sender: 'mama-bear',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [isLoading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  }, [inputMessage, sendMessage]);

  const quickActions = useMemo(() => [
    { icon: CodeBracketIcon, label: "Help with coding", prompt: "I need help with a coding project" },
    { icon: BeakerIcon, label: "Research assistance", prompt: "I need help researching a topic" },
    { icon: HeartIcon, label: "Emotional support", prompt: "I'm feeling overwhelmed and need some support" },
    { icon: RocketLaunchIcon, label: "Project planning", prompt: "Help me plan and organize a new project" },
    { icon: SparklesIcon, label: "Creative ideas", prompt: "I need creative inspiration for my project" },
    { icon: DocumentIcon, label: "Writing help", prompt: "Help me with writing and editing" }
  ], []);

  // Memoized message component for better performance
  const MessageComponent = memo(({ message, index }: { message: Message; index: number }) => (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        message.sender === 'user'
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
      }`}>
        {message.sender === 'mama-bear' && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">🐻</span>
            <span className="text-sm font-semibold text-purple-300">Mama Bear</span>
          </div>
        )}
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className="mt-2 text-xs opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20">
      {/* Header - Simplified Animation */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">🐻</div>
          <div>
            <h1 className="text-2xl font-bold">Mama Bear Chat</h1>
            <p className="text-purple-100">Your caring AI companion for neurodivergent-friendly support</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Online & Ready</span>
          </div>
        </div>
      </div>

      {/* Messages Area - Optimized */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageComponent key={message.id} message={message} index={index} />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🐻</span>
                <span className="text-sm font-semibold text-purple-300">Mama Bear</span>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-xs text-purple-300 ml-2">Mama Bear is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions - Simplified */}
      <div className="px-6 py-4">
        <h3 className="text-white text-sm font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.prompt)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white transition-colors duration-150 flex flex-col items-center space-y-2 hover:scale-105 active:scale-95 transform"
            >
              <action.icon className="w-5 h-5 text-purple-300" />
              <span className="text-xs text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area - Simplified */}
      <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chat with Mama Bear... She's here to help! 🐻💜"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white transition-colors duration-150 hover:scale-110 active:scale-90 transform">
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            
            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white transition-colors duration-150 hover:scale-110 active:scale-90 transform">
              <PhotoIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => sendMessage(inputMessage)}
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white transition-all duration-150 flex items-center justify-center hover:scale-110 active:scale-90 transform"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400">
            Mama Bear is designed to be supportive and understanding. Feel free to share anything! 🌟
          </p>
        </div>
      </div>

      {/* Simplified Floating Hearts Animation - Reduced for Performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/20 text-2xl"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
          >
            💜
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MamaBearChat;