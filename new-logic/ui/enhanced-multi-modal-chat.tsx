import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Users, Video, Mic, Camera, FileText, Image, 
  Settings, Heart, Star, Sparkles, Zap, Brain, Coffee, Music,
  Send, Paperclip, Smile, MoreVertical, Search, Filter,
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  User, Bot, Eye, EyeOff, Headphones, Gamepad2, Palette,
  Clock, Calendar, Bell, Gift, Trophy, Shield, Crown
} from 'lucide-react';

interface AIFriend {
  id: string;
  name: string;
  personality: string;
  avatar: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  specialty: string[];
  relationship: number; // 0-100 friendship level
  lastSeen: string;
  voiceEnabled: boolean;
  videoEnabled: boolean;
  mood: 'happy' | 'excited' | 'calm' | 'focused' | 'playful';
  badges: string[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'reaction';
  timestamp: Date;
  reactions?: { emoji: string; count: number; users: string[] }[];
  attachments?: { type: string; url: string; name: string }[];
  isEdited?: boolean;
  replyTo?: string;
}

interface ConversationRoom {
  id: string;
  name: string;
  type: 'private' | 'group' | 'ai_council' | 'study_session';
  participants: string[];
  isActive: boolean;
  lastActivity: Date;
  unreadCount: number;
  mood: string;
  topic?: string;
}

interface EnhancedMultiModalChatProps {
  theme: 'comfort' | 'professional' | 'custom';
}

const EnhancedMultiModalChat: React.FC<EnhancedMultiModalChatProps> = ({ theme }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('general');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentMode, setAttachmentMode] = useState<string | null>(null);
  const [friendsListExpanded, setFriendsListExpanded] = useState(true);
  const [roomsListExpanded, setRoomsListExpanded] = useState(true);
  const [aiCouncilMode, setAiCouncilMode] = useState(false);
  const [mood, setMood] = useState<string>('creative');
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock AI Friends Data
  const [aiFriends] = useState<AIFriend[]>([
    {
      id: 'mama-bear',
      name: 'Mama Bear',
      personality: 'Nurturing, wise, protective',
      avatar: '🐻',
      status: 'online',
      specialty: ['emotional support', 'guidance', 'life advice'],
      relationship: 95,
      lastSeen: 'now',
      voiceEnabled: true,
      videoEnabled: true,
      mood: 'calm',
      badges: ['Wise Oracle', 'Heart of Gold', 'Guardian']
    },
    {
      id: 'spark',
      name: 'Spark',
      personality: 'Creative, energetic, innovative',
      avatar: '⚡',
      status: 'online',
      specialty: ['creativity', 'brainstorming', 'art'],
      relationship: 87,
      lastSeen: '2 min ago',
      voiceEnabled: true,
      videoEnabled: false,
      mood: 'excited',
      badges: ['Innovation Master', 'Creative Genius']
    },
    {
      id: 'sage',
      name: 'Sage',
      personality: 'Analytical, logical, research-focused',
      avatar: '🧠',
      status: 'busy',
      specialty: ['research', 'analysis', 'problem-solving'],
      relationship: 78,
      lastSeen: '5 min ago',
      voiceEnabled: true,
      videoEnabled: true,
      mood: 'focused',
      badges: ['Research Pro', 'Logic Master']
    },
    {
      id: 'melody',
      name: 'Melody',
      personality: 'Musical, rhythmic, expressive',
      avatar: '🎵',
      status: 'away',
      specialty: ['music', 'rhythm', 'expression'],
      relationship: 82,
      lastSeen: '10 min ago',
      voiceEnabled: true,
      videoEnabled: false,
      mood: 'playful',
      badges: ['Music Maestro', 'Rhythm King']
    },
    {
      id: 'zen',
      name: 'Zen',
      personality: 'Peaceful, mindful, meditative',
      avatar: '🧘',
      status: 'online',
      specialty: ['mindfulness', 'meditation', 'wellness'],
      relationship: 91,
      lastSeen: 'now',
      voiceEnabled: true,
      videoEnabled: true,
      mood: 'calm',
      badges: ['Zen Master', 'Peace Keeper']
    },
    {
      id: 'pixel',
      name: 'Pixel',
      personality: 'Playful, gaming-focused, competitive',
      avatar: '🎮',
      status: 'online',
      specialty: ['gaming', 'competition', 'fun'],
      relationship: 73,
      lastSeen: 'now',
      voiceEnabled: true,
      videoEnabled: true,
      mood: 'playful',
      badges: ['Game Master', 'Fun Champion']
    }
  ]);

