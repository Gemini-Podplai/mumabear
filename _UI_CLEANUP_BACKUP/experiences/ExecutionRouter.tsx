import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Activity, TrendingUp, Clock, CheckCircle, AlertTriangle,
  ArrowRight, RefreshCw, Settings, Filter, Search, BarChart3,
  MessageSquare, Bot, Code, Globe, Database, Cpu, Network,
  PlayCircle, PauseCircle, StopCircle, Target, Layers
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  type: 'chat' | 'analysis' | 'code' | 'research' | 'automation'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'queued' | 'routing' | 'executing' | 'completed' | 'failed' | 'cancelled'
  assignedAgent?: string
  estimatedTime: number
  actualTime?: number
  created: string
  startedAt?: string
  completedAt?: string
  route: {
    confidence: number
    reasoning: string
    fallbacks: string[]
  }
  metrics: {
    complexity: number
    resourceUsage: number
    successProbability: number
  }
}

interface RouterMetrics {
  totalTasks: number
  successRate: number
  averageRouteTime: number
  activeRoutes: number
  queuedTasks: number
  failedTasks: number
  routingAccuracy: number
  systemLoad: number
}

const mockTasks: Task[] = [
  {
    id: '1',
    type: 'chat',
    title: 'Complex React Optimization Query',
    description: 'User asking for advanced React performance optimization strategies with code examples',
    priority: 'high',
    status: 'executing',
    assignedAgent: 'Code Specialist',
    estimatedTime: 180,
    actualTime: 145,
    created: '2024-11-21T10:30:00Z',
    startedAt: '2024-11-21T10:31:00Z',
    route: {
      confidence: 92,
      reasoning: 'High technical complexity detected, routing to specialized code agent',
      fallbacks: ['General Assistant', 'Research Specialist']
    },
    metrics: {
      complexity: 8.5,
      resourceUsage: 75,
      successProbability: 94
    }
  },
  {
    id: '2',
    type: 'research',
    title: 'Market Analysis Request',
    description: 'Comprehensive market research for SaaS pricing strategies',
    priority: 'medium',
    status: 'completed',
    assignedAgent: 'Research Specialist',
    estimatedTime: 300,
    actualTime: 275,
    created: '2024-11-21T09:15:00Z',
    startedAt: '2024-11-21T09:16:00Z',
    completedAt: '2024-11-21T09:21:00Z',
    route: {
      confidence: 96,
      reasoning: 'Research task identified with specific domain expertise required',
      fallbacks: ['Business Analyst', 'General Assistant']
    },
    metrics: {
      complexity: 7.2,
      resourceUsage: 68,
      successProbability: 97
    }
  },
  {
    id: '3',
    type: 'automation',
    title: 'API Integration Setup',
    description: 'Automated setup of third-party API integrations with error handling',
    priority: 'critical',
    status: 'routing',
    estimatedTime: 450,
    created: '2024-11-21T10:45:00Z',
    route: {
      confidence: 87,
      reasoning: 'Complex automation task requiring API expertise and error handling',
      fallbacks: ['DevOps Specialist', 'Code Specialist']
    },
    metrics: {
      complexity: 9.1,
      resourceUsage: 85,
      successProbability: 89
    }
  },
  {
    id: '4',
    type: 'analysis',
    title: 'Performance Bottleneck Analysis',
    description: 'Deep analysis of application performance issues with optimization recommendations',
    priority: 'high',
    status: 'queued',
    estimatedTime: 240,
    created: '2024-11-21T10:50:00Z',
    route: {
      confidence: 0,
      reasoning: 'Pending routing analysis',
      fallbacks: []
    },
    metrics: {
      complexity: 7.8,
      resourceUsage: 0,
      successProbability: 0
    }
  }
]

const mockMetrics: RouterMetrics = {
  totalTasks: 1247,
  successRate: 94.7,
  averageRouteTime: 2.3,
  activeRoutes: 5,
  queuedTasks: 3,
  failedTasks: 12,
  routingAccuracy: 96.2,
  systemLoad: 72
}

