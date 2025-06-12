// 💾 AI Messenger Conversation Persistence
// Advanced conversation management and storage system

import { useState, useEffect, useCallback } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  modelId?: string;
  responseTime?: number;
  realResponse?: boolean;
  tokens?: number;
  cost?: number;
}

interface Conversation {
  id: string;
  modelId: string;
  modelName: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  totalMessages: number;
  totalTokens: number;
  totalCost: number;
  favorite: boolean;
  tags: string[];
}

interface ConversationStore {
  conversations: Record<string, Conversation>;
  activeConversations: string[];
  archivedConversations: string[];
  totalStats: {
    totalConversations: number;
    totalMessages: number;
    totalTokens: number;
    totalCost: number;
    favoriteModels: string[];
  };
}

class AIMessengerStorage {
  private storageKey = 'ai-messenger-conversations';
  private maxConversations = 1000; // Limit for performance
  private maxMessagesPerConversation = 1000;

  // Save conversation to localStorage
  saveConversation(conversation: Conversation): void {
    try {
      const store = this.getStore();

      // Limit messages per conversation
      if (conversation.messages.length > this.maxMessagesPerConversation) {
        conversation.messages = conversation.messages.slice(-this.maxMessagesPerConversation);
      }

      store.conversations[conversation.id] = conversation;

      // Limit total conversations
      const conversationIds = Object.keys(store.conversations);
      if (conversationIds.length > this.maxConversations) {
        // Remove oldest non-favorite conversations
        const sortedIds = conversationIds
          .filter(id => !store.conversations[id].favorite)
          .sort((a, b) =>
            new Date(store.conversations[a].lastActivity).getTime() -
            new Date(store.conversations[b].lastActivity).getTime()
          );

        const toDelete = sortedIds.slice(0, conversationIds.length - this.maxConversations);
        toDelete.forEach(id => delete store.conversations[id]);
      }

      this.updateStats(store);
      this.setStore(store);
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  // Load conversation from storage
  getConversation(conversationId: string): Conversation | null {
    try {
      const store = this.getStore();
      return store.conversations[conversationId] || null;
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return null;
    }
  }

  // Get all conversations for a model
  getModelConversations(modelId: string): Conversation[] {
    try {
      const store = this.getStore();
      return Object.values(store.conversations)
        .filter(conv => conv.modelId === modelId)
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    } catch (error) {
      console.error('Failed to load model conversations:', error);
      return [];
    }
  }

  // Get recent conversations across all models
  getRecentConversations(limit: number = 50): Conversation[] {
    try {
      const store = this.getStore();
      return Object.values(store.conversations)
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to load recent conversations:', error);
      return [];
    }
  }

  // Search conversations by content
  searchConversations(query: string): Conversation[] {
    try {
      const store = this.getStore();
      const lowerQuery = query.toLowerCase();

      return Object.values(store.conversations)
        .filter(conv =>
          conv.modelName.toLowerCase().includes(lowerQuery) ||
          conv.messages.some(msg => msg.text.toLowerCase().includes(lowerQuery)) ||
          conv.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    } catch (error) {
      console.error('Failed to search conversations:', error);
      return [];
    }
  }

  // Toggle favorite status
  toggleFavorite(conversationId: string): void {
    try {
      const store = this.getStore();
      if (store.conversations[conversationId]) {
        store.conversations[conversationId].favorite = !store.conversations[conversationId].favorite;
        this.setStore(store);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }

  // Archive conversation
  archiveConversation(conversationId: string): void {
    try {
      const store = this.getStore();
      if (!store.archivedConversations.includes(conversationId)) {
        store.archivedConversations.push(conversationId);
        store.activeConversations = store.activeConversations.filter(id => id !== conversationId);
        this.setStore(store);
      }
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  }

  // Delete conversation
  deleteConversation(conversationId: string): void {
    try {
      const store = this.getStore();
      delete store.conversations[conversationId];
      store.activeConversations = store.activeConversations.filter(id => id !== conversationId);
      store.archivedConversations = store.archivedConversations.filter(id => id !== conversationId);
      this.updateStats(store);
      this.setStore(store);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }

  // Export conversations as JSON
  exportConversations(): string {
    try {
      const store = this.getStore();
      return JSON.stringify({
        ...store,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }, null, 2);
    } catch (error) {
      console.error('Failed to export conversations:', error);
      return '{}';
    }
  }

  // Import conversations from JSON
  importConversations(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      if (importedData.conversations) {
        const store = this.getStore();

        // Merge conversations (existing ones take precedence)
        Object.entries(importedData.conversations).forEach(([id, conv]) => {
          if (!store.conversations[id]) {
            store.conversations[id] = conv as Conversation;
          }
        });

        this.updateStats(store);
        this.setStore(store);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import conversations:', error);
      return false;
    }
  }

  // Get storage statistics
  getStorageStats(): {
    totalSize: number;
    conversationCount: number;
    messageCount: number;
    oldestConversation: Date | null;
    newestConversation: Date | null;
  } {
    try {
      const store = this.getStore();
      const conversations = Object.values(store.conversations);

      const storageSize = new Blob([JSON.stringify(store)]).size;
      const messageCount = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);

      const dates = conversations.map(conv => new Date(conv.createdAt));
      const oldestDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
      const newestDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;

      return {
        totalSize: storageSize,
        conversationCount: conversations.length,
        messageCount,
        oldestConversation: oldestDate,
        newestConversation: newestDate
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalSize: 0,
        conversationCount: 0,
        messageCount: 0,
        oldestConversation: null,
        newestConversation: null
      };
    }
  }

  // Clear all data
  clearAllData(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  // Private methods
  private getStore(): ConversationStore {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to parse stored data:', error);
    }

    return this.getDefaultStore();
  }

  private setStore(store: ConversationStore): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(store));
    } catch (error) {
      console.error('Failed to save store:', error);
    }
  }

  private getDefaultStore(): ConversationStore {
    return {
      conversations: {},
      activeConversations: [],
      archivedConversations: [],
      totalStats: {
        totalConversations: 0,
        totalMessages: 0,
        totalTokens: 0,
        totalCost: 0,
        favoriteModels: []
      }
    };
  }

  private updateStats(store: ConversationStore): void {
    const conversations = Object.values(store.conversations);

    store.totalStats = {
      totalConversations: conversations.length,
      totalMessages: conversations.reduce((sum, conv) => sum + conv.messages.length, 0),
      totalTokens: conversations.reduce((sum, conv) => sum + conv.totalTokens, 0),
      totalCost: conversations.reduce((sum, conv) => sum + conv.totalCost, 0),
      favoriteModels: this.calculateFavoriteModels(conversations)
    };
  }

  private calculateFavoriteModels(conversations: Conversation[]): string[] {
    const modelUsage: Record<string, number> = {};

    conversations.forEach(conv => {
      modelUsage[conv.modelId] = (modelUsage[conv.modelId] || 0) + conv.messages.length;
    });

    return Object.entries(modelUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([modelId]) => modelId);
  }
}

// React hook for conversation management
export function useConversationPersistence() {
  const [storage] = useState(() => new AIMessengerStorage());
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [storageStats, setStorageStats] = useState(storage.getStorageStats());

  const refreshConversations = useCallback(() => {
    setRecentConversations(storage.getRecentConversations());
    setStorageStats(storage.getStorageStats());
  }, [storage]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const saveConversation = useCallback((conversation: Conversation) => {
    storage.saveConversation(conversation);
    refreshConversations();
  }, [storage, refreshConversations]);

  const createConversation = useCallback((modelId: string, modelName: string): Conversation => {
    return {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      modelId,
      modelName,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      totalMessages: 0,
      totalTokens: 0,
      totalCost: 0,
      favorite: false,
      tags: []
    };
  }, []);

  const addMessage = useCallback((conversationId: string, message: Message, updateConversation?: (conv: Conversation) => Conversation) => {
    const conversation = storage.getConversation(conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.lastActivity = new Date();
      conversation.totalMessages = conversation.messages.length;

      // Estimate tokens and cost
      const estimatedTokens = Math.ceil(message.text.length / 4);
      conversation.totalTokens += estimatedTokens;

      if (message.cost) {
        conversation.totalCost += message.cost;
      }

      // Apply any additional updates
      const updatedConversation = updateConversation ? updateConversation(conversation) : conversation;

      storage.saveConversation(updatedConversation);
      refreshConversations();
    }
  }, [storage, refreshConversations]);

  return {
    storage,
    recentConversations,
    storageStats,
    saveConversation,
    createConversation,
    addMessage,
    refreshConversations,
    getConversation: storage.getConversation.bind(storage),
    getModelConversations: storage.getModelConversations.bind(storage),
    searchConversations: storage.searchConversations.bind(storage),
    toggleFavorite: storage.toggleFavorite.bind(storage),
    archiveConversation: storage.archiveConversation.bind(storage),
    deleteConversation: storage.deleteConversation.bind(storage),
    exportConversations: storage.exportConversations.bind(storage),
    importConversations: storage.importConversations.bind(storage),
    clearAllData: storage.clearAllData.bind(storage)
  };
}

export default AIMessengerStorage;
export type { Message, Conversation, ConversationStore };
