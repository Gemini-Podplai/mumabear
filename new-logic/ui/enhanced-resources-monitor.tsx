import React, { useState, useEffect } from 'react';
import {
  BarChart3, Activity, Monitor, Cpu, HardDrive, Wifi, Zap,
  AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp,
  TrendingDown, DollarSign, Settings, RefreshCw, Eye,
  EyeOff, Maximize, Minimize, Filter, Search, Download,
  Server, Database, Cloud, Globe, Smartphone, Laptop,
  Memory, Network, Shield, Warning, Info, Bell,
  Play, Pause, Square, RotateCcw, Trash2, Edit,
  ArrowUp, ArrowDown, Calendar, Timer, Target,
  PieChart, LineChart, Users, MapPin, Coffee
} from 'lucide-react';

interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
    frequency: number;
  };
  memory: {
    used: number;
    total: number;
    available: number;
    cached: number;
  };
  disk: {
    used: number;
    total: number;
    available: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    download: number;
    upload: number;
    latency: number;
    connected: boolean;
  };
  gpu?: {
    usage: number;
    memory: number;
    temperature: number;
  };
}

interface ProcessInfo {
  id: string;
  name: string;
  type: 'e2b' | 'scrapybara' | 'ai' | 'system' | 'user';
  status: 'running' | 'stopped' | 'error' | 'starting';
  cpu: number;
  memory: number;
  uptime: number;
  logs: LogEntry[];
  cost: number;
  environment?: string;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
}

interface Alert {
  id: string;
  type: 'performance' | 'cost' | 'error' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actions?: { label: string; action: string }[];
}

interface EnhancedResourcesMonitorProps {
  theme: 'comfort' | 'professional' | 'custom';
}

