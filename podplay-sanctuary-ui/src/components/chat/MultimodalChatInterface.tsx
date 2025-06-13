import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  GlobeAltIcon,
  XMarkIcon,
  ChevronDownIcon,
  DocumentIcon,
  SpeakerWaveIcon,
  FaceSmileIcon,
  CommandLineIcon,
  BoltIcon,
  SparklesIcon,
  EyeIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  emoji?: string;
  isStreaming?: boolean;
  uploadProgress?: number;
  attachments?: Array<{
    type: 'image' | 'file' | 'audio' | 'video';
    url: string;
    name: string;
    size?: number;
    preview?: string;
  }>;
  metadata?: {
    model?: string;
    functionCalls?: string[];
    webSearch?: boolean;
    responseTime?: number;
    tokens?: number;
    cost?: number;
  };
}

interface MultimodalChatInterfaceProps {
  agentName: string;
  agentType: 'scout' | 'research' | 'code' | 'workflow' | 'mcp' | 'messenger';
  agentDescription: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const MultimodalChatInterface: React.FC<MultimodalChatInterfaceProps> = ({
  agentName,
  agentType,
  agentDescription,
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: `🚀 Hello! I'm ${agentName}, your ${agentDescription}. I can help you with multimodal tasks including image analysis, file processing, web research, and more. How can I assist you today?`,
      timestamp: new Date(),
      emoji: '🐻',
      metadata: {
        model: 'mama-bear-' + agentType,
        responseTime: 150,
        tokens: 45,
        cost: 0.001
      }
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAgentGradient = () => {
    switch (agentType) {
      case 'scout': return 'from-purple-500 to-pink-500';
      case 'research': return 'from-blue-500 to-cyan-500';
      case 'code': return 'from-orange-500 to-red-500';
      case 'workflow': return 'from-indigo-500 to-purple-500';
      case 'mcp': return 'from-teal-500 to-blue-500';
      case 'messenger': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() && !isRecording) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      emoji: '🧑‍💻'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate streaming response with realistic AI behavior
    const responseId = (Date.now() + 1).toString();
    setStreamingMessageId(responseId);
    
    const streamingMessage: Message = {
      id: responseId,
      type: 'agent',
      content: '',
      timestamp: new Date(),
      emoji: '🐻',
      isStreaming: true,
      metadata: {
        model: `mama-bear-${agentType}`,
        functionCalls: ['analyze_request', 'process_multimodal'],
        webSearch: inputValue.toLowerCase().includes('search') || inputValue.toLowerCase().includes('web')
      }
    };

    setMessages(prev => [...prev, streamingMessage]);

    // Simulate realistic streaming
    const fullResponse = `🚀 I understand you want to ${inputValue}. Let me help you with that using my ${agentType} capabilities. I can process this request with multimodal analysis and provide comprehensive assistance. I'm leveraging your Vertex AI service with Express Mode for ultra-fast responses!`;
    
    let currentContent = '';
    const words = fullResponse.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      currentContent += (i > 0 ? ' ' : '') + words[i];
      
      setMessages(prev => prev.map(msg =>
        msg.id === responseId
          ? {
              ...msg,
              content: currentContent,
              metadata: {
                ...msg.metadata,
                responseTime: Math.floor(150 + Math.random() * 300),
                tokens: currentContent.split(' ').length,
                cost: Math.round((currentContent.split(' ').length * 0.00002) * 1000) / 1000
              }
            }
          : msg
      ));
    }

    // Finalize streaming
    setMessages(prev => prev.map(msg =>
      msg.id === responseId
        ? { ...msg, isStreaming: false }
        : msg
    ));
    
    setStreamingMessageId(null);
    setIsProcessing(false);
  }, [inputValue, agentType, isRecording]);

  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const fileId = `${Date.now()}-${index}`;
      
