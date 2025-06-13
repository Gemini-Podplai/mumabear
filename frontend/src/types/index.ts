import type { LucideIcon } from 'lucide-react'

export interface ToolResponse {
    toolId: string
    timestamp: Date
    result: string
    status: 'success' | 'error' | 'pending'
    executionTime?: number
    cost?: number
    source?: string
}

export type AgentAction =
    | 'toggle_express_mode'
    | 'toggle_collaboration'
    | 'start'
    | 'stop'
    | 'pause'
    | 'resume'
    | 'configure_performance'
    | 'clear_responses'
    | 'optimize'

export interface AgentTool {
    id: string
    name: string
    description: string
    icon: LucideIcon
    category: 'development' | 'data' | 'assistant' | 'system'
    expressMode?: boolean
    usageCount?: number
    avgResponseTime?: number
    successRate?: number
}

export interface AgentMetrics {
    successRate: number
    responseTime: number
    actionsPerMinute: number
    uptime: string
    totalRequests: number
    averageCost: number
    expressRequests: number
    collaborationEvents: number
}

export interface AgentCollaborator {
    id: string
    name: string
    role: 'owner' | 'editor' | 'viewer'
    active: boolean
    lastActive: Date
}

export type AgentStatus = 'idle' | 'active' | 'paused' | 'error'

// Virtual Machine Types
export interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
  ipAddress: string;
  port: number;
  createdAt: Date;
  lastActivity: Date;
  description?: string;
  metrics?: {
    cpu: number;
    memoryUsed: number;
    memoryTotal: number;
    storageTotal: number;
  };
  specs?: {
    cpuCores: number;
    memory: string;
    storage: string;
  };
  network?: {
    ipAddress: string;
    ports: number[];
  };
}

// Collaborative Types
export interface CollaborativePresence {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  isTyping?: boolean;
  currentFile?: string;
}

export interface BrowserView {
  id: string;
  title: string;
  url: string;
  shared: boolean;
  favicon?: string;
}

export interface ResearchContext {
  documents: Array<{
    id: string;
    title: string;
    url: string;
    content: string;
  }>;
  snippets: Array<{
    id: string;
    text: string;
    source: string;
  }>;
  aiInsights: Array<{
    id: string;
    insight: string;
    confidence: number;
  }>;
  relatedTopics: string[];
}

export interface ResearchMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: Array<{
    id: string;
    title: string;
    url: string;
    type: 'document' | 'image' | 'video' | 'audio';
  }>;
  sources?: string[];
}
