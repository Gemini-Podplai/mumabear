import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { AgentAction, AgentStatus, AgentTool, ToolResponse } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import {
    Activity,
    Bot,
    Brain,
    CheckCircle,
    Clock,
    Code, Database,
    LayoutPanelLeft,
    RefreshCw,
    Settings,
    Terminal,
    Users,
    Zap
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

// Enhanced interfaces
interface AgentMetrics {
    successRate: number
    responseTime: number
    actionsPerMinute: number
    uptime: string
    totalRequests: number
    averageCost: number
    expressRequests: number
    collaborationEvents: number
}

interface AgentCollaborator {
    id: string
    name: string
    role: 'owner' | 'editor' | 'viewer'
    active: boolean
    lastActive: Date
}

interface AgentToolsPanelProps {
    onToolSelect?: (tool: AgentTool) => void
    onAgentAction?: (action: AgentAction) => void
    agentStatus?: AgentStatus
    isCollaborationActive?: boolean
    expressMode?: boolean
    className?: string
    onCollaboratorJoin?: (collaborator: AgentCollaborator) => void
    onCollaboratorLeave?: (collaboratorId: string) => void
}

const AgentToolsPanel: React.FC<AgentToolsPanelProps> = ({
    onToolSelect,
    onAgentAction,
    agentStatus = 'idle',
    isCollaborationActive = false,
    expressMode = false,
    className,
    onCollaboratorJoin,
    onCollaboratorLeave
}) => {
    const [activeTab, setActiveTab] = useState('tools')
    const [toolResponses, setToolResponses] = useState<ToolResponse[]>([])
    const [metrics, setMetrics] = useState<AgentMetrics>({
        successRate: 97,
        responseTime: expressMode ? 250 : 450,
        actionsPerMinute: expressMode ? 120 : 60,
        uptime: '2h 45m',
        totalRequests: 2456,
        averageCost: 0.0015,
        expressRequests: expressMode ? 1890 : 0,
        collaborationEvents: isCollaborationActive ? 156 : 0
    })
    const [collaborators, setCollaborators] = useState<AgentCollaborator[]>([])
    const [isAutoRefresh, setIsAutoRefresh] = useState(true)
    const wsRef = useRef<WebSocket | null>(null)

    // Simulated tools list - will be fetched from MCP agent
    const tools: AgentTool[] = [
        {
            id: 'code-analysis',
            name: 'Code Analysis',
            description: 'Analyze code structure and quality',
            icon: Code,
            category: 'development'
        },
        {
            id: 'database-query',
            name: 'Database Query',
            description: 'Query and analyze data sources',
            icon: Database,
            category: 'data'
        },
        {
            id: 'task-assistant',
            name: 'Task Assistant',
            description: 'Get help with development tasks',
            icon: Brain,
            category: 'assistant'
        },
        {
            id: 'performance',
            name: 'Performance Analysis',
            description: 'Analyze system performance',
            icon: Zap,
            category: 'system'
        },
        {
            id: 'terminal',
            name: 'Terminal Commands',
            description: 'Execute terminal commands',
            icon: Terminal,
            category: 'system'
        }
    ]

    // WebSocket setup for real-time collaboration
    useEffect(() => {
        if (isCollaborationActive && !wsRef.current) {
            const ws = new WebSocket('ws://localhost:5001/api/agent-collaboration')

            ws.onopen = () => {
                console.log('Connected to collaboration server')
            }

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                switch (data.type) {
                    case 'collaborator_joined':
                        setCollaborators(prev => [...prev, data.collaborator])
                        onCollaboratorJoin?.(data.collaborator)
                        break
                    case 'collaborator_left':
                        setCollaborators(prev => prev.filter(c => c.id !== data.collaboratorId))
                        onCollaboratorLeave?.(data.collaboratorId)
                        break
                    case 'metrics_update':
                        setMetrics(prev => ({ ...prev, ...data.metrics }))
                        break
                    case 'tool_response':
                        setToolResponses(prev => [data.response, ...prev])
                        break
                }
            }

            ws.onerror = (error) => {
                console.error('WebSocket error:', error)
            }

            wsRef.current = ws

            return () => {
                ws.close()
                wsRef.current = null
            }
        }
    }, [isCollaborationActive, onCollaboratorJoin, onCollaboratorLeave])

    // Auto-refresh metrics
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isAutoRefresh) {
            interval = setInterval(() => {
                // Simulate metrics update
                setMetrics(prev => ({
                    ...prev,
                    actionsPerMinute: Math.floor(Math.random() * 20) + (expressMode ? 100 : 50),
                    successRate: Math.min(100, prev.successRate + (Math.random() * 2 - 1)),
                    responseTime: expressMode
                        ? Math.max(150, Math.min(350, prev.responseTime + (Math.random() * 40 - 20)))
                        : Math.max(350, Math.min(550, prev.responseTime + (Math.random() * 40 - 20))),
                    totalRequests: prev.totalRequests + Math.floor(Math.random() * 3),
                    expressRequests: expressMode ? prev.expressRequests + Math.floor(Math.random() * 2) : prev.expressRequests
                }))
            }, 2000)
        }

        return () => clearInterval(interval)
    }, [isAutoRefresh, expressMode])

    // Tool responses mock - will come from actual agent
    useEffect(() => {
        setToolResponses([
            {
                toolId: 'code-analysis',
                timestamp: new Date(),
                result: 'Analyzing code structure...',
                status: 'success'
            }
        ])
    }, [])

    return (
        <TooltipProvider>
            <Card className={className}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">MCP Agent Tools</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            {expressMode && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant="default" className="bg-yellow-500/20 text-yellow-400">
                                            <Zap className="h-3 w-3 mr-1" />
                                            Express
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Running in Express Mode - {metrics.responseTime}ms avg response
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {isCollaborationActive && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant="default" className="bg-green-500/20 text-green-400">
                                            <Users className="h-3 w-3 mr-1" />
                                            {collaborators.length + 1}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {collaborators.length} active collaborators
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            <Badge variant={agentStatus === 'active' ? 'success' : 'secondary'}>
                                {agentStatus === 'active' ? 'Connected' : 'Idle'}
                            </Badge>
                        </div>
                    </div>
                    {isCollaborationActive && collaborators.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Active: {collaborators.map(c => c.name).join(', ')}
                        </div>
                    )}
                </CardHeader>

                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full mb-4">
                            <TabsTrigger value="tools" className="flex-1">
                                <LayoutPanelLeft className="h-4 w-4 mr-2" />
                                Tools
                            </TabsTrigger>
                            <TabsTrigger value="responses" className="flex-1">
                                <Bot className="h-4 w-4 mr-2" />
                                Responses
                            </TabsTrigger>
                            <TabsTrigger value="metrics" className="flex-1">
                                <Activity className="h-4 w-4 mr-2" />
                                Metrics
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex-1">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tools" className="mt-0">
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="grid grid-cols-1 gap-3">
                                    {tools.map(tool => (
                                        <motion.div
                                            key={tool.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="group"
                                        >
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start items-center gap-3 p-3 hover:bg-muted"
                                                onClick={() => onToolSelect?.(tool)}
                                            >
                                                <tool.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                                <div className="text-left">
                                                    <div className="font-medium">{tool.name}</div>
                                                    <div className="text-xs text-muted-foreground">{tool.description}</div>
                                                </div>
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="responses" className="mt-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-muted-foreground">
                                    {toolResponses.length} total responses
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setToolResponses([])}>
                                    Clear
                                </Button>
                            </div>
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {toolResponses.map((response, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="p-3 rounded-lg bg-muted"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-sm font-medium">
                                                        {tools.find(t => t.id === response.toolId)?.name}
                                                    </div>
                                                    <Badge variant={response.status === 'success' ? 'success' : 'destructive'}>
                                                        {response.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{response.result}</p>
                                                <div className="text-xs text-muted-foreground mt-2">
                                                    {response.timestamp.toLocaleTimeString()}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="metrics" className="mt-0">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium">Performance Metrics</h4>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                                >
                                    <RefreshCw className={cn(
                                        "h-4 w-4 mr-2",
                                        isAutoRefresh && "animate-spin"
                                    )} />
                                    {isAutoRefresh ? 'Auto' : 'Manual'}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Express Mode Performance */}
                                {expressMode && (
                                    <Card className="p-4 border-yellow-500/20">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap className="h-5 w-5 text-yellow-500" />
                                            <div>
                                                <h5 className="font-medium">Express Mode Performance</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {metrics.expressRequests} requests processed
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Response Time</span>
                                                <span className="font-medium">{metrics.responseTime}ms</span>
                                            </div>
                                            <Progress
                                                value={Math.max(0, 100 - (metrics.responseTime / 5))}
                                                className="h-2"
                                            />
                                        </div>
                                    </Card>
                                )}

                                {/* Success Rate and Response Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="font-medium">Success Rate</span>
                                            </div>
                                            <span className="text-lg font-bold">{metrics.successRate}%</span>
                                        </div>
                                        <Progress value={metrics.successRate} />
                                    </Card>

                                    <Card className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium">Response Time</span>
                                            </div>
                                            <span className="text-lg font-bold">{metrics.responseTime}ms</span>
                                        </div>
                                    </Card>
                                </div>

                                {/* Collaboration Metrics */}
                                {isCollaborationActive && (
                                    <Card className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-indigo-500" />
                                                <span className="font-medium">Collaboration Stats</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-muted-foreground">Active Users</div>
                                                <div className="text-2xl font-bold">{collaborators.length + 1}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground">Events</div>
                                                <div className="text-2xl font-bold">{metrics.collaborationEvents}</div>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Usage Stats */}
                                <Card className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-purple-500" />
                                            <span className="font-medium">Usage Statistics</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-muted-foreground">Total Requests</div>
                                            <div className="text-2xl font-bold">{metrics.totalRequests}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Actions/Min</div>
                                            <div className="text-2xl font-bold">{metrics.actionsPerMinute}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Avg. Cost</div>
                                            <div className="text-2xl font-bold">${metrics.averageCost}</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="mt-0">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <h4 className="font-medium">Agent Configuration</h4>
                                    <div className="text-sm text-muted-foreground">
                                        Configure MCP agent behavior and preferences
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {/* Express Mode Settings */}
                                    <Card className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-4 w-4" />
                                                    <span className="font-medium">Express Mode</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Optimize for faster response times
                                                </p>
                                            </div>
                                            <Button
                                                variant={expressMode ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => onAgentAction?.('toggle_express_mode')}
                                            >
                                                {expressMode ? 'Enabled' : 'Disabled'}
                                            </Button>
                                        </div>
                                        {expressMode && (
                                            <div className="mt-4 pt-4 border-t space-y-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Target Response Time</span>
                                                    <span className="font-medium text-green-500">{'<'}200ms</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Cost Optimization</span>
                                                    <Badge variant="success">Active</Badge>
                                                </div>
                                            </div>
                                        )}
                                    </Card>

                                    {/* Collaboration Settings */}
                                    <Card className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span className="font-medium">Collaboration</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Enable real-time collaboration features
                                                </p>
                                            </div>
                                            <Button
                                                variant={isCollaborationActive ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => onAgentAction?.('toggle_collaboration')}
                                            >
                                                {isCollaborationActive ? 'Active' : 'Inactive'}
                                            </Button>
                                        </div>
                                        {isCollaborationActive && (
                                            <div className="mt-4 pt-4 border-t">
                                                <h5 className="text-sm font-medium mb-3">Active Collaborators</h5>
                                                <div className="space-y-2">
                                                    {collaborators.map(collaborator => (
                                                        <div
                                                            key={collaborator.id}
                                                            className="flex items-center justify-between text-sm"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className={cn(
                                                                    "w-2 h-2 rounded-full",
                                                                    collaborator.active ? "bg-green-500" : "bg-gray-400"
                                                                )} />
                                                                <span>{collaborator.name}</span>
                                                            </div>
                                                            <Badge variant="outline">{collaborator.role}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Card>

                                    {/* Performance Settings */}
                                    <Card className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="font-medium">Performance</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Optimize agent performance settings
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">Configure</Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}

export default AgentToolsPanel
