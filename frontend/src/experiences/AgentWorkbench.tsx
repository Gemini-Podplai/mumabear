import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Plus, Settings, Play, Pause, Square, Activity, TrendingUp,
  CheckCircle, AlertTriangle, Clock, Edit, Trash2, Copy,
  Brain, Zap, Database, Globe, Code, Users, Star
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Agent {
  id: string
  name: string
  description: string
  status: 'draft' | 'testing' | 'deployed' | 'error' | 'archived'
  template: string
  lastActivity: string
  performance: {
    successRate: number
    responseTime: number
    usageCount: number
    reliability: number
  }
  capabilities: string[]
  created: string
  version: string
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Research Specialist',
    description: 'Deep research and analysis with multi-source verification and comprehensive fact-checking capabilities.',
    status: 'deployed',
    template: 'research_agent',
    lastActivity: '5 minutes ago',
    performance: { successRate: 94, responseTime: 1200, usageCount: 47, reliability: 96 },
    capabilities: ['Web Research', 'Data Analysis', 'Fact Checking', 'Citation Management'],
    created: '2024-11-15',
    version: '2.1.0'
  },
  {
    id: '2',
    name: 'UI/UX Designer',
    description: 'Creative design assistance with user experience focus, wireframing, and design system creation.',
    status: 'testing',
    template: 'ui_ux_agent',
    lastActivity: '2 hours ago',
    performance: { successRate: 89, responseTime: 800, usageCount: 23, reliability: 92 },
    capabilities: ['Design Systems', 'Wireframing', 'Prototyping', 'User Research'],
    created: '2024-11-10',
    version: '1.5.2'
  },
  {
    id: '3',
    name: 'Code Review Assistant',  
    description: 'Automated code review with security analysis, performance optimization, and best practice recommendations.',
    status: 'deployed',
    template: 'code_review_agent',
    lastActivity: '15 minutes ago',
    performance: { successRate: 97, responseTime: 450, usageCount: 89, reliability: 98 },
    capabilities: ['Code Analysis', 'Security Scanning', 'Performance Review', 'Best Practices'],
    created: '2024-10-28',
    version: '3.0.1'
  },
  {
    id: '4',
    name: 'Content Strategist',
    description: 'Content creation and strategy with SEO optimization, audience analysis, and engagement tracking.',
    status: 'draft',
    template: 'content_agent',
    lastActivity: '1 day ago',
    performance: { successRate: 0, responseTime: 0, usageCount: 0, reliability: 0 },
    capabilities: ['Content Creation', 'SEO Optimization', 'Analytics', 'Social Media'],
    created: '2024-11-20',
    version: '0.1.0'
  }
]

const AgentCard: React.FC<{ agent: Agent; onAction: (action: string, agentId: string) => void }> = ({ 
  agent, 
  onAction 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-100 text-green-700 border-green-200'
      case 'testing': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'error': return 'bg-red-100 text-red-700 border-red-200'
      case 'archived': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-3 w-3" />
      case 'testing': return <Clock className="h-3 w-3" />
      case 'error': return <AlertTriangle className="h-3 w-3" />
      default: return <Bot className="h-3 w-3" />
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-sm">{agent.lastActivity}</CardDescription>
            </div>
          </div>
          <Badge className={cn("text-xs border", getStatusColor(agent.status))}>
            <div className="flex items-center gap-1">
              {getStatusIcon(agent.status)}
              <span className="capitalize">{agent.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
        
        {/* Capabilities */}
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map((capability, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
        </div>

        {/* Performance Metrics */}
        {agent.status !== 'draft' && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium">{agent.performance.successRate}%</span>
              </div>
              <Progress value={agent.performance.successRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Reliability</span>
                <span className="font-medium">{agent.performance.reliability}%</span>
              </div>
              <Progress value={agent.performance.reliability} className="h-2" />
            </div>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{agent.performance.usageCount}</div>
            <div className="text-xs text-muted-foreground">Uses</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{agent.performance.responseTime}ms</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">v{agent.version}</div>
            <div className="text-xs text-muted-foreground">Version</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onAction('edit', agent.id)}
          className="flex-1"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onAction('clone', agent.id)}
        >
          <Copy className="h-3 w-3 mr-1" />
          Clone
        </Button>
        {agent.status === 'deployed' ? (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAction('pause', agent.id)}
          >
            <Pause className="h-3 w-3 mr-1" />
          </Button>
        ) : (
          <Button 
            size="sm" 
            onClick={() => onAction('deploy', agent.id)}
          >
            <Play className="h-3 w-3 mr-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

const CreateAgentCard: React.FC<{ onCreate: () => void }> = ({ onCreate }) => {
  return (
    <Card className="border-dashed border-2 border-border/50 hover:border-primary/50 transition-colors cursor-pointer" onClick={onCreate}>
      <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Create New Agent</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start with a template or build from scratch to create your custom AI agent
        </p>
      </CardContent>
    </Card>
  )
}

const AgentWorkbench: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleAgentAction = (action: string, agentId: string) => {
    console.log(`Action: ${action} on agent: ${agentId}`)
    // Handle agent actions (edit, clone, deploy, pause, etc.)
  }

  const handleCreateAgent = () => {
    console.log('Creating new agent...')
    // Handle agent creation
  }

  const filteredAgents = agents.filter(agent => {
    const matchesFilter = filter === 'all' || agent.status === filter
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statusCounts = {
    all: agents.length,
    deployed: agents.filter(a => a.status === 'deployed').length,
    testing: agents.filter(a => a.status === 'testing').length,
    draft: agents.filter(a => a.status === 'draft').length,
    error: agents.filter(a => a.status === 'error').length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Workbench</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and monitor your AI agents
          </p>
        </div>
        <Button onClick={handleCreateAgent} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card 
            key={status} 
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50",
              filter === status && "ring-2 ring-primary"
            )}
            onClick={() => setFilter(status)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {status === 'all' ? 'Total' : status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateAgentCard onCreate={handleCreateAgent} />
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onAction={handleAgentAction}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No agents found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or create a new agent
          </p>
        </div>
      )}
    </div>
  )
}

export default AgentWorkbench
