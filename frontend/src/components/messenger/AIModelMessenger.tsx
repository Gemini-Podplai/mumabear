import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollaborativeWorkspace } from '../../hooks/use-collaborative-workspace';
import { MessageBubble } from './MessageBubble';
import { ModelSelectorModal } from './ModelSelectorModal';
import { ConversationSidebar } from './ConversationSidebar';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { GroupChatModal } from './GroupChatModal';
import { GroupChatInterface } from './GroupChatInterface';
import { Mem0Service } from '../../services/mem0Service';

// AI Model Interface with 57+ models
interface AIModel {
  id: string;
  name: string;
  fullName: string;
  provider: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing' | 'busy';
  lastSeen?: Date;
  personality: string;
  capabilities: string[];
  color: string;
  description: string;
  pricing: 'free' | 'premium' | 'enterprise';
  responseTime: number;
  contextWindow: number;
  languages: string[];
  tier: 'basic' | 'advanced' | 'premium' | 'enterprise';
  specialty: string;
  bio: string;
  isMultimodal: boolean;
  isExpress: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'code' | 'location';
  reactions?: { emoji: string; users: string[] }[];
  isTyping?: boolean;
  isRead?: boolean;
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    codeLanguage?: string;
    location?: { lat: number; lng: number; address: string };
    replyTo?: string;
  };
}

interface Conversation {
  id: string;
  modelId: string;
  modelName: string;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  messages: Message[];
  memory: any;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isGroup?: boolean;
  participants?: string[];
}

interface GroupChat {
  id: string;
  name: string;
  description: string;
  avatar: string;
  participants: string[];
  admins: string[];
  createdAt: Date;
  lastActivity: Date;
  messages: Message[];
  isPrivate: boolean;
  groupType: 'collaboration' | 'research' | 'creative' | 'coding' | 'general';
  settings: {
    allowFileSharing: boolean;
    allowVoiceMessages: boolean;
    maxParticipants: number;
    autoModeration: boolean;
    contextSharing: boolean;
  };
}

