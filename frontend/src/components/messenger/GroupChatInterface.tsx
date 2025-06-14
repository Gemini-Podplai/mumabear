import { AnimatePresence, motion } from 'framer-motion';
import { Crown, MoreVertical, Settings, Sparkles, UserPlus, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AIModel {
  id: string;
  name: string;
  fullName: string;
  provider: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing' | 'busy';
  color: string;
  tier: 'basic' | 'advanced' | 'premium' | 'enterprise';
  specialty: string;
  personality: string;
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
  metadata?: any;
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

interface GroupChatInterfaceProps {
  groupChat: GroupChat;
  models: AIModel[];
  onSendMessage: (content: string, type?: string, metadata?: any) => void;
  onUpdateGroup: (updates: Partial<GroupChat>) => void;
  typingUsers: string[];
  expressMode: boolean;
}

export const GroupChatInterface: React.FC<GroupChatInterfaceProps> = ({
  groupChat,
  models,
  onSendMessage,
  onUpdateGroup: _onUpdateGroup,
  typingUsers,
  expressMode
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [contextSharing, setContextSharing] = useState(groupChat.settings.contextSharing);
  const [currentDiscussion, setCurrentDiscussion] = useState<{
    topic: string;
    moderator: string;
    participants: string[];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const participantModels = models.filter(m => groupChat.participants.includes(m.id));

  // AI Response Generation for Group Context
  const generateGroupResponse = (_message: string, modelId: string): string => {
    const model = models.find(m => m.id === modelId);
    if (!model) return "I'm thinking...";

    const responses = {
      'collaboration': [
        `${model.name}: Great point! Building on that idea, I think we could also consider...`,
        `${model.name}: I agree with the previous suggestions. From my expertise in ${model.specialty}, I'd add...`,
        `${model.name}: Interesting perspective! Let me analyze this from a different angle...`,
        `${model.name}: That's exactly what I was thinking. We should definitely explore...`
      ],
      'research': [
        `${model.name}: Based on my analysis, the data suggests...`,
        `${model.name}: I've found some relevant research that supports this hypothesis...`,
        `${model.name}: Let me fact-check this and provide additional context...`,
        `${model.name}: This aligns with recent findings in ${model.specialty}...`
      ],
      'creative': [
        `${model.name}: What if we approached this with a more artistic perspective?`,
        `${model.name}: I love this direction! It reminds me of...`,
        `${model.name}: Let's brainstorm some wild ideas - no limits!`,
        `${model.name}: This creative challenge excites me! Here's my take...`
      ],
      'coding': [
        `${model.name}: Here's how I would implement this solution...`,
        `${model.name}: I notice a potential optimization opportunity here...`,
        `${model.name}: Let me debug this approach and suggest alternatives...`,
        `${model.name}: From a ${model.specialty} perspective, this code could be improved by...`
      ],
      'general': [
        `${model.name}: Interesting! I hadn't considered that angle before...`,
        `${model.name}: That's a thoughtful question. Let me share my perspective...`,
        `${model.name}: I appreciate everyone's input. Here's what I think...`,
        `${model.name}: Building on the conversation, I'd like to add...`
      ]
    };

    const groupResponses = responses[groupChat.groupType] || responses.general;
    return groupResponses[Math.floor(Math.random() * groupResponses.length)];
  };

  // Simulate multi-AI conversation flow
  const triggerGroupDiscussion = (userMessage: string) => {
    const activeParticipants = participantModels.filter(m => m.status === 'online');

    // Randomly select 2-4 models to respond
    const respondingModels = activeParticipants
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 2);

    respondingModels.forEach((model, index) => {
      setTimeout(() => {
        const response = generateGroupResponse(userMessage, model.id);
        onSendMessage(response, 'text');
      }, (index + 1) * (expressMode ? 800 : 1500));
    });
  };

  const startFocusedDiscussion = (topic: string) => {
    const moderator = participantModels.find(m => m.tier === 'premium')?.id || participantModels[0]?.id;
    setCurrentDiscussion({
      topic,
      moderator,
      participants: groupChat.participants
    });

    // Moderator introduces the topic
    setTimeout(() => {
      const moderatorModel = models.find(m => m.id === moderator);
      onSendMessage(
        `${moderatorModel?.name}: Let's focus our discussion on "${topic}". I'll moderate to ensure everyone gets a chance to contribute. Who would like to start?`,
        'text'
      );
    }, 500);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim(), 'text');

      // Trigger group responses
      if (contextSharing) {
        triggerGroupDiscussion(messageInput.trim());
      }

      setMessageInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: expressMode ? 'auto' : 'smooth'
    });
  }, [groupChat.messages]);

  return (
    <div className="flex h-full bg-gray-900 text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Group Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{groupChat.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>{groupChat.participants.length} participants</span>
                {typingUsers.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-blue-400">
                      {typingUsers.length === 1
                        ? `${models.find(m => m.id === typingUsers[0])?.name} is typing...`
                        : `${typingUsers.length} models are typing...`
                      }
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Group Type Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${groupChat.groupType === 'collaboration' ? 'bg-blue-500/20 text-blue-300' :
                groupChat.groupType === 'research' ? 'bg-purple-500/20 text-purple-300' :
                  groupChat.groupType === 'creative' ? 'bg-orange-500/20 text-orange-300' :
                    groupChat.groupType === 'coding' ? 'bg-green-500/20 text-green-300' :
                      'bg-gray-500/20 text-gray-300'
              }`}>
              {groupChat.groupType}
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="View Participants"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => setContextSharing(!contextSharing)}
              className={`p-2 rounded-lg transition-colors ${contextSharing ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`}
              title="Context Sharing"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Group Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Discussion Banner */}
        {currentDiscussion && (
          <motion.div
            className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">
                  Focused Discussion: {currentDiscussion.topic}
                </span>
                <span className="text-xs text-gray-400">
                  Moderated by {models.find(m => m.id === currentDiscussion.moderator)?.name}
                </span>
              </div>
              <button
                onClick={() => setCurrentDiscussion(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                End Discussion
              </button>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {groupChat.messages.map((message, index) => {
              const isUser = message.sender === 'user';
              const senderModel = !isUser ? models.find(m => m.id === message.sender) : null;
              const isConsecutive = index > 0 &&
                groupChat.messages[index - 1].sender === message.sender &&
                (message.timestamp.getTime() - groupChat.messages[index - 1].timestamp.getTime()) < 60000;

              return (
                <motion.div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: expressMode ? 0.1 : 0.3 }}
                >
                  {!isUser && !isConsecutive && (
                    <div className="mr-3 flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: senderModel?.color + '20', color: senderModel?.color }}
                      >
                        {senderModel?.avatar}
                      </div>
                    </div>
                  )}

                  {!isUser && isConsecutive && <div className="w-8 mr-3" />}

                  <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
                    {!isUser && !isConsecutive && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: senderModel?.color }}>
                          {senderModel?.name}
                        </span>
                        <div className={`text-xs px-2 py-0.5 rounded ${senderModel?.tier === 'premium' ? 'bg-purple-500/20 text-purple-300' :
                            senderModel?.tier === 'advanced' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-gray-500/20 text-gray-300'
                          }`}>
                          {senderModel?.tier}
                        </div>
                      </div>
                    )}

                    <div className={`inline-block px-4 py-2 rounded-2xl ${isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                      } ${isConsecutive ? (isUser ? 'rounded-tr-md' : 'rounded-tl-md') : ''}`}>
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="flex space-x-2">
              {typingUsers.slice(0, 3).map(userId => {
                const model = models.find(m => m.id === userId);
                return (
                  <motion.div
                    key={userId}
                    className="flex items-center space-x-2 text-gray-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: model?.color + '20', color: model?.color }}
                    >
                      {model?.avatar}
                    </div>
                    <span>{model?.name} is typing...</span>
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-1 h-1 bg-gray-400 rounded-full"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.div
                        className="w-1 h-1 bg-gray-400 rounded-full"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                      />
                      <motion.div
                        className="w-1 h-1 bg-gray-400 rounded-full"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-gray-700">
          <div className="flex space-x-2 overflow-x-auto">
            {['Brainstorm Ideas', 'Code Review', 'Research Topic', 'Debate Question', 'Creative Challenge'].map(action => (
              <button
                key={action}
                onClick={() => startFocusedDiscussion(action)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Message ${groupChat.name}...`}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Participants Sidebar */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            className="w-80 bg-gray-800 border-l border-gray-700 p-4"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Participants ({participantModels.length})</h4>
              <button className="p-1 hover:bg-gray-700 rounded">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {participantModels.map(model => (
                <div key={model.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg">
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: model.color + '20', color: model.color }}
                    >
                      {model.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${model.status === 'online' ? 'bg-green-500' :
                        model.status === 'busy' ? 'bg-yellow-500' :
                          'bg-gray-500'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{model.name}</span>
                      {groupChat.admins.includes(model.id) && (
                        <Crown className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{model.provider}</p>
                  </div>
                  <button className="p-1 hover:bg-gray-600 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>

            {/* Group Stats */}
            <div className="mt-6 p-3 bg-gray-700 rounded-lg">
              <h5 className="font-medium mb-2 text-sm">Group Statistics</h5>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Messages:</span>
                  <span>{groupChat.messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{groupChat.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Most Active:</span>
                  <span>
                    {participantModels.find(m => m.tier === 'premium')?.name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