const TaskCard: React.FC<{ task: Task; onAction: (action: string, taskId: string) => void }> = ({ 
  task, 
  onAction 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'executing': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'routing': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'queued': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'failed': return 'bg-red-100 text-red-700 border-red-200'
      case 'cancelled': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageSquare className="h-4 w-4" />
      case 'analysis': return <BarChart3 className="h-4 w-4" />
      case 'code': return <Code className="h-4 w-4" />
      case 'research': return <Search className="h-4 w-4" />
      case 'automation': return <Cpu className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />
      case 'executing': return <PlayCircle className="h-3 w-3" />
      case 'routing': return <RefreshCw className="h-3 w-3 animate-spin" />
      case 'queued': return <Clock className="h-3 w-3" />
      case 'failed': return <AlertTriangle className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {getTypeIcon(task.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <CardDescription className="text-sm">
                {task.assignedAgent ? `Assigned to ${task.assignedAgent}` : 'Pending assignment'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
            <Badge className={cn("text-xs border", getStatusColor(task.status))}>
              <div className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                <span className="capitalize">{task.status}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
        
        {/* Route Information */}
        {task.route.confidence > 0 && (
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Route Confidence</span>
              <span className="font-medium">{task.route.confidence}%</span>
            </div>
            <Progress value={task.route.confidence} className="h-2" />
            <p className="text-xs text-muted-foreground">{task.route.reasoning}</p>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{task.metrics.complexity.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Complexity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{task.estimatedTime}s</div>
            <div className="text-xs text-muted-foreground">Est. Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{task.metrics.successProbability || 0}%</div>
            <div className="text-xs text-muted-foreground">Success Prob.</div>
          </div>
        </div>

        {/* Fallback Agents */}
        {task.route.fallbacks.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Fallback Agents:</span>
            <div className="flex flex-wrap gap-1">
              {task.route.fallbacks.map((fallback, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {fallback}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const MetricsOverview: React.FC<{ metrics: RouterMetrics }> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{metrics.totalTasks}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{metrics.successRate}%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{metrics.averageRouteTime}s</div>
          <div className="text-sm text-muted-foreground">Avg Route Time</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{metrics.activeRoutes}</div>
          <div className="text-sm text-muted-foreground">Active Routes</div>
        </CardContent>
      </Card>
    </div>
  )
}

const ExecutionRouter: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [metrics, setMetrics] = useState<RouterMetrics>(mockMetrics)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleTaskAction = (action: string, taskId: string) => {
    console.log(`Action: ${action} on task: ${taskId}`)
    // Handle task actions
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statusCounts = {
    all: tasks.length,
    queued: tasks.filter(t => t.status === 'queued').length,
    routing: tasks.filter(t => t.status === 'routing').length,
    executing: tasks.filter(t => t.status === 'executing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Execution Router</h1>
          <p className="text-muted-foreground mt-1">
            Intelligent task routing and execution monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview metrics={metrics} />

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Routing Accuracy</span>
                <span className="font-medium">{metrics.routingAccuracy}%</span>
              </div>
              <Progress value={metrics.routingAccuracy} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">System Load</span>
                <span className="font-medium">{metrics.systemLoad}%</span>
              </div>
              <Progress value={metrics.systemLoad} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium">{metrics.successRate}%</span>
              </div>
              <Progress value={metrics.successRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Queue Health</span>
                <span className="font-medium">{100 - (metrics.queuedTasks / metrics.totalTasks * 100)}%</span>
              </div>
              <Progress value={100 - (metrics.queuedTasks / metrics.totalTasks * 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Tasks ({statusCounts.all})</option>
          <option value="queued">Queued ({statusCounts.queued})</option>
          <option value="routing">Routing ({statusCounts.routing})</option>
          <option value="executing">Executing ({statusCounts.executing})</option>
          <option value="completed">Completed ({statusCounts.completed})</option>
          <option value="failed">Failed ({statusCounts.failed})</option>
        </select>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAction={handleTaskAction}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

export default ExecutionRouter