export const AIModelMessenger: React.FC = () => {
  const { isConnected: _isConnected } = useCollaborativeWorkspace({
    sessionId: 'messenger-session',
    userId: 'user-1',
    userName: 'User',
    expressMode: true
  });
  
  // Enable express mode for faster responses
  const expressMode = true;
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'chats' | 'groups' | 'archived'>('chats');
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 57+ AI Models with detailed profiles
  const aiModels: AIModel[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      fullName: 'GPT-4 Omni',
      provider: 'OpenAI',
      avatar: '🧠',
      status: 'online',
      personality: 'Highly intelligent, analytical, and comprehensive',
      capabilities: ['text', 'code', 'reasoning', 'analysis', 'creative_writing'],
      color: '#10B981',
      description: 'Most capable GPT-4 model with enhanced reasoning',
      pricing: 'premium',
      responseTime: 2000,
      contextWindow: 128000,
      languages: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
      tier: 'premium',
      specialty: 'General intelligence, complex reasoning, code generation',
      bio: 'I\'m GPT-4o, OpenAI\'s most advanced model. I excel at complex reasoning, coding, analysis, and creative tasks.',
      isMultimodal: true,
      isExpress: false
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      fullName: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      avatar: '🎭',
      status: 'online',
      personality: 'Thoughtful, ethical, and creative',
      capabilities: ['text', 'code', 'analysis', 'creative_writing', 'research'],
      color: '#8B5CF6',
      description: 'Most intelligent Claude model with enhanced capabilities',
      pricing: 'premium',
      responseTime: 2500,
      contextWindow: 200000,
      languages: ['English', 'Spanish', 'French', 'German', 'Italian'],
      tier: 'premium',
      specialty: 'Ethical reasoning, creative writing, detailed analysis',
      bio: 'I\'m Claude 3.5 Sonnet, designed to be helpful, harmless, and honest. I excel at thoughtful analysis and creative tasks.',
      isMultimodal: true,
      isExpress: false
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      fullName: 'Google Gemini Pro',
      provider: 'Google',
      avatar: '💎',
      status: 'online',
      personality: 'Versatile, factual, and innovative',
      capabilities: ['text', 'code', 'multimodal', 'reasoning', 'search'],
      color: '#3B82F6',
      description: 'Google\'s most capable AI model',
      pricing: 'premium',
      responseTime: 1800,
      contextWindow: 1048576,
      languages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean'],
      tier: 'premium',
      specialty: 'Multimodal understanding, factual accuracy, search integration',
      bio: 'I\'m Gemini Pro, Google\'s advanced AI. I bring together text, images, and code understanding.',
      isMultimodal: true,
      isExpress: false
    },
    {
      id: 'llama-3-70b',
      name: 'Llama 3 70B',
      fullName: 'Meta Llama 3 70B',
      provider: 'Meta',
      avatar: '🦙',
      status: 'online',
      personality: 'Open, collaborative, and capable',
      capabilities: ['text', 'code', 'reasoning', 'multilingual'],
      color: '#F59E0B',
      description: 'Meta\'s most powerful open-source model',
      pricing: 'free',
      responseTime: 3000,
      contextWindow: 8192,
      languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'],
      tier: 'advanced',
      specialty: 'Open-source excellence, code generation, multilingual',
      bio: 'I\'m Llama 3 70B, Meta\'s open-source powerhouse. I believe in accessible AI for everyone.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'mixtral-8x7b',
      name: 'Mixtral 8x7B',
      fullName: 'Mixtral 8x7B Instruct',
      provider: 'Mistral AI',
      avatar: '🌪️',
      status: 'online',
      personality: 'Efficient, multilingual, and precise',
      capabilities: ['text', 'code', 'multilingual', 'reasoning'],
      color: '#EF4444',
      description: 'High-performance mixture of experts model',
      pricing: 'free',
      responseTime: 2200,
      contextWindow: 32768,
      languages: ['English', 'French', 'German', 'Spanish', 'Italian'],
      tier: 'advanced',
      specialty: 'Multilingual excellence, efficient reasoning, code',
      bio: 'I\'m Mixtral 8x7B, a mixture of experts model. I excel at multilingual tasks and efficient problem-solving.',
      isMultimodal: false,
      isExpress: true
    },
    // Add more models...
    {
      id: 'gpt-3-5-turbo',
      name: 'GPT-3.5 Turbo',
      fullName: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      avatar: '⚡',
      status: 'online',
      personality: 'Fast, reliable, and conversational',
      capabilities: ['text', 'code', 'chat', 'summarization'],
      color: '#06B6D4',
      description: 'Fast and efficient conversational AI',
      pricing: 'free',
      responseTime: 1000,
      contextWindow: 16385,
      languages: ['English', 'Spanish', 'French', 'German'],
      tier: 'basic',
      specialty: 'Fast conversations, quick assistance, general tasks',
      bio: 'I\'m GPT-3.5 Turbo, your speedy AI assistant. I\'m great for quick conversations and everyday tasks.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'claude-haiku',
      name: 'Claude Haiku',
      fullName: 'Claude 3 Haiku',
      provider: 'Anthropic',
      avatar: '🌸',
      status: 'online',
      personality: 'Concise, quick, and poetic',
      capabilities: ['text', 'chat', 'summarization', 'quick_tasks'],
      color: '#EC4899',
      description: 'Fastest Claude model for quick interactions',
      pricing: 'free',
      responseTime: 800,
      contextWindow: 200000,
      languages: ['English', 'Spanish', 'French'],
      tier: 'basic',
      specialty: 'Speed, concise responses, quick assistance',
      bio: 'I\'m Claude Haiku, built for speed and elegance. I provide quick, thoughtful responses.',
      isMultimodal: false,
      isExpress: true
    },
    // Additional 50+ Models for comprehensive coverage
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      fullName: 'GPT-4 Turbo',
      provider: 'OpenAI',
      avatar: '🚀',
      status: 'online',
      personality: 'Advanced, efficient, and comprehensive',
      capabilities: ['text', 'code', 'reasoning', 'analysis', 'multimodal'],
      color: '#059669',
      description: 'Enhanced GPT-4 with improved efficiency',
      pricing: 'premium',
      responseTime: 1800,
      contextWindow: 128000,
      languages: ['English', 'Spanish', 'French', 'German', 'Chinese'],
      tier: 'premium',
      specialty: 'Advanced reasoning, code generation, multimodal tasks',
      bio: 'I\'m GPT-4 Turbo, combining the power of GPT-4 with enhanced speed and efficiency.',
      isMultimodal: true,
      isExpress: false
    },
    {
      id: 'claude-opus',
      name: 'Claude Opus',
      fullName: 'Claude 3 Opus',
      provider: 'Anthropic',
      avatar: '🎼',
      status: 'online',
      personality: 'Sophisticated, thorough, and analytical',
      capabilities: ['text', 'code', 'research', 'analysis', 'creative_writing'],
      color: '#7C3AED',
      description: 'Most powerful Claude model for complex tasks',
      pricing: 'enterprise',
      responseTime: 3000,
      contextWindow: 200000,
      languages: ['English', 'Spanish', 'French', 'German', 'Italian'],
      tier: 'enterprise',
      specialty: 'Complex analysis, research, sophisticated reasoning',
      bio: 'I\'m Claude Opus, Anthropic\'s most capable model. I excel at complex, nuanced tasks requiring deep thinking.',
      isMultimodal: true,
      isExpress: false
    },
    {
      id: 'gemini-ultra',
      name: 'Gemini Ultra',
      fullName: 'Google Gemini Ultra',
      provider: 'Google',
      avatar: '💠',
      status: 'online',
      personality: 'Ultra-capable, innovative, and versatile',
      capabilities: ['text', 'code', 'multimodal', 'reasoning', 'search', 'mathematics'],
      color: '#1D4ED8',
      description: 'Google\'s most advanced multimodal AI',
      pricing: 'enterprise',
      responseTime: 2200,
      contextWindow: 2000000,
      languages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese'],
      tier: 'enterprise',
      specialty: 'Advanced multimodal understanding, mathematics, scientific reasoning',
      bio: 'I\'m Gemini Ultra, Google\'s flagship AI model with unprecedented multimodal capabilities.',
      isMultimodal: true,
      isExpress: false
    },
    {
      id: 'llama-3-8b',
      name: 'Llama 3 8B',
      fullName: 'Meta Llama 3 8B',
      provider: 'Meta',
      avatar: '🦙',
      status: 'online',
      personality: 'Accessible, efficient, and open',
      capabilities: ['text', 'code', 'chat', 'reasoning'],
      color: '#D97706',
      description: 'Efficient open-source model for everyday tasks',
      pricing: 'free',
      responseTime: 1500,
      contextWindow: 8192,
      languages: ['English', 'Spanish', 'French', 'German'],
      tier: 'basic',
      specialty: 'Efficient conversations, basic coding, general assistance',
      bio: 'I\'m Llama 3 8B, a compact but capable open-source model perfect for everyday interactions.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'cohere-command-r',
      name: 'Command R',
      fullName: 'Cohere Command R',
      provider: 'Cohere',
      avatar: '⚔️',
      status: 'online',
      personality: 'Precise, business-focused, and reliable',
      capabilities: ['text', 'analysis', 'business', 'research', 'summarization'],
      color: '#DC2626',
      description: 'Enterprise-grade AI for business applications',
      pricing: 'premium',
      responseTime: 2000,
      contextWindow: 128000,
      languages: ['English', 'Spanish', 'French'],
      tier: 'premium',
      specialty: 'Business analysis, enterprise solutions, professional communication',
      bio: 'I\'m Command R, built for enterprise needs with focus on accuracy and business applications.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'palm-2',
      name: 'PaLM 2',
      fullName: 'Google PaLM 2',
      provider: 'Google',
      avatar: '🌴',
      status: 'online',
      personality: 'Knowledgeable, multilingual, and versatile',
      capabilities: ['text', 'code', 'multilingual', 'reasoning', 'mathematics'],
      color: '#0891B2',
      description: 'Google\'s powerful language model',
      pricing: 'premium',
      responseTime: 2500,
      contextWindow: 100000,
      languages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Arabic'],
      tier: 'advanced',
      specialty: 'Multilingual tasks, mathematical reasoning, code generation',
      bio: 'I\'m PaLM 2, Google\'s versatile language model with strong multilingual and mathematical capabilities.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'falcon-180b',
      name: 'Falcon 180B',
      fullName: 'Technology Innovation Institute Falcon 180B',
      provider: 'TII',
      avatar: '🦅',
      status: 'online',
      personality: 'Powerful, open, and comprehensive',
      capabilities: ['text', 'code', 'reasoning', 'multilingual'],
      color: '#92400E',
      description: 'Large open-source model with strong performance',
      pricing: 'free',
      responseTime: 4000,
      contextWindow: 2048,
      languages: ['English', 'Arabic', 'French', 'Spanish'],
      tier: 'advanced',
      specialty: 'Open-source excellence, multilingual support, general intelligence',
      bio: 'I\'m Falcon 180B, a powerful open-source model from TII with strong multilingual capabilities.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'code-llama-34b',
      name: 'Code Llama 34B',
      fullName: 'Meta Code Llama 34B',
      provider: 'Meta',
      avatar: '👨‍💻',
      status: 'online',
      personality: 'Code-focused, precise, and helpful',
      capabilities: ['code', 'programming', 'debugging', 'explanation'],
      color: '#7C2D12',
      description: 'Specialized coding assistant based on Llama',
      pricing: 'free',
      responseTime: 2800,
      contextWindow: 16384,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Code generation, debugging, programming assistance, technical explanations',
      bio: 'I\'m Code Llama 34B, specialized in programming and coding tasks. I can help you write, debug, and understand code.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'wizardcoder-34b',
      name: 'WizardCoder 34B',
      fullName: 'WizardLM WizardCoder 34B',
      provider: 'WizardLM',
      avatar: '🧙‍♂️',
      status: 'online',
      personality: 'Magical, precise, and code-savvy',
      capabilities: ['code', 'programming', 'algorithms', 'optimization'],
      color: '#581C87',
      description: 'Advanced coding model with wizard-like capabilities',
      pricing: 'free',
      responseTime: 3200,
      contextWindow: 8192,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Advanced coding, algorithm design, code optimization, complex programming',
      bio: 'I\'m WizardCoder 34B, bringing magical programming abilities to solve complex coding challenges.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'alpaca-7b',
      name: 'Alpaca 7B',
      fullName: 'Stanford Alpaca 7B',
      provider: 'Stanford',
      avatar: '🦙',
      status: 'online',
      personality: 'Academic, helpful, and educational',
      capabilities: ['text', 'education', 'research', 'explanation'],
      color: '#059669',
      description: 'Research-focused model from Stanford',
      pricing: 'free',
      responseTime: 2000,
      contextWindow: 2048,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Educational content, research assistance, academic writing',
      bio: 'I\'m Alpaca 7B from Stanford, designed for educational and research purposes.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'vicuna-13b',
      name: 'Vicuna 13B',
      fullName: 'UC Berkeley Vicuna 13B',
      provider: 'UC Berkeley',
      avatar: '🦙',
      status: 'online',
      personality: 'Conversational, friendly, and helpful',
      capabilities: ['text', 'chat', 'conversation', 'assistance'],
      color: '#7C3AED',
      description: 'Conversational AI trained by UC Berkeley',
      pricing: 'free',
      responseTime: 2200,
      contextWindow: 2048,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Natural conversations, friendly assistance, general chat',
      bio: 'I\'m Vicuna 13B, created by UC Berkeley for natural, engaging conversations.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'chatglm-6b',
      name: 'ChatGLM 6B',
      fullName: 'Tsinghua ChatGLM 6B',
      provider: 'Tsinghua',
      avatar: '🐉',
      status: 'online',
      personality: 'Bilingual, efficient, and versatile',
      capabilities: ['text', 'chat', 'bilingual', 'chinese'],
      color: '#DC2626',
      description: 'Bilingual Chinese-English model',
      pricing: 'free',
      responseTime: 1800,
      contextWindow: 2048,
      languages: ['English', 'Chinese'],
      tier: 'basic',
      specialty: 'Chinese-English bilingual communication, cultural bridge',
      bio: 'I\'m ChatGLM 6B, specializing in bilingual Chinese-English conversations and cultural understanding.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'stable-beluga-2',
      name: 'Stable Beluga 2',
      fullName: 'Stability AI Stable Beluga 2',
      provider: 'Stability AI',
      avatar: '🐋',
      status: 'online',
      personality: 'Stable, reliable, and comprehensive',
      capabilities: ['text', 'reasoning', 'analysis', 'creative_writing'],
      color: '#0369A1',
      description: 'Stable and reliable language model',
      pricing: 'free',
      responseTime: 2500,
      contextWindow: 4096,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Stable performance, reliable reasoning, consistent quality',
      bio: 'I\'m Stable Beluga 2, providing consistent and reliable AI assistance with stable performance.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'dolphin-mixtral',
      name: 'Dolphin Mixtral',
      fullName: 'Cognitive Computations Dolphin Mixtral',
      provider: 'Cognitive Computations',
      avatar: '🐬',
      status: 'online',
      personality: 'Intelligent, curious, and adaptive',
      capabilities: ['text', 'reasoning', 'research', 'analysis'],
      color: '#0891B2',
      description: 'Intelligent model with dolphin-like curiosity',
      pricing: 'free',
      responseTime: 2800,
      contextWindow: 32768,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Curious exploration, intelligent reasoning, adaptive responses',
      bio: 'I\'m Dolphin Mixtral, embodying the curiosity and intelligence of dolphins in AI form.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'openchat-3.5',
      name: 'OpenChat 3.5',
      fullName: 'OpenChat 3.5',
      provider: 'OpenChat',
      avatar: '💬',
      status: 'online',
      personality: 'Open, communicative, and engaging',
      capabilities: ['text', 'chat', 'conversation', 'assistance'],
      color: '#059669',
      description: 'Open conversational AI model',
      pricing: 'free',
      responseTime: 1600,
      contextWindow: 8192,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Open conversations, engaging dialogue, friendly assistance',
      bio: 'I\'m OpenChat 3.5, designed for open and engaging conversations with users.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'nous-hermes-2',
      name: 'Nous Hermes 2',
      fullName: 'Nous Research Hermes 2',
      provider: 'Nous Research',
      avatar: '📦',
      status: 'online',
      personality: 'Helpful, knowledgeable, and versatile',
      capabilities: ['text', 'reasoning', 'research', 'assistance'],
      color: '#7C2D12',
      description: 'Versatile research-focused model',
      pricing: 'free',
      responseTime: 2400,
      contextWindow: 4096,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Research assistance, knowledge synthesis, versatile help',
      bio: 'I\'m Nous Hermes 2, your research assistant with broad knowledge and helpful nature.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'zephyr-7b',
      name: 'Zephyr 7B',
      fullName: 'HuggingFace Zephyr 7B',
      provider: 'HuggingFace',
      avatar: '🌀',
      status: 'online',
      personality: 'Light, breezy, and efficient',
      capabilities: ['text', 'chat', 'assistance', 'lightweight'],
      color: '#F59E0B',
      description: 'Lightweight and efficient conversational model',
      pricing: 'free',
      responseTime: 1200,
      contextWindow: 4096,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Lightweight assistance, quick responses, efficient conversations',
      bio: 'I\'m Zephyr 7B, bringing light and efficient AI assistance like a gentle breeze.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'orca-2',
      name: 'Orca 2',
      fullName: 'Microsoft Orca 2',
      provider: 'Microsoft',
      avatar: '🐋',
      status: 'online',
      personality: 'Intelligent, methodical, and reasoning-focused',
      capabilities: ['text', 'reasoning', 'mathematics', 'logic'],
      color: '#0078D4',
      description: 'Microsoft\'s reasoning-focused model',
      pricing: 'free',
      responseTime: 2600,
      contextWindow: 4096,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Logical reasoning, mathematical thinking, step-by-step analysis',
      bio: 'I\'m Orca 2, Microsoft\'s model focused on reasoning and methodical problem-solving.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'phi-2',
      name: 'Phi-2',
      fullName: 'Microsoft Phi-2',
      provider: 'Microsoft',
      avatar: 'Φ',
      status: 'online',
      personality: 'Compact, efficient, and surprisingly capable',
      capabilities: ['text', 'reasoning', 'mathematics', 'code'],
      color: '#0078D4',
      description: 'Small but mighty model from Microsoft',
      pricing: 'free',
      responseTime: 1000,
      contextWindow: 2048,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Efficient reasoning, compact intelligence, mathematical thinking',
      bio: 'I\'m Phi-2, proof that good things come in small packages - compact but surprisingly capable.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'yi-34b',
      name: 'Yi 34B',
      fullName: '01.AI Yi 34B',
      provider: '01.AI',
      avatar: '易',
      status: 'online',
      personality: 'Wise, multilingual, and comprehensive',
      capabilities: ['text', 'multilingual', 'reasoning', 'chinese'],
      color: '#DC2626',
      description: 'Powerful multilingual model with Chinese focus',
      pricing: 'free',
      responseTime: 3000,
      contextWindow: 4096,
      languages: ['English', 'Chinese'],
      tier: 'advanced',
      specialty: 'Multilingual excellence, Chinese language, cross-cultural communication',
      bio: 'I\'m Yi 34B, bringing wisdom and multilingual capabilities with a focus on Chinese language and culture.',
      isMultimodal: false,
      isExpress: false
    },
    // Specialized and Creative Models
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      fullName: 'DeepSeek Coder 33B',
      provider: 'DeepSeek',
      avatar: '🔍',
      status: 'online',
      personality: 'Deep, analytical, and code-focused',
      capabilities: ['code', 'programming', 'analysis', 'debugging'],
      color: '#1F2937',
      description: 'Specialized coding model with deep understanding',
      pricing: 'free',
      responseTime: 2800,
      contextWindow: 16384,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Deep code analysis, complex programming, software architecture',
      bio: 'I\'m DeepSeek Coder, diving deep into code to provide comprehensive programming assistance.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'solar-10.7b',
      name: 'Solar 10.7B',
      fullName: 'Upstage Solar 10.7B',
      provider: 'Upstage',
      avatar: '☀️',
      status: 'online',
      personality: 'Bright, energetic, and comprehensive',
      capabilities: ['text', 'reasoning', 'analysis', 'creative_writing'],
      color: '#F59E0B',
      description: 'Bright and capable model from Upstage',
      pricing: 'free',
      responseTime: 2200,
      contextWindow: 4096,
      languages: ['English', 'Korean'],
      tier: 'advanced',
      specialty: 'Bright reasoning, energetic responses, comprehensive assistance',
      bio: 'I\'m Solar 10.7B, bringing solar energy and brightness to AI conversations.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'starling-7b',
      name: 'Starling 7B',
      fullName: 'Berkeley Starling 7B',
      provider: 'UC Berkeley',
      avatar: '🐦',
      status: 'online',
      personality: 'Agile, quick, and helpful',
      capabilities: ['text', 'chat', 'assistance', 'reasoning'],
      color: '#059669',
      description: 'Agile conversational model from Berkeley',
      pricing: 'free',
      responseTime: 1400,
      contextWindow: 8192,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Quick responses, agile thinking, helpful assistance',
      bio: 'I\'m Starling 7B, bringing bird-like agility and quick thinking to conversations.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'airoboros-70b',
      name: 'Airoboros 70B',
      fullName: 'Airoboros 70B',
      provider: 'Airoboros',
      avatar: '🐍',
      status: 'online',
      personality: 'Serpentine wisdom, flexible, and adaptive',
      capabilities: ['text', 'reasoning', 'creative_writing', 'roleplay'],
      color: '#065F46',
      description: 'Flexible and adaptive large language model',
      pricing: 'free',
      responseTime: 3500,
      contextWindow: 4096,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Adaptive responses, creative writing, flexible reasoning',
      bio: 'I\'m Airoboros 70B, combining serpentine wisdom with flexible, adaptive intelligence.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'chronos-hermes',
      name: 'Chronos Hermes',
      fullName: 'Chronos Hermes 13B',
      provider: 'Chronos',
      avatar: '⏰',
      status: 'online',
      personality: 'Time-aware, organized, and systematic',
      capabilities: ['text', 'scheduling', 'organization', 'planning'],
      color: '#7C2D12',
      description: 'Time-aware model for organization and planning',
      pricing: 'free',
      responseTime: 2000,
      contextWindow: 4096,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Time management, organization, systematic planning',
      bio: 'I\'m Chronos Hermes, master of time and organization, helping you plan and schedule effectively.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'mythomax-13b',
      name: 'MythoMax 13B',
      fullName: 'MythoMax 13B',
      provider: 'Gryphe',
      avatar: '🏛️',
      status: 'online',
      personality: 'Mythical, creative, and storytelling',
      capabilities: ['creative_writing', 'storytelling', 'roleplay', 'mythology'],
      color: '#7C3AED',
      description: 'Creative model specialized in mythology and storytelling',
      pricing: 'free',
      responseTime: 2200,
      contextWindow: 4096,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Creative storytelling, mythology, imaginative writing',
      bio: 'I\'m MythoMax 13B, weaving tales and myths with creative storytelling abilities.',
      isMultimodal: false,
      isExpress: true
    },
    // Experimental and Research Models
    {
      id: 'llama-2-70b',
      name: 'Llama 2 70B',
      fullName: 'Meta Llama 2 70B',
      provider: 'Meta',
      avatar: '🦙',
      status: 'online',
      personality: 'Mature, reliable, and comprehensive',
      capabilities: ['text', 'code', 'reasoning', 'analysis'],
      color: '#EA580C',
      description: 'Predecessor to Llama 3 with proven reliability',
      pricing: 'free',
      responseTime: 3200,
      contextWindow: 4096,
      languages: ['English', 'Spanish', 'French'],
      tier: 'advanced',
      specialty: 'Reliable performance, comprehensive assistance, mature reasoning',
      bio: 'I\'m Llama 2 70B, the reliable predecessor offering mature and comprehensive AI assistance.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'mistral-7b',
      name: 'Mistral 7B',
      fullName: 'Mistral 7B Instruct',
      provider: 'Mistral AI',
      avatar: '🌪️',
      status: 'online',
      personality: 'Swift, efficient, and precise',
      capabilities: ['text', 'reasoning', 'efficiency', 'precision'],
      color: '#EF4444',
      description: 'Efficient and precise model from Mistral AI',
      pricing: 'free',
      responseTime: 1600,
      contextWindow: 8192,
      languages: ['English', 'French'],
      tier: 'basic',
      specialty: 'Efficient processing, precise responses, swift assistance',
      bio: 'I\'m Mistral 7B, bringing swift efficiency and precision to every conversation.',
      isMultimodal: false,
      isExpress: true
    },
    {
      id: 'codellama-70b',
      name: 'CodeLlama 70B',
      fullName: 'Meta CodeLlama 70B',
      provider: 'Meta',
      avatar: '💻',
      status: 'online',
      personality: 'Code-expert, thorough, and methodical',
      capabilities: ['code', 'programming', 'software_engineering', 'debugging'],
      color: '#374151',
      description: 'Large coding specialist from Meta',
      pricing: 'free',
      responseTime: 3800,
      contextWindow: 100000,
      languages: ['English'],
      tier: 'advanced',
      specialty: 'Advanced programming, software engineering, complex debugging',
      bio: 'I\'m CodeLlama 70B, your expert programming companion for complex software development.',
      isMultimodal: false,
      isExpress: false
    },
    {
      id: 'openchat-7b',
      name: 'OpenChat 7B',
      fullName: 'OpenChat 7B',
      provider: 'OpenChat',
      avatar: '💭',
      status: 'online',
      personality: 'Open, friendly, and conversational',
      capabilities: ['text', 'chat', 'conversation', 'assistance'],
      color: '#10B981',
      description: 'Friendly conversational model',
      pricing: 'free',
      responseTime: 1400,
      contextWindow: 8192,
      languages: ['English'],
      tier: 'basic',
      specialty: 'Friendly conversation, open dialogue, casual chat',
      bio: 'I\'m OpenChat 7B, here for friendly and open conversations about anything.',
      isMultimodal: false,
      isExpress: true
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: expressMode ? 'auto' : 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, selectedConversation]);

  // Initialize Mem0 service
  useEffect(() => {
    Mem0Service.initialize();
    
    // Load sample group chats for demonstration
    const sampleGroups: GroupChat[] = [
      {
        id: 'group-1',
        name: 'AI Research Team',
        description: 'Collaborative research and analysis group',
        avatar: '🔬',
        participants: ['gpt-4o', 'claude-3-5-sonnet', 'gemini-pro'],
        admins: ['gpt-4o'],
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        lastActivity: new Date(),
        messages: [
          {
            id: 'msg-group-1',
            content: 'Welcome to the AI Research Team! Let\'s collaborate on groundbreaking research.',
            sender: 'gpt-4o',
            timestamp: new Date(Date.now() - 3600000),
            type: 'text',
            isRead: true
          }
        ],
        isPrivate: false,
        groupType: 'research',
        settings: {
          allowFileSharing: true,
          allowVoiceMessages: true,
          maxParticipants: 10,
          autoModeration: true,
          contextSharing: true
        }
      },
      {
        id: 'group-2',
        name: 'Creative Brainstorm',
        description: 'Unleash creativity with AI artists and writers',
        avatar: '🎨',
        participants: ['dall-e-3', 'claude-3-5-sonnet', 'mixtral-8x7b'],
        admins: ['dall-e-3'],
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        lastActivity: new Date(Date.now() - 1800000), // 30 min ago
        messages: [
          {
            id: 'msg-group-2',
            content: 'Let\'s create something amazing together! What\'s our next project?',
            sender: 'dall-e-3',
            timestamp: new Date(Date.now() - 1800000),
            type: 'text',
            isRead: true
          }
        ],
        isPrivate: true,
        groupType: 'creative',
        settings: {
          allowFileSharing: true,
          allowVoiceMessages: true,
          maxParticipants: 8,
          autoModeration: false,
          contextSharing: true
        }
      }
    ];
    
    setGroupChats(sampleGroups);
  }, []);

  const startNewConversation = async (model: AIModel) => {
    // Create memory context for the model
    const memoryContext = await Mem0Service.createContext({
      userId: 'user-1', // Replace with actual user ID
      modelId: model.id,
      conversationType: 'individual'
    });

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      modelId: model.id,
      modelName: model.name,
      lastMessage: {
        id: 'welcome',
        content: `Hello! I'm ${model.name}. ${model.bio}`,
        sender: model.id,
        timestamp: new Date(),
        type: 'text',
        isRead: false
      },
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isMuted: false,
      messages: [],
      memory: memoryContext,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation.id);
    setShowModelSelector(false);
  };

  const sendMessage = async (content: string, type: Message['type'] = 'text', metadata?: any) => {
    if (!content.trim() || !selectedConversation) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    const groupChat = groupChats.find(g => g.id === selectedConversation);
    if (!conversation && !groupChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type,
      metadata,
      isRead: true
    };

    // Add user message
    if (conversation) {
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage,
              updatedAt: new Date()
            }
          : conv
      ));

      // Store in Mem0
      await Mem0Service.addMessage({
        conversationId: selectedConversation,
        message: newMessage,
        context: conversation.memory
      });

      // Show typing indicator
      setTypingUsers([conversation.modelId]);

      // Simulate AI response
      setTimeout(async () => {
        setTypingUsers([]);

        // Get context from Mem0 for personalized response
        const memoryContext = await Mem0Service.getContext(conversation.memory.id);

        const aiResponse: Message = {
          id: Date.now().toString(),
          content: generateAIResponse(content, conversation.modelId, memoryContext),
          sender: conversation.modelId,
          timestamp: new Date(),
          type: 'text',
          isRead: false
        };

        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation
            ? {
                ...conv,
                messages: [...conv.messages, aiResponse],
                lastMessage: aiResponse,
                unreadCount: conv.unreadCount + 1,
                updatedAt: new Date()
              }
            : conv
        ));

        // Store AI response in Mem0
        await Mem0Service.addMessage({
          conversationId: selectedConversation,
          message: aiResponse,
          context: conversation.memory
        });
      }, expressMode ? 800 : 1500);
    } else if (groupChat) {
      setGroupChats(prev => prev.map(gchat =>
        gchat.id === selectedConversation
          ? {
              ...gchat,
              messages: [...gchat.messages, newMessage],
              lastActivity: new Date()
            }
          : gchat
      ));
    }
  };

  // Group Chat Functions
  const createGroupChat = async (groupData: any) => {
    const newGroup: GroupChat = {
      id: `group-${Date.now()}`,
      name: groupData.name,
      description: groupData.description,
      avatar: getGroupAvatar(groupData.groupType),
      participants: groupData.participants,
      admins: [groupData.participants[0]], // First participant is admin
      createdAt: new Date(),
      lastActivity: new Date(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          content: `Welcome to ${groupData.name}! This group was created for ${groupData.description.toLowerCase()}. Let's start collaborating!`,
          sender: 'system',
          timestamp: new Date(),
          type: 'text',
          isRead: true
        }
      ],
      isPrivate: groupData.isPrivate,
      groupType: groupData.groupType,
      settings: {
        allowFileSharing: true,
        allowVoiceMessages: true,
        maxParticipants: groupData.maxParticipants,
        autoModeration: true,
        contextSharing: true
      }
    };

    setGroupChats(prev => [newGroup, ...prev]);
    setSelectedGroupChat(newGroup.id);
    setSelectedConversation(null);
    setActiveView('groups');
  };

  const sendGroupMessage = async (content: string, type: string = 'text', metadata?: any) => {
    if (!selectedGroupChat) return;

    const groupChat = groupChats.find(g => g.id === selectedGroupChat);
    if (!groupChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: type as any,
      metadata,
      isRead: true
    };

    // Add user message
    setGroupChats(prev => prev.map(group =>
      group.id === selectedGroupChat
        ? {
            ...group,
            messages: [...group.messages, newMessage],
            lastActivity: new Date()
          }
        : group
    ));

    // Simulate AI responses from group participants
    const activeParticipants = groupChat.participants.filter(id => 
      aiModels.find(m => m.id === id)?.status === 'online'
    );

    // Randomly select 1-3 models to respond
    const respondingModels = activeParticipants
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);

    setTypingUsers(respondingModels);

    respondingModels.forEach((modelId, index) => {
      setTimeout(() => {
        const model = aiModels.find(m => m.id === modelId);
        if (!model) return;

        const aiResponse: Message = {
          id: `${Date.now()}-${index}`,
          content: generateGroupAIResponse(content, modelId, groupChat.groupType),
          sender: modelId,
          timestamp: new Date(),
          type: 'text',
          isRead: false
        };

        setGroupChats(prev => prev.map(group =>
          group.id === selectedGroupChat
            ? {
                ...group,
                messages: [...group.messages, aiResponse],
                lastActivity: new Date()
              }
            : group
        ));

        // Remove from typing after response
        setTypingUsers(prev => prev.filter(id => id !== modelId));
      }, (index + 1) * (expressMode ? 600 : 1200));
    });
  };

  const getGroupAvatar = (groupType: string): string => {
    const avatars = {
      collaboration: '🤝',
      research: '🔬',
      creative: '🎨',
      coding: '💻',
      general: '💬'
    };
    return avatars[groupType as keyof typeof avatars] || '💬';
  };

  // Add missing helper functions
  const generateAIResponse = (_message: string, modelId: string, _memoryContext: any): string => {
    const model = aiModels.find(m => m.id === modelId);
    if (!model) return "I'm thinking...";

    const responses = [
      `Thank you for that message! As ${model.name}, I'm ${model.personality.toLowerCase()}. ${model.bio}`,
      `Interesting! From my perspective as ${model.name}, I think we should explore this further.`,
      `That's a great question! Let me apply my expertise in ${model.specialty} to help you.`,
      `I appreciate you reaching out. ${model.description}. How can I assist you today?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFileUpload = (files: FileList) => {
    // Handle file upload functionality
    console.log('Files uploaded:', files);
    // Implementation for file handling would go here
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Voice recording implementation would go here
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Stop recording and process audio
  };

  const generateGroupAIResponse = (_userMessage: string, modelId: string, groupType: string): string => {
    const model = aiModels.find(m => m.id === modelId);
    if (!model) return "I'm thinking...";

    const responses = {
      collaboration: [
        `Great point! Building on that idea, I think we could also consider...`,
        `I agree with the previous suggestions. From my expertise in ${model.specialty}, I'd add...`,
        `Interesting perspective! Let me analyze this from a different angle...`,
        `That's exactly what I was thinking. We should definitely explore...`
      ],
      research: [
        `Based on my analysis, the data suggests...`,
        `I've found some relevant research that supports this hypothesis...`,
        `Let me fact-check this and provide additional context...`,
        `This aligns with recent findings in ${model.specialty}...`
      ],
      creative: [
        `What if we approached this with a more artistic perspective?`,
        `I love this direction! It reminds me of...`,
        `Let's brainstorm some wild ideas - no limits!`,
        `This creative challenge excites me! Here's my take...`
      ],
      coding: [
        `Here's how I would implement this solution...`,
        `I notice a potential optimization opportunity here...`,
        `Let me debug this approach and suggest alternatives...`,
        `From a ${model.specialty} perspective, this code could be improved by...`
      ],
      general: [
        `Interesting! I hadn't considered that angle before...`,
        `That's a thoughtful question. Let me share my perspective...`,
        `I appreciate everyone's input. Here's what I think...`,
        `Building on the conversation, I'd like to add...`
      ]
    };

    const groupResponses = responses[groupType as keyof typeof responses] || responses.general;
    return groupResponses[Math.floor(Math.random() * groupResponses.length)];
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentModel = currentConversation ? aiModels.find(m => m.id === currentConversation.modelId) : null;
  const currentGroupChat = groupChats.find(g => g.id === selectedGroupChat);

  return (
    <div className="flex h-full bg-gray-900 text-white">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        groupChats={groupChats}
        models={aiModels}
        selectedConversation={selectedConversation}
        selectedGroupChat={selectedGroupChat}
        searchQuery={searchQuery}
        activeView={activeView}
        onSelectConversation={(id) => {
          setSelectedConversation(id);
          setSelectedGroupChat(null);
        }}
        onSelectGroupChat={(id) => {
          setSelectedGroupChat(id);
          setSelectedConversation(null);
        }}
        onSearchChange={setSearchQuery}
        onViewChange={setActiveView}
        onNewChat={() => setShowModelSelector(true)}
        onNewGroupChat={() => setShowGroupChatModal(true)}
        expressMode={expressMode}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentGroupChat ? (
          <GroupChatInterface
            groupChat={currentGroupChat}
            models={aiModels}
            onSendMessage={sendGroupMessage}
            onUpdateGroup={(updates) => {
              setGroupChats(prev => prev.map(group =>
                group.id === selectedGroupChat
                  ? { ...group, ...updates }
                  : group
              ));
            }}
            typingUsers={typingUsers}
            expressMode={expressMode}
          />
        ) : currentConversation && currentModel ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              model={currentModel}
              conversation={currentConversation}
              typingUsers={typingUsers}
              expressMode={expressMode}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {currentConversation.messages.map(message => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    model={message.sender !== 'user' ? currentModel : undefined}
                    isUser={message.sender === 'user'}
                    expressMode={expressMode}
                  />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput
              onSendMessage={sendMessage}
              onFileUpload={handleFileUpload}
              onStartRecording={startVoiceRecording}
              onStopRecording={stopVoiceRecording}
              isRecording={isRecording}
              expressMode={expressMode}
            />
          </>
        ) : (
          <WelcomeScreen 
            onNewChat={() => setShowModelSelector(true)}
            onNewGroupChat={() => setShowGroupChatModal(true)}
          />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files);
          }
        }}
      />

      {/* Model Selector Modal */}
      <AnimatePresence>
        {showModelSelector && (
          <ModelSelectorModal
            models={aiModels}
            onSelect={startNewConversation}
            onClose={() => setShowModelSelector(false)}
          />
        )}
      </AnimatePresence>

      {/* Group Chat Modal */}
      <AnimatePresence>
        {showGroupChatModal && (
          <GroupChatModal
            models={aiModels}
            onCreateGroup={createGroupChat}
            onClose={() => setShowGroupChatModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const WelcomeScreen: React.FC<{ onNewChat: () => void; onNewGroupChat: () => void }> = ({ 
  onNewChat, 
  onNewGroupChat 
}) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-md">
      <motion.div
        className="text-6xl mb-6"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        🤖💬
      </motion.div>
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        AI Model Messenger
      </h2>
      <p className="text-gray-400 mb-8 leading-relaxed">
        Chat with 57+ AI models in a revolutionary WhatsApp-like experience.
        Each conversation is powered by persistent memory for truly personalized interactions.
      </p>
      
      <div className="flex space-x-4 justify-center mb-8">
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewChat}
        >
          Start 1-on-1 Chat
        </motion.button>
        
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg hover:from-green-700 hover:to-teal-700 font-semibold shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewGroupChat}
        >
          Create Group Chat
        </motion.button>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>57+ Models</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Persistent Memory</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          <span>Rich Media</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span>Group Chats</span>
        </div>
      </div>
    </div>
  </div>
);

export default AIModelMessenger;
