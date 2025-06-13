import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Cpu, Database, Globe, Server, Wifi, AlertTriangle,
  CheckCircle, Clock, TrendingUp, TrendingDown, RefreshCw,
  Settings, Filter, BarChart3, Zap, MemoryStick, HardDrive,
  Network, Eye, Bell, Download, Upload, MonitorSpeaker
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface SystemComponent {
  id: string
  name: string
  type: 'frontend' | 'backend' | 'database' | 'ai_service' | 'external_api' | 'infrastructure'
  status: 'healthy' | 'warning' | 'critical' | 'offline'
  uptime: number
  responseTime: number
  errorRate: number
  lastCheck: string
  version?: string
  location?: string
  dependencies: string[]
  metrics: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
}

interface SystemAlert {
  id: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  component: string
  timestamp: string
  acknowledged: boolean
  resolved: boolean
}

const mockComponents: SystemComponent[] = [
  {
    id: 'frontend',
    name: 'React Frontend',
    type: 'frontend',
    status: 'healthy',
    uptime: 99.9,
    responseTime: 45,
    errorRate: 0.1,
    lastCheck: '2024-11-21T10:55:00Z',
    version: '2.1.3',
    location: 'CDN Edge',
    dependencies: ['backend-api', 'external-apis'],
    metrics: { cpu: 12, memory: 45, disk: 23, network: 67 }
  },
  {
    id: 'backend-api',
    name: 'Backend API',
    type: 'backend',
    status: 'healthy',
    uptime: 99.8,
    responseTime: 120,
    errorRate: 0.3,
    lastCheck: '2024-11-21T10:55:00Z',
    version: '3.2.1',
    location: 'us-east-1',
    dependencies: ['database', 'ai-services'],
    metrics: { cpu: 68, memory: 72, disk: 45, network: 89 }
  },
  {
    id: 'database',
    name: 'PostgreSQL Database',
    type: 'database',
    status: 'healthy',
    uptime: 99.9,
    responseTime: 25,
    errorRate: 0.0,
    lastCheck: '2024-11-21T10:55:00Z',
    version: '15.4',
    location: 'us-east-1',
    dependencies: [],
    metrics: { cpu: 35, memory: 78, disk: 67, network: 34 }
  },
  {
    id: 'ai-services',
    name: 'AI Services',
    type: 'ai_service',
    status: 'warning',
    uptime: 99.5,
    responseTime: 200,
    errorRate: 1.2,
    lastCheck: '2024-11-21T10:55:00Z',
    version: '1.8.5',
    location: 'multi-region',
    dependencies: ['external-apis'],
    metrics: { cpu: 89, memory: 67, disk: 34, network: 78 }
  },
  {
    id: 'external-apis',
    name: 'External APIs',
    type: 'external_api',
    status: 'warning',
    uptime: 98.2,
    responseTime: 450,
    errorRate: 2.1,
    lastCheck: '2024-11-21T10:55:00Z',
    location: 'various',
    dependencies: [],
    metrics: { cpu: 0, memory: 0, disk: 0, network: 45 }
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    type: 'infrastructure',
    status: 'healthy',
    uptime: 99.7,
    responseTime: 15,
    errorRate: 0.1,
    lastCheck: '2024-11-21T10:55:00Z',
    location: 'multi-az',
    dependencies: [],
    metrics: { cpu: 45, memory: 56, disk: 67, network: 78 }
  }
]

const mockAlerts: SystemAlert[] = [
  {
    id: '1',
    severity: 'warning',
    title: 'High CPU Usage',
    message: 'AI Services CPU usage is above 85% for the last 10 minutes',
    component: 'ai-services',
    timestamp: '2024-11-21T10:50:00Z',
    acknowledged: false,
    resolved: false
  },
  {
    id: '2',
    severity: 'warning',
    title: 'Increased Response Time',
    message: 'External APIs showing increased response times (>400ms average)',
    component: 'external-apis',
    timestamp: '2024-11-21T10:45:00Z',
    acknowledged: true,
    resolved: false
  },
  {
    id: '3',
    severity: 'info',
    title: 'Scheduled Maintenance',
    message: 'Database maintenance window scheduled for tonight 2:00 AM UTC',
    component: 'database',
    timestamp: '2024-11-21T09:30:00Z',
    acknowledged: true,
    resolved: false
  }
]

