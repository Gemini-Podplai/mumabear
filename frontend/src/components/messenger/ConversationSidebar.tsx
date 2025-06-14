import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface AIModel {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing' | 'busy';
  color: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | string;
  timestamp: Date;
  type: string;
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
  updatedAt: Date;
}

interface GroupChat {
  id: string;
  name: string;
  description: string;
  avatar: string;
  participants: string[];
  lastActivity: Date;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  groupChats: GroupChat[];
  models: AIModel[];
  selectedConversation: string | null;
  selectedGroupChat?: string | null;
  searchQuery: string;
  activeView: 'chats' | 'groups' | 'archived';
  onSelectConversation: (id: string) => void;
  onSelectGroupChat?: (id: string) => void;
  onSearchChange: (query: string) => void;
  onViewChange: (view: 'chats' | 'groups' | 'archived') => void;
  onNewChat: () => void;
  onNewGroupChat?: () => void;
  expressMode: boolean;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  groupChats,
  models,
  selectedConversation,
  selectedGroupChat,
  searchQuery,
  activeView,
  onSelectConversation,
  onSelectGroupChat,
  onSearchChange,
  onViewChange,
  onNewChat,
  onNewGroupChat,
  expressMode
}) => {
  const getFilteredConversations = () => {
    const filtered = conversations.filter(conv => {
      const matchesSearch = conv.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesView = activeView === 'archived' ? conv.isArchived : !conv.isArchived;
      return matchesSearch && matchesView;
    });

    // Sort by pinned, then by last message time
    return filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  const getFilteredGroups = () => {
    return groupChats.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Messenger
          </h1>
          <div className="flex space-x-2">
            <motion.button
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNewChat}
              title="New Chat"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </motion.button>
            {onNewGroupChat && (
              <motion.button
                className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-full hover:from-green-700 hover:to-teal-700 shadow-lg"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNewGroupChat}
                title="New Group Chat"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
          <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>

        {/* View Tabs */}
        <div className="flex mt-4 bg-gray-700 rounded-lg p-1">
          {[
            { key: 'chats', label: 'Chats', count: conversations.filter(c => !c.isArchived).length },
            { key: 'groups', label: 'Groups', count: groupChats.length },
            { key: 'archived', label: 'Archive', count: conversations.filter(c => c.isArchived).length }
          ].map(tab => (
            <motion.button
              key={tab.key}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeView === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange(tab.key as any)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeView === tab.key ? 'bg-blue-700' : 'bg-gray-500'
                  }`}>
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeView === 'chats' && (
            <motion.div
              key="chats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: expressMode ? 0.1 : 0.3 }}
            >
              {getFilteredConversations().map(conversation => {
                const model = models.find(m => m.id === conversation.modelId);
                return (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    model={model!}
                    isSelected={selectedConversation === conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    expressMode={expressMode}
                  />
                );
              })}
              {getFilteredConversations().length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <p>No conversations found</p>
                  <p className="text-sm mt-1">Start a new chat with an AI model</p>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'groups' && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: expressMode ? 0.1 : 0.3 }}
            >
              {getFilteredGroups().map(group => (
                <GroupChatItem
                  key={group.id}
                  group={group}
                  isSelected={selectedGroupChat === group.id}
                  onClick={() => onSelectGroupChat && onSelectGroupChat(group.id)}
                  expressMode={expressMode}
                />
              ))}
              {getFilteredGroups().length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <p>No group chats yet</p>
                  <p className="text-sm mt-1">Create a group with multiple AI models</p>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'archived' && (
            <motion.div
              key="archived"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: expressMode ? 0.1 : 0.3 }}
            >
              {getFilteredConversations().map(conversation => {
                const model = models.find(m => m.id === conversation.modelId);
                return (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    model={model!}
                    isSelected={selectedConversation === conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    expressMode={expressMode}
                  />
                );
              })}
              {getFilteredConversations().length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>No archived conversations</p>
                  <p className="text-sm mt-1">Archived chats will appear here</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  model: AIModel;
  isSelected: boolean;
  onClick: () => void;
  expressMode: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  model,
  isSelected,
  onClick,
  expressMode
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'typing': return 'bg-blue-500 animate-pulse';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className={`p-4 cursor-pointer border-b border-gray-700 hover:bg-gray-750 transition-colors ${isSelected ? 'bg-gray-700 border-l-4 border-blue-500' : ''
        }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
      transition={{ duration: expressMode ? 0.1 : 0.2 }}
    >
      <div className="flex items-center space-x-3">
        {/* Model Avatar */}
        <div className="relative">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
            style={{ backgroundColor: model.color }}
          >
            {model.avatar || model.name.slice(0, 2).toUpperCase()}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(model.status)}`} />
          {conversation.isPinned && (
            <div className="absolute -top-1 -right-1 text-yellow-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate text-white flex items-center space-x-2">
              <span>{model.name}</span>
              {conversation.isMuted && (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                {formatTime(new Date(conversation.updatedAt))}
              </span>
              {conversation.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400 truncate mt-1">
            {conversation.lastMessage.sender === 'user' ? 'You: ' : ''}
            {conversation.lastMessage.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Group Chat Item Component
const GroupChatItem: React.FC<{
  group: GroupChat;
  isSelected: boolean;
  onClick: () => void;
  expressMode: boolean;
}> = ({ group, isSelected, onClick, expressMode }) => {
  return (
    <motion.div
      className={`p-3 rounded-lg cursor-pointer transition-all ${isSelected
          ? 'bg-blue-600/20 border border-blue-500/50'
          : 'hover:bg-gray-700'
        }`}
      whileHover={{ scale: expressMode ? 1 : 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-lg">
            {group.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white truncate">{group.name}</h3>
            <span className="text-xs text-gray-400">
              {group.lastActivity.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <p className="text-sm text-gray-400 truncate flex-1">
              {group.participants.length} participants
            </p>
            <div className="flex -space-x-1">
              {group.participants.slice(0, 3).map((participantId, index) => (
                <div
                  key={participantId}
                  className="w-5 h-5 rounded-full bg-gray-600 border border-gray-800 flex items-center justify-center text-xs"
                  style={{ zIndex: 10 - index }}
                >
                  🤖
                </div>
              ))}
              {group.participants.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-gray-600 border border-gray-800 flex items-center justify-center text-xs">
                  +
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationSidebar;
