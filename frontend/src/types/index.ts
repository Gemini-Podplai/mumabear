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