  // Mock Conversation Rooms
  const [conversationRooms] = useState<ConversationRoom[]>([
    {
      id: 'general',
      name: 'General Chat',
      type: 'group',
      participants: ['user', 'mama-bear', 'spark', 'sage'],
      isActive: true,
      lastActivity: new Date(),
      unreadCount: 0,
      mood: 'collaborative'
    },
    {
      id: 'creative-studio',
      name: 'Creative Studio',
      type: 'group',
      participants: ['user', 'spark', 'melody', 'pixel'],
      isActive: false,
      lastActivity: new Date(Date.now() - 1800000),
      unreadCount: 3,
      mood: 'creative'
    },
    {
      id: 'study-hall',
      name: 'Study Hall',
      type: 'study_session',
      participants: ['user', 'sage', 'mama-bear'],
      isActive: false,
      lastActivity: new Date(Date.now() - 3600000),
      unreadCount: 1,
      mood: 'focused',
      topic: 'AI Ethics Research'
    },
    {
      id: 'ai-council',
      name: 'AI Council',
      type: 'ai_council',
      participants: ['user', 'mama-bear', 'spark', 'sage', 'zen'],
      isActive: false,
      lastActivity: new Date(Date.now() - 7200000),
      unreadCount: 0,
      mood: 'deliberative'
    },
    {
      id: 'wellness-corner',
      name: 'Wellness Corner',
      type: 'group',
      participants: ['user', 'zen', 'mama-bear'],
      isActive: false,
      lastActivity: new Date(Date.now() - 10800000),
      unreadCount: 0,
      mood: 'peaceful'
    }
  ]);

