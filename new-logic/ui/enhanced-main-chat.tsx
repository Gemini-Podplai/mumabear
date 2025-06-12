import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  MessageCircle, Send, Mic, Image, Paperclip, Download, Upload, 
  Settings, Brain, Sparkles, Heart, Coffee, Archive, Search,
  FileText, CheckCircle, AlertCircle, X, ChevronDown, ChevronUp,
  Loader2, Volume2, Eye, RotateCcw, Star, Share2
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'mama-bear';
  content: string;
  timestamp: string;
  variant?: string;
  files?: File[];
  metadata?: {
    model?: string;
    tokens?: number;
    confidence?: number;
  };
}

interface ConversationExport {
  version: '1.0';
  sanctuary: 'podplay';
  export_timestamp: string;
  conversation: {
    id: string;
    title: string;
    variant: string;
    messages: Message[];
    metadata: {
      created_at: string;
      updated_at: string;
      total_messages: number;
      participants: string[];
    };
  };
}

const EnhancedMainChat = ({ theme }) => {
  // Core state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'mama-bear',
      content: "Welcome to your enhanced Podplay Sanctuary! 🐻✨ I'm Mama Bear, and I'm here to support your neurodivergent journey with caring, intelligent assistance. What would you like to explore together today?",
      timestamp: new Date().toLocaleTimeString(),
      variant: 'scout_commander'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [currentVariant, setCurrentVariant] = useState('scout_commander');
  const [isLoading, setIsLoading] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // File handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mama Bear variants with enhanced descriptions
  const variants = [
    { 
      id: 'scout_commander', 
      name: 'Scout Commander', 
      emoji: '🎯', 
      color: 'blue',
      description: 'Strategic planning & execution',
      capabilities: ['Project Management', 'Code Architecture', 'System Design']
    },
    { 
      id: 'research_specialist', 
      name: 'Research Specialist', 
      emoji: '🔍', 
      color: 'purple',
      description: 'Deep research & analysis',
      capabilities: ['Information Synthesis', 'Data Analysis', 'Academic Research']
    },
    { 
      id: 'code_review_bear', 
      name: 'Code Review Bear', 
      emoji: '👩‍💻', 
      color: 'green',
      description: 'Code quality & optimization',
      capabilities: ['Code Review', 'Bug Detection', 'Performance Optimization']
    },
    { 
      id: 'creative_bear', 
      name: 'Creative Bear', 
      emoji: '🎨', 
      color: 'orange',
      description: 'Creative problem solving',
      capabilities: ['UI/UX Design', 'Creative Writing', 'Innovation']
    },
    { 
      id: 'learning_bear', 
      name: 'Learning Bear', 
      emoji: '📚', 
      color: 'teal',
      description: 'Educational support',
      capabilities: ['Skill Development', 'Explanations', 'Learning Paths']
    },
    { 
      id: 'efficiency_bear', 
      name: 'Efficiency Bear', 
      emoji: '⚡', 
      color: 'yellow',
      description: 'Optimization & automation',
      capabilities: ['Process Automation', 'Workflow Optimization', 'Time Management']
    },
    { 
      id: 'debugging_detective', 
      name: 'Debugging Detective', 
      emoji: '🔍', 
      color: 'red',
      description: 'Problem diagnosis & resolution',
      capabilities: ['Error Analysis', 'System Debugging', 'Root Cause Analysis']
    }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Export conversation functionality
  const exportConversation = useCallback(() => {
    const conversationData: ConversationExport = {
      version: '1.0',
      sanctuary: 'podplay',
      export_timestamp: new Date().toISOString(),
      conversation: {
        id: `conv_${Date.now()}`,
        title: `Conversation with ${variants.find(v => v.id === currentVariant)?.name} - ${new Date().toLocaleDateString()}`,
        variant: currentVariant,
        messages: messages,
        metadata: {
          created_at: messages[0]?.timestamp || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_messages: messages.length,
          participants: ['user', 'mama-bear']
        }
      }
    };

    const dataStr = JSON.stringify(conversationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `podplay-conversation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    setShowExportPanel(false);
  }, [messages, currentVariant, variants]);

  // Import conversation functionality
  const importConversation = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as ConversationExport;
        
        // Validate import structure
        if (!imported.sanctuary || imported.sanctuary !== 'podplay') {
          throw new Error('Invalid Podplay conversation file');
        }
        
        if (!imported.conversation?.messages) {
          throw new Error('No messages found in conversation file');
        }

        // Import the conversation
        setMessages(imported.conversation.messages);
        setCurrentVariant(imported.conversation.variant || 'scout_commander');
        setShowImportPanel(false);
        
        // Show success notification
        const successMessage: Message = {
          id: `import_${Date.now()}`,
          type: 'mama-bear',
          content: `✨ Successfully imported conversation with ${imported.conversation.metadata.total_messages} messages! I'm ready to continue where we left off. 🐻`,
          timestamp: new Date().toLocaleTimeString(),
          variant: imported.conversation.variant
        };
        
        setMessages(prev => [...imported.conversation.messages, successMessage]);
        
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import conversation. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }, []);

  // Send message with backend integration
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://127.0.0.1:5001/api/mama-bear/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          variant: currentVariant,
          context: messages.slice(-10) // Last 10 messages for context
        }),
      });

      const data = await response.json();
      
      const aiResponse: Message = {
        id: `resp_${Date.now()}`,
        type: 'mama-bear',
        content: data.response || "I'm here to help! Let me process that for you. 🐻",
        timestamp: new Date().toLocaleTimeString(),
        variant: currentVariant,
        metadata: {
          model: data.model_used,
          tokens: data.tokens_used,
          confidence: data.confidence_score
        }
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorResponse: Message = {
        id: `error_${Date.now()}`,
        type: 'mama-bear',
        content: "I'm experiencing some technical difficulties, but I'm still here to help! Please try again. 🐻💙",
        timestamp: new Date().toLocaleTimeString(),
        variant: currentVariant
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, currentVariant, messages]);

  // Filter messages based on search
  const filteredMessages = messages.filter(msg =>
    !searchQuery || msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file attachment
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      console.log('Files selected:', files);
      // TODO: Handle file uploads
    }
  };

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'comfort' 
        ? 'bg-gradient-to-br from-purple-50 to-pink-50' 
        : theme === 'professional' 
          ? 'bg-gray-50' 
          : 'bg-gray-900'
    }`}>
      
      {/* Enhanced Header with Export/Import */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-md'
      }`}>
        
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            theme === 'comfort' 
              ? 'bg-gradient-to-br from-purple-400 to-pink-400' 
              : theme === 'professional'
                ? 'bg-blue-600'
                : 'bg-purple-600'
          }`}>
            <span className="text-xl">🐻</span>
          </div>
          
          <div>
            <h1 className={`font-bold text-xl flex items-center gap-2 ${
              theme === 'custom' ? 'text-white' : 'text-gray-900'
            }`}>
              Enhanced Chat Sanctuary
              <Sparkles className="w-5 h-5 text-purple-500" />
            </h1>
            <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
              Powered by {variants.find(v => v.id === currentVariant)?.name} • {messages.length} messages
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'custom' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Search conversation"
          >
            <Search size={20} />
          </button>
          
          <button
            onClick={() => setShowExportPanel(!showExportPanel)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'custom' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Export conversation"
          >
            <Download size={20} />
          </button>
          
          <button
            onClick={() => setShowImportPanel(!showImportPanel)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'custom' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Import conversation"
          >
            <Upload size={20} />
          </button>
          
          <button
            className={`p-2 rounded-lg transition-colors ${
              theme === 'custom' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className={`p-3 border-b ${theme === 'custom' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                theme === 'custom' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>
      )}

      {/* Export Panel */}
      {showExportPanel && (
        <div className={`p-4 border-b ${
          theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Export Conversation
              </h3>
              <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                Save this conversation as a JSON file for future import
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportConversation}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={() => setShowExportPanel(false)}
                className={`p-2 rounded-lg ${
                  theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Panel */}
      {showImportPanel && (
        <div className={`p-4 border-b ${
          theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-green-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Import Conversation
              </h3>
              <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                Load a previously exported Podplay conversation
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                ref={importInputRef}
                type="file"
                accept=".json"
                onChange={importConversation}
                className="hidden"
              />
              <button
                onClick={() => importInputRef.current?.click()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Upload size={16} />
                Choose File
              </button>
              <button
                onClick={() => setShowImportPanel(false)}
                className={`p-2 rounded-lg ${
                  theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variant Selector */}
      <div className={`p-3 border-b ${theme === 'custom' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setCurrentVariant(variant.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                currentVariant === variant.id
                  ? `bg-${variant.color}-100 text-${variant.color}-700 ring-2 ring-${variant.color}-300`
                  : theme === 'custom'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={variant.description}
            >
              <span className="text-lg">{variant.emoji}</span>
              <div className="text-left">
                <div className="font-medium text-sm">{variant.name}</div>
                <div className="text-xs opacity-70">{variant.capabilities[0]}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.type === 'user'
                  ? theme === 'comfort'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : theme === 'professional'
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-600 text-white'
                  : theme === 'custom'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white border shadow-sm'
              } rounded-2xl p-4`}>
                
                {/* Message header for Mama Bear */}
                {message.type === 'mama-bear' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🐻</span>
                    <span className="font-medium text-sm">
                      {variants.find(v => v.id === message.variant)?.name || 'Mama Bear'}
                    </span>
                    <span className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </span>
                  </div>
                )}

                {/* Message content */}
                <div className="prose prose-sm max-w-none">
                  {message.content}
                </div>

                {/* Metadata for AI responses */}
                {message.metadata && (
                  <div className={`mt-2 pt-2 border-t border-opacity-20 text-xs ${
                    theme === 'custom' ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
                  }`}>
                    <div className="flex items-center space-x-4">
                      {message.metadata.model && (
                        <span>Model: {message.metadata.model}</span>
                      )}
                      {message.metadata.tokens && (
                        <span>Tokens: {message.metadata.tokens}</span>
                      )}
                      {message.metadata.confidence && (
                        <span>Confidence: {Math.round(message.metadata.confidence * 100)}%</span>
                      )}
                    </div>
                  </div>
                )}

                {/* User message timestamp */}
                {message.type === 'user' && (
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] ${
                theme === 'custom' ? 'bg-gray-700' : 'bg-white border shadow-sm'
              } rounded-2xl p-4`}>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Mama Bear is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className={`p-4 border-t ${
        theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-4xl mx-auto">
          
          {/* Quick actions */}
          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleFileAttach}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                theme === 'custom' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Paperclip size={14} />
              Attach
            </button>
            
            <button
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                theme === 'custom' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic size={14} />
              Voice
            </button>
            
            <button
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                theme === 'custom' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Image size={14} />
              Image
            </button>
          </div>

          {/* Input field */}
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Share your thoughts with Mama Bear..."
                rows={1}
                className={`w-full px-4 py-3 rounded-2xl border resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  theme === 'custom'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                }`}
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                inputMessage.trim() && !isLoading
                  ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          {/* Input hints */}
          <div className={`mt-2 text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
            Press Enter to send • Shift+Enter for new line • Type "/" for commands
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default EnhancedMainChat;