const ComponentCard: React.FC<{ 
  component: SystemComponent
  onAction: (action: string, componentId: string) => void 
}> = ({ component, onAction }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'offline': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-3 w-3" />
      case 'warning': return <AlertTriangle className="h-3 w-3" />
      case 'critical': return <AlertTriangle className="h-3 w-3" />
      case 'offline': return <Clock className="h-3 w-3" />
      default: return <Activity className="h-3 w-3" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'frontend': return <Globe className="h-5 w-5" />
      case 'backend': return <Server className="h-5 w-5" />
      case 'database': return <Database className="h-5 w-5" />
      case 'ai_service': return <Cpu className="h-5 w-5" />
      case 'external_api': return <Wifi className="h-5 w-5" />
      case 'infrastructure': return <Network className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {getTypeIcon(component.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{component.name}</CardTitle>
              <CardDescription className="text-sm">
                {component.version && `v${component.version} • `}
                {component.location}
              </CardDescription>
            </div>
          </div>
          <Badge className={cn("text-xs border", getStatusColor(component.status))}>
            <div className="flex items-center gap-1">
              {getStatusIcon(component.status)}
              <span className="capitalize">{component.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{component.uptime}%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{component.responseTime}ms</div>
            <div className="text-xs text-muted-foreground">Response</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{component.errorRate}%</div>
            <div className="text-xs text-muted-foreground">Error Rate</div>
          </div>
        </div>

        {/* Resource Usage */}
        {component.type !== 'external_api' && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">CPU</span>
                  <span className="font-medium">{component.metrics.cpu}%</span>
                </div>
                <Progress value={component.metrics.cpu} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="font-medium">{component.metrics.memory}%</span>
                </div>
                <Progress value={component.metrics.memory} className="h-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Disk</span>
                  <span className="font-medium">{component.metrics.disk}%</span>
                </div>
                <Progress value={component.metrics.disk} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">{component.metrics.network}%</span>
                </div>
                <Progress value={component.metrics.network} className="h-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Dependencies */}
        {component.dependencies.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Dependencies:</span>
            <div className="flex flex-wrap gap-1">
              {component.dependencies.map((dep, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const AlertCard: React.FC<{ 
  alert: SystemAlert
  onAction: (action: string, alertId: string) => void 
}> = ({ alert, onAction }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'error': return 'bg-red-100 text-red-700 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card className={cn(
      "border-l-4 transition-all duration-200",
      alert.severity === 'critical' && "border-l-red-500",
      alert.severity === 'warning' && "border-l-yellow-500",
      alert.severity === 'info' && "border-l-blue-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs border", getSeverityColor(alert.severity))}>
                {alert.severity.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">{alert.component}</span>
            </div>
            <h4 className="font-semibold">{alert.title}</h4>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
            <span className="text-xs text-muted-foreground">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            {!alert.acknowledged && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAction('acknowledge', alert.id)}
              >
                Ack
              </Button>
            )}
            {!alert.resolved && (
              <Button 
                size="sm"
                onClick={() => onAction('resolve', alert.id)}
              >
                Resolve
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SystemMonitor: React.FC = () => {
  const [components, setComponents] = useState<SystemComponent[]>(mockComponents)
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockAlerts)
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const handleComponentAction = (action: string, componentId: string) => {
    console.log(`Action: ${action} on component: ${componentId}`)
  }

  const handleAlertAction = (action: string, alertId: string) => {
    console.log(`Action: ${action} on alert: ${alertId}`)
    if (action === 'acknowledge') {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ))
    } else if (action === 'resolve') {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ))
    }
  }

  const healthyComponents = components.filter(c => c.status === 'healthy').length
  const warningComponents = components.filter(c => c.status === 'warning').length
  const criticalComponents = components.filter(c => c.status === 'critical').length
  const offlineComponents = components.filter(c => c.status === 'offline').length

  const activeAlerts = alerts.filter(a => !a.resolved)
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length
  const warningAlerts = activeAlerts.filter(a => a.severity === 'warning').length

  const overallHealth = Math.round((healthyComponents / components.length) * 100)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Real-time system health and performance monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", autoRefresh && "animate-spin")} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{overallHealth}%</div>
            <div className="text-sm text-muted-foreground">Overall Health</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{healthyComponents}</div>
            <div className="text-sm text-muted-foreground">Healthy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningComponents}</div>
            <div className="text-sm text-muted-foreground">Warning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{criticalComponents}</div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{activeAlerts.length}</div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({activeAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                onAction={handleComponentAction}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                onAction={handleComponentAction}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAction={handleAlertAction}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
              <p className="text-muted-foreground">
                All systems are running smoothly
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SystemMonitor