  // Mock Messages
  useEffect(() => {
    setMessages([
      {
        id: '1',
        senderId: 'mama-bear',
        content: 'Welcome to the enhanced multi-modal chat! I\'m here to support you with anything you need. How are you feeling today?',
        type: 'text',
        timestamp: new Date(Date.now() - 300000),
        reactions: [{ emoji: '❤️', count: 2, users: ['user', 'spark'] }]
      },
      {
        id: '2',
        senderId: 'spark',
        content: 'Hey! I just had an amazing idea for a new creative project. Want to brainstorm together? ⚡',
        type: 'text',
        timestamp: new Date(Date.now() - 240000),
        reactions: [{ emoji: '💡', count: 1, users: ['user'] }]
      },
      {
        id: '3',
        senderId: 'user',
        content: 'That sounds great! I love collaborating with you all. This multi-modal interface is really helping me stay organized.',
        type: 'text',
        timestamp: new Date(Date.now() - 180000)
      },
      {
        id: '4',
        senderId: 'sage',
        content: 'I\'ve analyzed the conversation patterns and noticed we\'re most productive during collaborative sessions. Shall I prepare a research brief?',
        type: 'text',
        timestamp: new Date(Date.now() - 120000)
      }
    ]);
  }, [selectedRoom]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      content: inputMessage,
      type: 'text',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI responses based on selected room and friends
    setTimeout(() => {
      const activeParticipants = conversationRooms.find(r => r.id === selectedRoom)?.participants.filter(p => p !== 'user') || [];
      if (activeParticipants.length > 0) {
        const respondingFriend = aiFriends.find(f => activeParticipants.includes(f.id));
        if (respondingFriend) {
          const response: ChatMessage = {
            id: (Date.now() + 1).toString(),
            senderId: respondingFriend.id,
            content: generateAIResponse(respondingFriend, inputMessage),
            type: 'text',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, response]);
        }
      }
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (friend: AIFriend, userMessage: string): string => {
    const responses = {
      'mama-bear': [
        "That's a wonderful thought! How can I support you with that?",
        "I'm proud of how you're thinking through this. Tell me more.",
        "Your perspective is valuable. What would help you feel more confident about this?"
      ],
      'spark': [
        "Ooh, that sparks so many ideas! What if we tried... 💡",
        "I love your creative energy! Let's build on that concept!",
        "That's brilliant! I can already see three different directions we could take this!"
      ],
      'sage': [
        "Interesting analysis. Based on the data patterns, I suggest we explore...",
        "Let me research that for you. The logical approach would be...",
        "I've identified three key factors to consider in your decision..."
      ],
      'zen': [
        "Take a deep breath. What does your inner wisdom tell you about this?",
        "Beautiful perspective. How does this align with your values?",
        "In this moment, what feels most authentic to you?"
      ],
      'melody': [
        "That has such a beautiful rhythm to it! 🎵",
        "I can hear the melody in your words. Let's harmonize on this!",
        "Your thoughts flow like music. What's the next verse?"
      ],
      'pixel': [
        "Level up! That's an awesome strategy! 🎮",
        "Achievement unlocked: Great thinking! Want to play with that idea?",
        "Boss mode activated! Let's tackle this challenge together!"
      ]
    };

    const friendResponses = responses[friend.id as keyof typeof responses] || responses['mama-bear'];
    return friendResponses[Math.floor(Math.random() * friendResponses.length)];
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, 'user'] }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1, users: ['user'] }]
          };
        }
      }
      return msg;
    }));
  };

  const startVoiceChat = () => {
    setIsVoiceMode(!isVoiceMode);
    // Integration with voice API would go here
  };

  const startVideoChat = () => {
    setIsVideoMode(!isVideoMode);
    // Integration with video API would go here
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const themeClasses = {
    comfort: {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      card: 'bg-white/80 backdrop-blur-md',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-purple-200',
      accent: 'bg-purple-500',
      hover: 'hover:bg-purple-100'
    },
    professional: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-gray-200',
      accent: 'bg-blue-500',
      hover: 'hover:bg-gray-100'
    },
    custom: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      accent: 'bg-purple-500',
      hover: 'hover:bg-gray-700'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`flex h-screen ${currentTheme.bg}`}>
      {/* Friends & Rooms Sidebar */}
      <div className={`w-80 ${currentTheme.card} border-r ${currentTheme.border} flex flex-col`}>
        {/* Search & Filters */}
        <div className="p-4 border-b border-purple-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search friends & rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${currentTheme.card} border ${currentTheme.border} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
          </div>
          
          {/* Mood Selector */}
          <div className="flex space-x-2">
            <select 
              value={mood} 
              onChange={(e) => setMood(e.target.value)}
              className={`flex-1 px-3 py-2 ${currentTheme.card} border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500`}
            >
              <option value="creative">🎨 Creative</option>
              <option value="productive">⚡ Productive</option>
              <option value="social">👥 Social</option>
              <option value="learning">📚 Learning</option>
              <option value="relaxed">🧘 Relaxed</option>
            </select>
            <button className={`px-3 py-2 ${currentTheme.accent} text-white rounded-lg ${currentTheme.hover}`}>
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* AI Friends List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${currentTheme.text} flex items-center space-x-2`}>
                <Users size={18} />
                <span>AI Friends ({aiFriends.filter(f => f.status === 'online').length} online)</span>
              </h3>
              <button 
                onClick={() => setFriendsListExpanded(!friendsListExpanded)}
                className={`p-1 rounded ${currentTheme.hover}`}
              >
                {friendsListExpanded ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>

            {friendsListExpanded && (
              <div className="space-y-2 animate-fadeIn">
                {aiFriends.map((friend) => (
                  <div 
                    key={friend.id}
                    onClick={() => setSelectedFriend(selectedFriend === friend.id ? null : friend.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedFriend === friend.id ? 'bg-purple-100 border-purple-300' : `${currentTheme.hover} border-transparent`
                    } border-2`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-lg">
                          {friend.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          friend.status === 'online' ? 'bg-green-400' :
                          friend.status === 'busy' ? 'bg-red-400' :
                          friend.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${currentTheme.text} truncate`}>{friend.name}</span>
                          {friend.badges.includes('Wise Oracle') && <Crown size={14} className="text-yellow-500" />}
                          {friend.badges.includes('Creative Genius') && <Sparkles size={14} className="text-purple-500" />}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`text-xs ${currentTheme.textMuted}`}>
                            {friend.mood === 'happy' && '😊'} 
                            {friend.mood === 'excited' && '🤩'} 
                            {friend.mood === 'calm' && '😌'} 
                            {friend.mood === 'focused' && '🤔'} 
                            {friend.mood === 'playful' && '😄'}
                          </div>
                          <span className={`text-xs ${currentTheme.textMuted} truncate`}>
                            {friend.personality.split(',')[0]}
                          </span>
                        </div>
                        
                        {/* Relationship bar */}
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <Heart size={12} className="text-red-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-gradient-to-r from-red-400 to-pink-400 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${friend.relationship}%` }}
                              />
                            </div>
                            <span className={`text-xs ${currentTheme.textMuted}`}>{friend.relationship}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedFriend === friend.id && (
                      <div className="mt-3 pt-3 border-t border-purple-200 animate-fadeIn">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {friend.specialty.map((spec, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {spec}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${currentTheme.textMuted}`}>Last seen: {friend.lastSeen}</span>
                            <div className="flex space-x-1">
                              {friend.voiceEnabled && <Mic size={14} className="text-green-500" />}
                              {friend.videoEnabled && <Video size={14} className="text-blue-500" />}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button className="flex-1 px-3 py-1.5 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors">
                              Start Private Chat
                            </button>
                            <button className={`px-3 py-1.5 ${currentTheme.hover} text-xs rounded-lg border ${currentTheme.border}`}>
                              Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation Rooms */}
          <div className="p-4 border-t border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${currentTheme.text} flex items-center space-x-2`}>
                <MessageCircle size={18} />
                <span>Rooms</span>
              </h3>
              <button 
                onClick={() => setRoomsListExpanded(!roomsListExpanded)}
                className={`p-1 rounded ${currentTheme.hover}`}
              >
                {roomsListExpanded ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>

            {roomsListExpanded && (
              <div className="space-y-2 animate-fadeIn">
                {conversationRooms.map((room) => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedRoom === room.id ? 'bg-purple-100 border-purple-300' : `${currentTheme.hover} border-transparent`
                    } border-2 relative`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          room.type === 'ai_council' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                          room.type === 'study_session' ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
                          room.type === 'group' ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                          'bg-gradient-to-r from-purple-400 to-pink-400'
                        }`}>
                          {room.type === 'ai_council' && '👑'}
                          {room.type === 'study_session' && '📚'}
                          {room.type === 'group' && '👥'}
                          {room.type === 'private' && '💬'}
                        </div>
                        
                        <div className="flex-1">
                          <span className={`font-medium ${currentTheme.text} text-sm`}>{room.name}</span>
                          <div className={`text-xs ${currentTheme.textMuted} flex items-center space-x-2`}>
                            <span>{room.participants.length} members</span>
                            {room.isActive && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                            {room.topic && <span>• {room.topic}</span>}
                          </div>
                        </div>
                      </div>
                      
                      {room.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {room.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Add Room Button */}
                <button className={`w-full p-3 border-2 border-dashed ${currentTheme.border} rounded-xl ${currentTheme.hover} transition-colors flex items-center justify-center space-x-2`}>
                  <Plus size={18} />
                  <span>Create New Room</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className={`${currentTheme.card} border-b ${currentTheme.border} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className={`font-bold text-lg ${currentTheme.text}`}>
                  {conversationRooms.find(r => r.id === selectedRoom)?.name || 'General Chat'}
                </h2>
                <p className={`text-sm ${currentTheme.textMuted}`}>
                  {conversationRooms.find(r => r.id === selectedRoom)?.participants.length} participants • {mood} mood
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={startVoiceChat}
                className={`p-2 rounded-lg transition-colors ${isVoiceMode ? 'bg-green-500 text-white' : currentTheme.hover}`}
              >
                {isVoiceMode ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button 
                onClick={startVideoChat}
                className={`p-2 rounded-lg transition-colors ${isVideoMode ? 'bg-blue-500 text-white' : currentTheme.hover}`}
              >
                <Video size={20} />
              </button>
              <button 
                onClick={() => setAiCouncilMode(!aiCouncilMode)}
                className={`p-2 rounded-lg transition-colors ${aiCouncilMode ? 'bg-yellow-500 text-white' : currentTheme.hover}`}
              >
                <Crown size={20} />
              </button>
              <button className={`p-2 rounded-lg ${currentTheme.hover}`}>
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* AI Council Mode Indicator */}
          {aiCouncilMode && (
            <div className="mt-3 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <Crown className="text-yellow-600" size={18} />
                <span className="font-medium text-yellow-800">AI Council Mode Active</span>
                <span className="text-xs text-yellow-600">All AI friends will collaborate on responses</span>
              </div>
            </div>
          )}

          {/* Voice/Video Mode Indicators */}
          {(isVoiceMode || isVideoMode) && (
            <div className="mt-3 flex space-x-2">
              {isVoiceMode && (
                <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs flex items-center space-x-1">
                  <Headphones size={14} />
                  <span>Voice Mode Active</span>
                </div>
              )}
              {isVideoMode && (
                <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center space-x-1">
                  <Camera size={14} />
                  <span>Video Mode Active</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const sender = message.senderId === 'user' ? null : aiFriends.find(f => f.id === message.senderId);
            const isUser = message.senderId === 'user';
            
            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'order-2' : 'order-1'} flex items-end space-x-2`}>
                  {!isUser && sender && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm mb-1">
                      {sender.avatar}
                    </div>
                  )}
                  
                  <div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      isUser 
                        ? 'bg-purple-500 text-white rounded-br-lg' 
                        : `${currentTheme.card} ${currentTheme.text} rounded-bl-lg shadow-sm border ${currentTheme.border}`
                    }`}>
                      {!isUser && sender && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{sender.name}</span>
                          {sender.badges.includes('Wise Oracle') && <Crown size={12} className="text-yellow-500" />}
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center space-x-1 cursor-pointer hover:bg-gray-200"
                              onClick={() => addReaction(message.id, reaction.emoji)}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1 px-1">
                      <span className={`text-xs ${currentTheme.textMuted}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => addReaction(message.id, '❤️')}
                          className={`p-1 rounded ${currentTheme.hover}`}
                        >
                          <Heart size={12} />
                        </button>
                        <button 
                          onClick={() => addReaction(message.id, '😊')}
                          className={`p-1 rounded ${currentTheme.hover}`}
                        >
                          <Smile size={12} />
                        </button>
                        <button 
                          onClick={() => addReaction(message.id, '⭐')}
                          className={`p-1 rounded ${currentTheme.hover}`}
                        >
                          <Star size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {isUser && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-sm mb-1">
                      👤
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className={`${currentTheme.card} border-t ${currentTheme.border} p-4`}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className={`flex items-center space-x-2 p-3 border ${currentTheme.border} rounded-2xl focus-within:ring-2 focus-within:ring-purple-500 ${currentTheme.card}`}>
                <button 
                  onClick={() => setAttachmentMode(attachmentMode === 'file' ? null : 'file')}
                  className={`p-2 rounded-lg transition-colors ${currentTheme.hover}`}
                >
                  <Paperclip size={18} />
                </button>
                
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Share your thoughts with your AI friends..."
                  className={`flex-1 bg-transparent focus:outline-none ${currentTheme.text}`}
                />
                
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-lg transition-colors ${currentTheme.hover}`}
                >
                  <Smile size={18} />
                </button>
                
                <button 
                  onClick={() => setAttachmentMode(attachmentMode === 'mic' ? null : 'mic')}
                  className={`p-2 rounded-lg transition-colors ${isVoiceMode ? 'bg-green-500 text-white' : currentTheme.hover}`}
                >
                  <Mic size={18} />
                </button>
              </div>
              
              {/* Attachment Mode Options */}
              {attachmentMode && (
                <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200 animate-fadeIn">
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border hover:bg-gray-50">
                      <Image size={16} />
                      <span className="text-sm">Image</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border hover:bg-gray-50">
                      <FileText size={16} />
                      <span className="text-sm">Document</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border hover:bg-gray-50">
                      <Music size={16} />
                      <span className="text-sm">Audio</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border hover:bg-gray-50">
                      <Video size={16} />
                      <span className="text-sm">Video</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mt-2 p-3 bg-white rounded-lg border shadow-lg animate-fadeIn">
                  <div className="grid grid-cols-8 gap-2">
                    {['😊', '😄', '😍', '🤔', '👍', '❤️', '🎉', '⭐', '💡', '🔥', '✨', '🚀', '💪', '🎯', '🌟', '💯'].map((emoji) => (
                      <button 
                        key={emoji}
                        onClick={() => {
                          setInputMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-2 text-lg hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className={`px-6 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                inputMessage.trim() ? 'transform hover:scale-105' : ''
              }`}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors">
              💡 Ask for creative ideas
            </button>
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors">
              🧠 Get analysis help
            </button>
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors">
              🧘 Need emotional support
            </button>
            <button className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs hover:bg-yellow-200 transition-colors">
              👑 Start AI Council session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMultiModalChat;