      // Show upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const attachment = {
        type: file.type.startsWith('image/') ? 'image' as const :
              file.type.startsWith('video/') ? 'video' as const :
              file.type.startsWith('audio/') ? 'audio' as const : 'file' as const,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };

      // Simulate upload progress
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(uploadInterval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }
        setUploadProgress(prev => ({ ...prev, [fileId]: Math.min(progress, 100) }));
      }, 200);

      const message: Message = {
        id: fileId,
        type: 'user',
        content: `📎 Uploaded ${file.name}`,
        timestamp: new Date(),
        emoji: '🧑‍💻',
        attachments: [attachment],
        uploadProgress: 0
      };

      setMessages(prev => [...prev, message]);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          handleFileUpload(dataTransfer.files);
        }
      }
    }
  }, [handleFileUpload]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setIsVoiceMode(!isVoiceMode);
    // Implement actual recording logic here
  };

  const toggleVideoMode = () => {
    setIsVideoMode(!isVideoMode);
    // Implement video call logic here
  };

  const quickEmojis = ['😀', '😂', '🤔', '👍', '❤️', '🔥', '💯', '🚀'];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <button
          onClick={onToggleCollapse}
          className={`p-4 rounded-full bg-gradient-to-r ${getAgentGradient()} shadow-lg hover:shadow-xl transition-all`}
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`flex flex-col h-full bg-black/20 backdrop-blur-xl border-l border-white/10 ${className}`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
    >
      {/* Header */}
      <div className={`p-4 border-b border-white/10 bg-gradient-to-r ${getAgentGradient()}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">{agentName}</h3>
            <p className="text-xs text-white/80">{agentDescription}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBrowser(!showBrowser)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <GlobeAltIcon className="w-4 h-4 text-white" />
            </button>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronDownIcon className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Browser Popup */}
      {showBrowser && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 200, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-b border-white/10 bg-gray-900"
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Web Research</span>
              <button
                onClick={() => setShowBrowser(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>RAG Search Active</span>
              </div>
              <div className="text-xs text-gray-400">
                Real-time web search and knowledge base integration enabled
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Agent Avatar/Emoji */}
            {message.type === 'agent' && (
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getAgentGradient()} flex items-center justify-center text-sm flex-shrink-0`}>
                {message.emoji || '🐻'}
              </div>
            )}
            
            <div
              className={`max-w-[70%] p-4 rounded-2xl shadow-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                  : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-md border border-white/20'
              }`}
            >
              {/* Message Content with Streaming Effect */}
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Upload Progress */}
              {message.uploadProgress !== undefined && message.uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <ArrowPathIcon className="w-3 h-3 animate-spin" />
                    <span>Uploading... {Math.round(message.uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${message.uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Enhanced Attachments with Previews */}
              {message.attachments && (
                <div className="mt-3 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl border border-white/20"
                    >
                      {attachment.type === 'image' && attachment.preview ? (
                        <div className="relative">
                          <img
                            src={attachment.preview}
                            alt={attachment.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          attachment.type === 'video' ? 'bg-red-500/20' :
                          attachment.type === 'audio' ? 'bg-green-500/20' : 'bg-blue-500/20'
                        }`}>
                          {attachment.type === 'image' && <PhotoIcon className="w-6 h-6 text-blue-400" />}
                          {attachment.type === 'video' && <PlayIcon className="w-6 h-6 text-red-400" />}
                          {attachment.type === 'audio' && <SpeakerWaveIcon className="w-6 h-6 text-green-400" />}
                          {attachment.type === 'file' && <DocumentIcon className="w-6 h-6 text-gray-400" />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{attachment.name}</p>
                        {attachment.size && (
                          <p className="text-xs text-gray-400">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <button className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                        <EyeIcon className="w-4 h-4 text-gray-300" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Enhanced Metadata */}
              {message.metadata && (
                <div className="mt-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-white/10 rounded-full">{message.metadata.model}</span>
                      {message.metadata.webSearch && (
                        <span className="px-2 py-1 bg-green-600/30 rounded-full flex items-center space-x-1">
                          <GlobeAltIcon className="w-3 h-3" />
                          <span>Web Search</span>
                        </span>
                      )}
                    </div>
                    {message.metadata.responseTime && (
                      <span className="text-gray-400">{message.metadata.responseTime}ms</span>
                    )}
                  </div>
                  {(message.metadata.tokens || message.metadata.cost) && (
                    <div className="flex items-center space-x-3 text-gray-400">
                      {message.metadata.tokens && <span>{message.metadata.tokens} tokens</span>}
                      {message.metadata.cost && <span>${message.metadata.cost}</span>}
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-xs opacity-50 mt-2 flex items-center justify-between">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.type === 'user' && message.emoji && (
                  <span className="text-base">{message.emoji}</span>
                )}
              </div>
            </div>

            {/* User Avatar/Emoji */}
            {message.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-sm flex-shrink-0">
                {message.emoji || '🧑‍💻'}
              </div>
            )}
          </motion.div>
        ))}
        
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Processing...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Drag Overlay */}
      {dragOver && (
        <div className="absolute inset-0 bg-blue-600/20 border-2 border-dashed border-blue-400 flex items-center justify-center z-10">
          <div className="text-center">
            <PhotoIcon className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-white font-medium">Drop files here</p>
          </div>
        </div>
      )}

      {/* Enhanced Input Area with ALL ADVANCED FEATURES */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        {/* Voice/Video Mode Indicators */}
        {(isVoiceMode || isVideoMode) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30"
          >
            <div className="flex items-center space-x-3">
              {isVoiceMode && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-300">Voice Recording Active</span>
                </div>
              )}
              {isVideoMode && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-300">Video Call Active</span>
                </div>
              )}
              <button
                onClick={() => {
                  setIsVoiceMode(false);
                  setIsVideoMode(false);
                  setIsRecording(false);
                }}
                className="ml-auto p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <StopIcon className="w-4 h-4 text-red-300" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Emoji Bar */}
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-2 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Quick Reactions:</span>
              {quickEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(prev => prev + emoji)}
                  className="p-1 rounded hover:bg-white/10 transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Advanced Toolbar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {/* File Upload */}
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
              title="Upload Images"
            >
              <PhotoIcon className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
              title="Upload Files"
            >
              <PaperClipIcon className="w-4 h-4 text-gray-300 group-hover:text-green-400" />
            </button>
            
            {/* Voice Recording */}
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-all group ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title={isRecording ? "Stop Recording" : "Start Voice Recording"}
            >
              <MicrophoneIcon className={`w-4 h-4 ${
                isRecording ? 'text-white animate-pulse' : 'text-gray-300 group-hover:text-red-400'
              }`} />
            </button>
            
            {/* Video Call */}
            <button
              onClick={toggleVideoMode}
              className={`p-2 rounded-lg transition-all group ${
                isVideoMode
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title={isVideoMode ? "End Video Call" : "Start Video Call"}
            >
              <VideoCameraIcon className={`w-4 h-4 ${
                isVideoMode ? 'text-white' : 'text-gray-300 group-hover:text-green-400'
              }`} />
            </button>
            
            {/* Text-to-Speech */}
            <button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
              title="Text-to-Speech"
            >
              <SpeakerWaveIcon className="w-4 h-4 text-gray-300 group-hover:text-purple-400" />
            </button>

            {/* Code Mode */}
            <button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
              title="Code Assistant Mode"
            >
              <CommandLineIcon className="w-4 h-4 text-gray-300 group-hover:text-orange-400" />
            </button>

            {/* Express Mode */}
            <button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
              title="Express Mode (Ultra Fast)"
            >
              <BoltIcon className="w-4 h-4 text-gray-300 group-hover:text-yellow-400" />
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Emoji Picker */}
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`p-2 rounded-lg transition-colors group ${
                showEmojis ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Emoji Picker"
            >
              <FaceSmileIcon className={`w-4 h-4 ${
                showEmojis ? 'text-yellow-400' : 'text-gray-300 group-hover:text-yellow-400'
              }`} />
            </button>

            {/* AI Enhancement */}
            <button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
              title="AI Enhancement Mode"
            >
              <SparklesIcon className="w-4 h-4 text-gray-300 group-hover:text-pink-400" />
            </button>
          </div>
        </div>
        
        {/* Enhanced Input Field */}
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onPaste={handlePaste}
              placeholder={`💬 Message ${agentName}... (Shift+Enter for new line)`}
              rows={inputValue.split('\n').length}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none transition-all"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {inputValue.length}/4000
            </div>
          </div>
          
          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !isRecording}
            className={`p-3 rounded-xl transition-all transform hover:scale-105 ${
              inputValue.trim() || isRecording
                ? `bg-gradient-to-r ${getAgentGradient()} hover:opacity-80 shadow-lg`
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
            title="Send Message"
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Upload Progress Indicators */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-3 space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <motion.div
                key={fileId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg"
              >
                <ArrowPathIcon className="w-4 h-4 text-blue-400 animate-spin" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                    <span>Uploading...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
      
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
    </motion.div>
  );
};

export default MultimodalChatInterface;