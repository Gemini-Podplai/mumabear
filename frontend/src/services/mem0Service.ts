interface MemoryContext {
  id: string;
  userId: string;
  modelId?: string;
  conversationType: 'individual' | 'group';
  topics: string[];
  preferences: {
    topics: string[];
    communicationStyle: string;
    interests: string[];
  };
  facts: string[];
  relationships: { [key: string]: any };
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | string;
  timestamp: Date;
  type: string;
  metadata?: any;
}

interface MemoryEntry {
  id: string;
  contextId: string;
  content: string;
  type: 'fact' | 'preference' | 'topic' | 'relationship';
  importance: number; // 1-10 scale
  timestamp: Date;
  associatedMessages: string[];
}

class Mem0Service {
  private static instance: Mem0Service;
  private memoryStore: Map<string, MemoryContext> = new Map();
  private memoryEntries: Map<string, MemoryEntry[]> = new Map();
  private isInitialized = false;

  constructor() {
    if (Mem0Service.instance) {
      return Mem0Service.instance;
    }
    Mem0Service.instance = this;
  }

  static getInstance(): Mem0Service {
    if (!Mem0Service.instance) {
      Mem0Service.instance = new Mem0Service();
    }
    return Mem0Service.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load existing memory from localStorage
      const savedMemory = localStorage.getItem('ai_messenger_memory');
      if (savedMemory) {
        const parsedMemory = JSON.parse(savedMemory);
        this.memoryStore = new Map(parsedMemory.contexts || []);
        this.memoryEntries = new Map(parsedMemory.entries || []);
      }

      this.isInitialized = true;
      console.log('Mem0 Service initialized');
    } catch (error) {
      console.error('Error initializing Mem0 Service:', error);
    }
  }

  async createContext(params: {
    userId: string;
    modelId?: string;
    conversationType: 'individual' | 'group';
  }): Promise<MemoryContext> {
    const context: MemoryContext = {
      id: `ctx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      modelId: params.modelId,
      conversationType: params.conversationType,
      topics: [],
      preferences: {
        topics: [],
        communicationStyle: 'adaptive',
        interests: []
      },
      facts: [],
      relationships: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.memoryStore.set(context.id, context);
    this.memoryEntries.set(context.id, []);
    await this.saveToStorage();

    return context;
  }

  async getContext(contextId: string): Promise<MemoryContext | null> {
    return this.memoryStore.get(contextId) || null;
  }

  async addMessage(params: {
    conversationId: string;
    message: Message;
    context: MemoryContext;
  }): Promise<void> {
    const { message, context } = params;

    // Extract insights from the message
    const insights = await this.extractInsights(message);

    // Update context with new insights
    await this.updateContextWithInsights(context.id, insights, message.id);

    // Store message reference
    this.updateMemoryWithMessage(context.id, message);

    await this.saveToStorage();
  }

  private async extractInsights(message: Message): Promise<{
    topics: string[];
    facts: string[];
    preferences: string[];
    entities: string[];
  }> {
    // Simple NLP-like extraction (in a real implementation, this would use actual NLP)
    const content = message.content.toLowerCase();

    const topicKeywords = ['ai', 'machine learning', 'programming', 'coding', 'technology', 'science', 'art', 'music', 'literature', 'philosophy', 'business', 'health', 'sports', 'travel', 'food', 'education'];
    const topics = topicKeywords.filter(topic => content.includes(topic));

    const facts: string[] = [];
    const preferences: string[] = [];
    const entities: string[] = [];

    // Extract facts (sentences starting with "I am", "I have", "I work", etc.)
    if (content.includes('i am ') || content.includes('i\'m ')) {
      facts.push(message.content);
    }

    // Extract preferences (sentences with "like", "love", "prefer", "enjoy")
    if (content.includes('like ') || content.includes('love ') || content.includes('prefer ') || content.includes('enjoy ')) {
      preferences.push(message.content);
    }

    // Extract entities (simple capitalized words)
    const words = message.content.split(' ');
    entities.push(...words.filter(word => /^[A-Z][a-z]+$/.test(word)));

    return { topics, facts, preferences, entities };
  }

  private async updateContextWithInsights(
    contextId: string,
    insights: any,
    messageId: string
  ): Promise<void> {
    const context = this.memoryStore.get(contextId);
    if (!context) return;

    // Update topics
    insights.topics.forEach((topic: string) => {
      if (!context.topics.includes(topic)) {
        context.topics.push(topic);
      }
    });

    // Add memory entries
    const entries = this.memoryEntries.get(contextId) || [];

    insights.facts.forEach((fact: string) => {
      entries.push({
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        contextId,
        content: fact,
        type: 'fact',
        importance: 7,
        timestamp: new Date(),
        associatedMessages: [messageId]
      });
    });

    insights.preferences.forEach((preference: string) => {
      entries.push({
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        contextId,
        content: preference,
        type: 'preference',
        importance: 6,
        timestamp: new Date(),
        associatedMessages: [messageId]
      });
    });

    this.memoryEntries.set(contextId, entries);
    context.updatedAt = new Date();
    this.memoryStore.set(contextId, context);
  }

  private updateMemoryWithMessage(contextId: string, message: Message): void {
    // This would typically store the message for future reference
    // In a real implementation, you might want to limit storage size
    console.log(`Storing message ${message.id} for context ${contextId}`);
  }

  async getRelevantMemories(contextId: string, query: string): Promise<MemoryEntry[]> {
    const entries = this.memoryEntries.get(contextId) || [];

    // Simple relevance scoring based on keyword matching
    const relevantEntries = entries.filter(entry =>
      entry.content.toLowerCase().includes(query.toLowerCase())
    );

    // Sort by importance and recency
    return relevantEntries.sort((a, b) => {
      const importanceScore = b.importance - a.importance;
      const timeScore = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      return importanceScore || timeScore;
    });
  }

  async getPersonalizationContext(contextId: string): Promise<{
    userPreferences: string[];
    conversationHistory: string[];
    knownFacts: string[];
    suggestedTopics: string[];
  }> {
    const context = this.memoryStore.get(contextId);
    const entries = this.memoryEntries.get(contextId) || [];

    if (!context) {
      return {
        userPreferences: [],
        conversationHistory: [],
        knownFacts: [],
        suggestedTopics: []
      };
    }

    const userPreferences = entries
      .filter(e => e.type === 'preference')
      .map(e => e.content);

    const knownFacts = entries
      .filter(e => e.type === 'fact')
      .map(e => e.content);

    const conversationHistory = context.topics;
    const suggestedTopics = this.generateSuggestedTopics(context, entries);

    return {
      userPreferences,
      conversationHistory,
      knownFacts,
      suggestedTopics
    };
  }

  private generateSuggestedTopics(context: MemoryContext, entries: MemoryEntry[]): string[] {
    // Generate topic suggestions based on user's interests and conversation history
    const topicFrequency: { [key: string]: number } = {};

    context.topics.forEach(topic => {
      topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
    });

    // Suggest related topics
    const suggestions: string[] = [];
    Object.keys(topicFrequency).forEach(topic => {
      const relatedTopics = this.getRelatedTopics(topic);
      suggestions.push(...relatedTopics);
    });

    return [...new Set(suggestions)].slice(0, 5);
  }

  private getRelatedTopics(topic: string): string[] {
    // Simple topic relationship mapping
    const relationships: { [key: string]: string[] } = {
      'ai': ['machine learning', 'neural networks', 'deep learning', 'natural language processing'],
      'programming': ['coding', 'software development', 'algorithms', 'data structures'],
      'technology': ['innovation', 'startups', 'software', 'hardware'],
      'science': ['physics', 'biology', 'chemistry', 'mathematics'],
      'art': ['painting', 'sculpture', 'design', 'creativity'],
      'music': ['instruments', 'composition', 'genres', 'performance']
    };

    return relationships[topic] || [];
  }

  async clearContext(contextId: string): Promise<void> {
    this.memoryStore.delete(contextId);
    this.memoryEntries.delete(contextId);
    await this.saveToStorage();
  }

  async getAllContexts(userId: string): Promise<MemoryContext[]> {
    return Array.from(this.memoryStore.values())
      .filter(context => context.userId === userId);
  }

  private async saveToStorage(): Promise<void> {
    try {
      const memoryData = {
        contexts: Array.from(this.memoryStore.entries()),
        entries: Array.from(this.memoryEntries.entries())
      };

      localStorage.setItem('ai_messenger_memory', JSON.stringify(memoryData));
    } catch (error) {
      console.error('Error saving memory to storage:', error);
    }
  }

  async exportMemory(contextId: string): Promise<string> {
    const context = this.memoryStore.get(contextId);
    const entries = this.memoryEntries.get(contextId) || [];

    if (!context) return '';

    return JSON.stringify({ context, entries }, null, 2);
  }

  async importMemory(memoryData: string): Promise<void> {
    try {
      const parsed = JSON.parse(memoryData);
      if (parsed.context && parsed.entries) {
        this.memoryStore.set(parsed.context.id, parsed.context);
        this.memoryEntries.set(parsed.context.id, parsed.entries);
        await this.saveToStorage();
      }
    } catch (error) {
      console.error('Error importing memory:', error);
      throw new Error('Invalid memory data format');
    }
  }

  // Analytics methods
  async getMemoryStats(contextId: string): Promise<{
    totalEntries: number;
    factCount: number;
    preferenceCount: number;
    topicCount: number;
    memoryAge: number; // in days
  }> {
    const context = this.memoryStore.get(contextId);
    const entries = this.memoryEntries.get(contextId) || [];

    if (!context) {
      return {
        totalEntries: 0,
        factCount: 0,
        preferenceCount: 0,
        topicCount: 0,
        memoryAge: 0
      };
    }

    const factCount = entries.filter(e => e.type === 'fact').length;
    const preferenceCount = entries.filter(e => e.type === 'preference').length;
    const topicCount = context.topics.length;
    const memoryAge = Math.floor((Date.now() - context.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    return {
      totalEntries: entries.length,
      factCount,
      preferenceCount,
      topicCount,
      memoryAge
    };
  }
}

// Export singleton instance
const mem0ServiceInstance = Mem0Service.getInstance();
export { mem0ServiceInstance as Mem0Service };
export default mem0ServiceInstance;