const EnhancedResourcesMonitor: React.FC<EnhancedResourcesMonitorProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'processes' | 'logs' | 'alerts' | 'analytics'>('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);
  const [showCostAnalysis, setShowCostAnalysis] = useState(false);

  // Mock System Metrics
  useEffect(() => {
    const updateMetrics = () => {
      setSystemMetrics({
        cpu: {
          usage: 45 + Math.random() * 20,
          temperature: 58 + Math.random() * 10,
          cores: 8,
          frequency: 3.2
        },
        memory: {
          used: 8.2 + Math.random() * 2,
          total: 16,
          available: 7.8 - Math.random() * 2,
          cached: 2.1 + Math.random() * 0.5
        },
        disk: {
          used: 156.7 + Math.random() * 10,
          total: 512,
          available: 355.3 - Math.random() * 10,
          readSpeed: 450 + Math.random() * 100,
          writeSpeed: 380 + Math.random() * 80
        },
        network: {
          download: 25.6 + Math.random() * 50,
          upload: 8.2 + Math.random() * 20,
          latency: 12 + Math.random() * 8,
          connected: true
        },
        gpu: {
          usage: 23 + Math.random() * 30,
          memory: 4.2 + Math.random() * 2,
          temperature: 65 + Math.random() * 15
        }
      });
    };

    updateMetrics();
    if (isLiveMode) {
      const interval = setInterval(updateMetrics, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [isLiveMode, refreshInterval]);

  // Mock Processes Data
  useEffect(() => {
    setProcesses([
      {
        id: 'proc-1',
        name: 'E2B Environment Alpha',
        type: 'e2b',
        status: 'running',
        cpu: 15.2,
        memory: 512,
        uptime: 3600000,
        cost: 0.45,
        environment: 'python-data-science',
        logs: []
      },
      {
        id: 'proc-2',
        name: 'Scrapybara Instance',
        type: 'scrapybara',
        status: 'running',
        cpu: 8.7,
        memory: 256,
        uptime: 1800000,
        cost: 0.23,
        environment: 'web-scraper',
        logs: []
      },
      {
        id: 'proc-3',
        name: 'Vertex AI Service',
        type: 'ai',
        status: 'running',
        cpu: 12.4,
        memory: 1024,
        uptime: 7200000,
        cost: 1.15,
        logs: []
      },
      {
        id: 'proc-4',
        name: 'Background Sync',
        type: 'system',
        status: 'running',
        cpu: 2.1,
        memory: 64,
        uptime: 86400000,
        cost: 0.05,
        logs: []
      },
      {
        id: 'proc-5',
        name: 'Data Pipeline',
        type: 'user',
        status: 'error',
        cpu: 0,
        memory: 0,
        uptime: 0,
        cost: 0,
        logs: []
      }
    ]);

    setAlerts([
      {
        id: 'alert-1',
        type: 'performance',
        severity: 'medium',
        title: 'High CPU Usage Detected',
        message: 'E2B Environment Alpha is using 15% CPU for the last 10 minutes',
        timestamp: new Date(Date.now() - 600000),
        isRead: false,
        actions: [
          { label: 'View Process', action: 'view_process' },
          { label: 'Optimize', action: 'optimize' }
        ]
      },
      {
        id: 'alert-2',
        type: 'cost',
        severity: 'high',
        title: 'Daily Cost Limit Approaching',
        message: 'Current usage: $8.45 of $10.00 daily limit (84%)',
        timestamp: new Date(Date.now() - 300000),
        isRead: false,
        actions: [
          { label: 'View Costs', action: 'view_costs' },
          { label: 'Set Limit', action: 'set_limit' }
        ]
      },
      {
        id: 'alert-3',
        type: 'error',
        severity: 'critical',
        title: 'Process Crashed',
        message: 'Data Pipeline process has stopped unexpectedly',
        timestamp: new Date(Date.now() - 120000),
        isRead: false,
        actions: [
          { label: 'Restart', action: 'restart' },
          { label: 'View Logs', action: 'view_logs' }
        ]
      }
    ]);

    setLogs([
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 60000),
        level: 'info',
        message: 'E2B environment started successfully',
        source: 'E2B Environment Alpha'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 180000),
        level: 'warning',
        message: 'High memory usage detected (85%)',
        source: 'System Monitor'
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 300000),
        level: 'error',
        message: 'Connection timeout to external API',
        source: 'Data Pipeline'
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 420000),
        level: 'info',
        message: 'Scrapybara instance initialized',
        source: 'Scrapybara Instance'
      }
    ]);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'stopped': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'starting': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'debug': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const themeClasses = {
    comfort: {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      card: 'bg-white/80 backdrop-blur-md',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-purple-200',
      accent: 'bg-purple-500',
      hover: 'hover:bg-purple-100'
    },
    professional: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-gray-200',
      accent: 'bg-blue-500',
      hover: 'hover:bg-gray-100'
    },
    custom: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      accent: 'bg-purple-500',
      hover: 'hover:bg-gray-700'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${currentTheme.text} flex items-center space-x-3`}>
                <BarChart3 className="text-purple-500" size={32} />
                <span>Resources Monitor</span>
                <span className="text-lg text-purple-500">📊 Control Hub</span>
              </h1>
              <p className={`mt-2 ${currentTheme.textMuted}`}>
                Real-time system monitoring, process management, and performance analytics
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors flex items-center space-x-2 ${
                    isLiveMode ? 'bg-green-100 text-green-700 border-green-300' : ''
                  }`}
                >
                  {isLiveMode ? <Activity size={18} className="text-green-500" /> : <Pause size={18} />}
                  <span>{isLiveMode ? 'Live' : 'Paused'}</span>
                </button>

                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className={`px-3 py-2 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                >
                  <option value={1}>1s</option>
                  <option value={5}>5s</option>
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                </select>
              </div>

              <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2">
                <Settings size={18} />
                <span>Configure</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'overview', name: 'System Overview', icon: Monitor },
              { id: 'processes', name: 'Processes', icon: Activity },
              { id: 'logs', name: 'Logs', icon: FileText },
              { id: 'alerts', name: 'Alerts', icon: Bell },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-purple-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.name}</span>
                {tab.id === 'alerts' && alerts.filter(a => !a.isRead).length > 0 && (
                  <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alerts.filter(a => !a.isRead).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* System Overview Tab */}
        {activeTab === 'overview' && systemMetrics && (
          <div className="space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* CPU Card */}
              <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Cpu className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${currentTheme.text}`}>CPU</h3>
                      <p className={`text-sm ${currentTheme.textMuted}`}>{systemMetrics.cpu.cores} cores</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${currentTheme.text}`}>{systemMetrics.cpu.usage.toFixed(1)}%</p>
                    <p className={`text-xs ${currentTheme.textMuted}`}>{systemMetrics.cpu.temperature.toFixed(0)}°C</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      systemMetrics.cpu.usage > 80 ? 'bg-red-500' :
                      systemMetrics.cpu.usage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${systemMetrics.cpu.usage}%` }}
                  />
                </div>
              </div>

              {/* Memory Card */}
              <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Memory className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${currentTheme.text}`}>Memory</h3>
                      <p className={`text-sm ${currentTheme.textMuted}`}>{systemMetrics.memory.total} GB total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${currentTheme.text}`}>
                      {((systemMetrics.memory.used / systemMetrics.memory.total) * 100).toFixed(1)}%
                    </p>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      {systemMetrics.memory.used.toFixed(1)} GB used
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${(systemMetrics.memory.used / systemMetrics.memory.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Disk Card */}
              <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <HardDrive className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${currentTheme.text}`}>Storage</h3>
                      <p className={`text-sm ${currentTheme.textMuted}`}>{systemMetrics.disk.total} GB total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${currentTheme.text}`}>
                      {((systemMetrics.disk.used / systemMetrics.disk.total) * 100).toFixed(1)}%
                    </p>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      {systemMetrics.disk.used.toFixed(1)} GB used
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${(systemMetrics.disk.used / systemMetrics.disk.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Network Card */}
              <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Wifi className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${currentTheme.text}`}>Network</h3>
                      <p className={`text-sm ${currentTheme.textMuted}`}>
                        {systemMetrics.network.connected ? 'Connected' : 'Disconnected'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${currentTheme.text}`}>
                      ↓ {systemMetrics.network.download.toFixed(1)} MB/s
                    </p>
                    <p className={`text-sm font-medium ${currentTheme.text}`}>
                      ↑ {systemMetrics.network.upload.toFixed(1)} MB/s
                    </p>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      {systemMetrics.network.latency.toFixed(0)}ms latency
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${systemMetrics.network.connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              </div>
            </div>

            {/* Active Processes Overview */}
            <div className={`${currentTheme.card} rounded-xl border ${currentTheme.border} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>Active Processes</h2>
                <button
                  onClick={() => setActiveTab('processes')}
                  className="text-purple-500 hover:text-purple-600 transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {processes.slice(0, 4).map((process) => (
                  <div key={process.id} className={`p-4 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          process.status === 'running' ? 'bg-green-500' :
                          process.status === 'error' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />
                        <span className={`font-medium ${currentTheme.text}`}>{process.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(process.status)}`}>
                        {process.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className={`${currentTheme.textMuted}`}>CPU</p>
                        <p className={`font-medium ${currentTheme.text}`}>{process.cpu.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className={`${currentTheme.textMuted}`}>Memory</p>
                        <p className={`font-medium ${currentTheme.text}`}>{formatBytes(process.memory * 1024 * 1024)}</p>
                      </div>
                      <div>
                        <p className={`${currentTheme.textMuted}`}>Uptime</p>
                        <p className={`font-medium ${currentTheme.text}`}>{formatUptime(process.uptime)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${currentTheme.card} rounded-xl border ${currentTheme.border} p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Cost Analysis</h2>
                  <button
                    onClick={() => setShowCostAnalysis(!showCostAnalysis)}
                    className="text-purple-500 hover:text-purple-600 transition-colors"
                  >
                    {showCostAnalysis ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`${currentTheme.textMuted}`}>Today's Usage</span>
                    <span className={`font-bold text-2xl ${currentTheme.text}`}>$8.45</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full" style={{ width: '84%' }} />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={`${currentTheme.textMuted}`}>$0</span>
                    <span className={`${currentTheme.textMuted}`}>Daily Limit: $10.00</span>
                  </div>

                  <div className="space-y-2 mt-4">
                    {processes.map((process) => (
                      <div key={process.id} className="flex items-center justify-between">
                        <span className={`text-sm ${currentTheme.textMuted}`}>{process.name}</span>
                        <span className={`text-sm font-medium ${currentTheme.text}`}>${process.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${currentTheme.card} rounded-xl border ${currentTheme.border} p-6`}>
                <h2 className={`text-xl font-bold ${currentTheme.text} mb-6`}>System Health</h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className={`${currentTheme.text}`}>All services operational</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="text-yellow-500" size={20} />
                    <span className={`${currentTheme.text}`}>1 warning detected</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <XCircle className="text-red-500" size={20} />
                    <span className={`${currentTheme.text}`}>1 critical issue</span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${currentTheme.textMuted}`}>Overall Score</span>
                      <span className={`text-2xl font-bold text-green-600`}>87/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processes Tab */}
        {activeTab === 'processes' && (
          <div className="space-y-6">
            <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>Running Processes</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search processes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-10 pr-4 py-2 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                    />
                  </div>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {processes.map((process) => (
                  <div key={process.id} className={`border ${currentTheme.border} rounded-lg p-4 ${currentTheme.hover} transition-all duration-200`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          process.status === 'running' ? 'bg-green-500 animate-pulse' :
                          process.status === 'error' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />

                        <div>
                          <h3 className={`font-semibold ${currentTheme.text}`}>{process.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-sm ${currentTheme.textMuted}`}>
                              Type: {process.type.toUpperCase()}
                            </span>
                            {process.environment && (
                              <span className={`text-sm ${currentTheme.textMuted}`}>
                                Env: {process.environment}
                              </span>
                            )}
                            <span className={`text-sm ${currentTheme.textMuted}`}>
                              Uptime: {formatUptime(process.uptime)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className={`text-sm font-medium ${currentTheme.text}`}>CPU: {process.cpu.toFixed(1)}%</p>
                          <p className={`text-sm ${currentTheme.textMuted}`}>
                            RAM: {formatBytes(process.memory * 1024 * 1024)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className={`text-sm font-medium ${currentTheme.text}`}>${process.cost.toFixed(2)}</p>
                          <p className={`text-sm ${currentTheme.textMuted}`}>cost/hour</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          {process.status === 'running' && (
                            <button className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                              <Pause size={16} />
                            </button>
                          )}
                          {process.status === 'stopped' && (
                            <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                              <Play size={16} />
                            </button>
                          )}
                          {process.status === 'error' && (
                            <button className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                              <RotateCcw size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedProcess(expandedProcess === process.id ? null : process.id)}
                            className={`p-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                            <Square size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedProcess === process.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className={`font-medium ${currentTheme.text} mb-3`}>Resource Usage</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className={`text-sm ${currentTheme.textMuted}`}>CPU Usage</span>
                                  <span className={`text-sm font-medium ${currentTheme.text}`}>{process.cpu.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${process.cpu}%` }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className={`text-sm ${currentTheme.textMuted}`}>Memory Usage</span>
                                  <span className={`text-sm font-medium ${currentTheme.text}`}>
                                    {formatBytes(process.memory * 1024 * 1024)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="h-2 bg-green-500 rounded-full" style={{ width: `${(process.memory / 1024) * 100}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className={`font-medium ${currentTheme.text} mb-3`}>Recent Logs</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {logs.slice(0, 3).map((log) => (
                                <div key={log.id} className="text-sm">
                                  <span className={`font-medium ${getLevelColor(log.level)}`}>
                                    [{log.level.toUpperCase()}]
                                  </span>
                                  <span className={`ml-2 ${currentTheme.textMuted}`}>
                                    {log.message}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>System Alerts</h2>
                <div className="flex items-center space-x-3">
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className={`px-3 py-2 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                  >
                    <option value="all">All Alerts</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    Mark All Read
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-red-500' :
                    alert.severity === 'high' ? 'border-orange-500' :
                    alert.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'
                  } bg-white rounded-lg p-4 shadow-sm`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className={`text-sm ${currentTheme.textMuted}`}>
                            {alert.timestamp.toLocaleString()}
                          </span>
                          {!alert.isRead && (
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                        <h3 className={`font-semibold ${currentTheme.text} mb-1`}>{alert.title}</h3>
                        <p className={`${currentTheme.textMuted}`}>{alert.message}</p>

                        {alert.actions && (
                          <div className="flex items-center space-x-2 mt-3">
                            {alert.actions.map((action, idx) => (
                              <button key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button className={`p-2 rounded-lg ${currentTheme.hover} transition-colors`}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>System Logs</h2>
                <div className="flex items-center space-x-3">
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className={`px-3 py-2 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                  >
                    <option value="all">All Levels</option>
                    <option value="error">Errors</option>
                    <option value="warning">Warnings</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
                {logs.map((log) => (
                  <div key={log.id} className={`p-3 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}>
                    <div className="flex items-start space-x-4">
                      <span className={`text-xs ${currentTheme.textMuted} min-w-[120px]`}>
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className={`text-xs font-medium ${getLevelColor(log.level)} min-w-[80px]`}>
                        [{log.level.toUpperCase()}]
                      </span>
                      <span className={`text-xs ${currentTheme.textMuted} min-w-[150px]`}>
                        {log.source}
                      </span>
                      <span className={`${currentTheme.text} flex-1`}>
                        {log.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <TrendingUp size={64} className="mx-auto text-purple-500 mb-4" />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>Performance Analytics</h3>
              <p className={`${currentTheme.textMuted} mb-6`}>
                Detailed charts and insights coming soon
              </p>
              <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Configure Analytics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedResourcesMonitor;
