import {
  ArrowRight,
  Box,
  Code,
  Download,
  Eye,
  FileText,
  Gamepad2,
  Globe,
  Heart,
  Maximize,
  Minimize,
  Monitor,
  Palette,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  Star,
  TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MiniApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'active' | 'inactive' | 'development' | 'error';
  type: 'widget' | 'tool' | 'game' | 'utility' | 'productivity';
  version: string;
  author: string;
  rating: number;
  downloads: number;
  lastUpdated: Date;
  size: string; // 'small', 'medium', 'large', 'full'
  capabilities: string[];
  dependencies: string[];
  isInstalled: boolean;
  isFavorite: boolean;
  url?: string;
  previewImage?: string;
  config: any;
}

interface AppCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
}

interface AppWidget {
  id: string;
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
  isMinimized: boolean;
}

interface EnhancedMiniAppsProps {
  theme: 'comfort' | 'professional' | 'custom';
}

const EnhancedMiniApps: React.FC<EnhancedMiniAppsProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'installed' | 'store' | 'development' | 'widgets'>('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [miniApps, setMiniApps] = useState<MiniApp[]>([]);
  const [activeWidgets, setActiveWidgets] = useState<AppWidget[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [isAppBuilderOpen, setIsAppBuilderOpen] = useState(false);
  const [showAppDetails, setShowAppDetails] = useState<string | null>(null);

  // Mock Mini Apps Data
  useEffect(() => {
    setMiniApps([
      {
        id: 'weather-widget',
        name: 'Weather Widget',
        description: 'Real-time weather updates and forecasts',
        icon: '🌤️',
        category: 'Utilities',
        status: 'active',
        type: 'widget',
        version: '2.1.0',
        author: 'WeatherCorp',
        rating: 4.8,
        downloads: 15420,
        lastUpdated: new Date(Date.now() - 86400000),
        size: 'medium',
        capabilities: ['GPS Location', 'API Integration', 'Push Notifications'],
        dependencies: ['location-service', 'weather-api'],
        isInstalled: true,
        isFavorite: true,
        config: { unit: 'celsius', location: 'auto' }
      },
      {
        id: 'task-manager',
        name: 'Quick Tasks',
        description: 'Lightweight task management and reminders',
        icon: '✅',
        category: 'Productivity',
        status: 'active',
        type: 'tool',
        version: '1.5.2',
        author: 'ProductivityPro',
        rating: 4.9,
        downloads: 23156,
        lastUpdated: new Date(Date.now() - 172800000),
        size: 'large',
        capabilities: ['Local Storage', 'Sync', 'Notifications'],
        dependencies: ['storage-api'],
        isInstalled: true,
        isFavorite: true,
        config: { theme: 'minimal', autoSync: true }
      },
      {
        id: 'color-picker',
        name: 'Color Palette Tool',
        description: 'Advanced color picker and palette generator',
        icon: '🎨',
        category: 'Design',
        status: 'active',
        type: 'tool',
        version: '3.0.1',
        author: 'DesignTools',
        rating: 4.7,
        downloads: 8743,
        lastUpdated: new Date(Date.now() - 259200000),
        size: 'medium',
        capabilities: ['Color Analysis', 'Export Formats', 'History'],
        dependencies: [],
        isInstalled: true,
        isFavorite: false,
        config: { format: 'hex', history: 20 }
      },
      {
        id: 'calc-pro',
        name: 'Calculator Pro',
        description: 'Scientific calculator with programming functions',
        icon: '🧮',
        category: 'Utilities',
        status: 'active',
        type: 'tool',
        version: '4.2.1',
        author: 'MathSoft',
        rating: 4.6,
        downloads: 31287,
        lastUpdated: new Date(Date.now() - 432000000),
        size: 'small',
        capabilities: ['Scientific Functions', 'Programming Mode', 'History'],
        dependencies: [],
        isInstalled: true,
        isFavorite: false,
        config: { mode: 'scientific', precision: 10 }
      },
      {
        id: 'music-player',
        name: 'Ambient Player',
        description: 'Focus music and ambient sounds player',
        icon: '🎵',
        category: 'Entertainment',
        status: 'inactive',
        type: 'utility',
        version: '1.8.0',
        author: 'SoundScape',
        rating: 4.5,
        downloads: 12934,
        lastUpdated: new Date(Date.now() - 604800000),
        size: 'medium',
        capabilities: ['Audio Streaming', 'Offline Mode', 'Timers'],
        dependencies: ['audio-api'],
        isInstalled: true,
        isFavorite: true,
        config: { volume: 70, autoplay: false }
      },
      {
        id: 'code-snippet',
        name: 'Code Snippets',
        description: 'Quick access to code snippets and templates',
        icon: '💻',
        category: 'Development',
        status: 'development',
        type: 'tool',
        version: '0.9.5',
        author: 'DevTools Inc',
        rating: 4.3,
        downloads: 5672,
        lastUpdated: new Date(Date.now() - 172800000),
        size: 'large',
        capabilities: ['Syntax Highlighting', 'Search', 'Categories'],
        dependencies: ['highlight-js'],
        isInstalled: true,
        isFavorite: false,
        config: { language: 'auto', theme: 'dark' }
      },
      {
        id: 'mindfulness',
        name: 'Mindfulness Timer',
        description: 'Meditation and breathing exercise timer',
        icon: '🧘',
        category: 'Health',
        status: 'active',
        type: 'utility',
        version: '2.3.1',
        author: 'ZenApps',
        rating: 4.9,
        downloads: 18756,
        lastUpdated: new Date(Date.now() - 345600000),
        size: 'small',
        capabilities: ['Timer Functions', 'Sound Effects', 'Progress Tracking'],
        dependencies: [],
        isInstalled: true,
        isFavorite: true,
        config: { defaultTime: 10, sounds: true }
      },
      {
        id: 'emoji-picker',
        name: 'Emoji Studio',
        description: 'Advanced emoji picker with reactions and combinations',
        icon: '😊',
        category: 'Utilities',
        status: 'active',
        type: 'tool',
        version: '1.6.0',
        author: 'EmojiCorp',
        rating: 4.4,
        downloads: 9823,
        lastUpdated: new Date(Date.now() - 518400000),
        size: 'small',
        capabilities: ['Search', 'Categories', 'Recent History'],
        dependencies: [],
        isInstalled: false,
        isFavorite: false,
        config: { skin: 'default', recent: 50 }
      },
      {
        id: 'unit-converter',
        name: 'Unit Converter',
        description: 'Convert between different units and measurements',
        icon: '📏',
        category: 'Utilities',
        status: 'active',
        type: 'tool',
        version: '3.1.2',
        author: 'ConvertIt',
        rating: 4.7,
        downloads: 14562,
        lastUpdated: new Date(Date.now() - 691200000),
        size: 'medium',
        capabilities: ['Multiple Categories', 'Precision Control', 'Favorites'],
        dependencies: [],
        isInstalled: false,
        isFavorite: false,
        config: { precision: 6, favorites: [] }
      },
      {
        id: 'qr-generator',
        name: 'QR Code Studio',
        description: 'Generate and scan QR codes with custom designs',
        icon: '📱',
        category: 'Utilities',
        status: 'active',
        type: 'tool',
        version: '2.4.0',
        author: 'QRTech',
        rating: 4.6,
        downloads: 11234,
        lastUpdated: new Date(Date.now() - 777600000),
        size: 'medium',
        capabilities: ['Custom Design', 'Batch Generation', 'Export Formats'],
        dependencies: [],
        isInstalled: false,
        isFavorite: false,
        config: { size: 256, format: 'png' }
      }
    ]);

    setActiveWidgets([
      {
        id: 'widget-1',
        appId: 'weather-widget',
        position: { x: 20, y: 20 },
        size: { width: 300, height: 200 },
        config: {},
        isMinimized: false
      },
      {
        id: 'widget-2',
        appId: 'task-manager',
        position: { x: 350, y: 20 },
        size: { width: 400, height: 300 },
        config: {},
        isMinimized: false
      }
    ]);
  }, []);

  const categories: AppCategory[] = [
    { id: 'all', name: 'All Apps', icon: Box, color: 'gray', count: miniApps.length },
    { id: 'Productivity', name: 'Productivity', icon: TrendingUp, color: 'blue', count: miniApps.filter(app => app.category === 'Productivity').length },
    { id: 'Utilities', name: 'Utilities', icon: Settings, color: 'green', count: miniApps.filter(app => app.category === 'Utilities').length },
    { id: 'Design', name: 'Design', icon: Palette, color: 'purple', count: miniApps.filter(app => app.category === 'Design').length },
    { id: 'Development', name: 'Development', icon: Code, color: 'orange', count: miniApps.filter(app => app.category === 'Development').length },
    { id: 'Entertainment', name: 'Entertainment', icon: Gamepad2, color: 'pink', count: miniApps.filter(app => app.category === 'Entertainment').length },
    { id: 'Health', name: 'Health', icon: Heart, color: 'red', count: miniApps.filter(app => app.category === 'Health').length }
  ];

  const filteredApps = miniApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesTab =
      (activeTab === 'installed' && app.isInstalled) ||
      (activeTab === 'store' && !app.isInstalled) ||
      (activeTab === 'development' && app.status === 'development') ||
      activeTab === 'widgets';

    return matchesSearch && matchesCategory && matchesTab;
  });

  const installApp = async (appId: string) => {
    setMiniApps(prev => prev.map(app =>
      app.id === appId ? { ...app, isInstalled: true } : app
    ));
  };

  const uninstallApp = async (appId: string) => {
    setMiniApps(prev => prev.map(app =>
      app.id === appId ? { ...app, isInstalled: false } : app
    ));
    setActiveWidgets(prev => prev.filter(widget => widget.appId !== appId));
  };

  const toggleFavorite = (appId: string) => {
    setMiniApps(prev => prev.map(app =>
      app.id === appId ? { ...app, isFavorite: !app.isFavorite } : app
    ));
  };

  const toggleAppStatus = (appId: string) => {
    setMiniApps(prev => prev.map(app =>
      app.id === appId
        ? { ...app, status: app.status === 'active' ? 'inactive' : 'active' }
        : app
    ));
  };

  const launchWidget = (appId: string) => {
    const app = miniApps.find(a => a.id === appId);
    if (!app || !app.isInstalled) return;

    const newWidget: AppWidget = {
      id: `widget-${Date.now()}`,
      appId,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      size: {
        width: app.size === 'small' ? 250 : app.size === 'medium' ? 350 : 500,
        height: app.size === 'small' ? 200 : app.size === 'medium' ? 300 : 400
      },
      config: app.config,
      isMinimized: false
    };

    setActiveWidgets(prev => [...prev, newWidget]);
  };

  const closeWidget = (widgetId: string) => {
    setActiveWidgets(prev => prev.filter(w => w.id !== widgetId));
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
    <div className={`min-h-screen ${currentTheme.bg} relative`}>
      {/* Active Widgets Layer */}
      {activeTab === 'widgets' && (
        <div className="absolute inset-0 z-10">
          {activeWidgets.map((widget) => {
            const app = miniApps.find(a => a.id === widget.appId);
            if (!app) return null;

            return (
              <div
                key={widget.id}
                className={`absolute ${currentTheme.card} rounded-xl border ${currentTheme.border} shadow-lg overflow-hidden`}
                style={{
                  left: widget.position.x,
                  top: widget.position.y,
                  width: widget.size.width,
                  height: widget.isMinimized ? 50 : widget.size.height
                }}
              >
                <div className={`flex items-center justify-between p-3 border-b ${currentTheme.border} bg-gradient-to-r from-purple-500 to-pink-500 text-white`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{app.icon}</span>
                    <span className="font-medium text-sm">{app.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setActiveWidgets(prev => prev.map(w =>
                        w.id === widget.id ? { ...w, isMinimized: !w.isMinimized } : w
                      ))}
                      className="p-1 rounded hover:bg-white/20"
                    >
                      {widget.isMinimized ? <Maximize size={14} /> : <Minimize size={14} />}
                    </button>
                    <button
                      onClick={() => closeWidget(widget.id)}
                      className="p-1 rounded hover:bg-white/20"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {!widget.isMinimized && (
                  <div className="p-4">
                    {/* Widget Content Based on App Type */}
                    {app.id === 'weather-widget' && (
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-3xl mb-2">☀️</div>
                          <div className={`text-2xl font-bold ${currentTheme.text}`}>72°F</div>
                          <div className={`text-sm ${currentTheme.textMuted}`}>Partly Cloudy</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className={`text-xs ${currentTheme.textMuted}`}>High</div>
                            <div className={`font-medium ${currentTheme.text}`}>75°</div>
                          </div>
                          <div>
                            <div className={`text-xs ${currentTheme.textMuted}`}>Low</div>
                            <div className={`font-medium ${currentTheme.text}`}>68°</div>
                          </div>
                          <div>
                            <div className={`text-xs ${currentTheme.textMuted}`}>Rain</div>
                            <div className={`font-medium ${currentTheme.text}`}>10%</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {app.id === 'task-manager' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${currentTheme.text}`}>Quick Tasks</h3>
                          <button className="p-1 rounded hover:bg-gray-100">
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          {[
                            { text: 'Review pull requests', done: false },
                            { text: 'Update documentation', done: true },
                            { text: 'Team meeting at 3pm', done: false }
                          ].map((task, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={task.done}
                                className="rounded"
                                readOnly
                              />
                              <span className={`text-sm ${task.done ? 'line-through text-gray-400' : currentTheme.text}`}>
                                {task.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.id === 'mindfulness' && (
                      <div className="text-center space-y-4">
                        <div className="text-6xl font-bold text-purple-500">05:00</div>
                        <div className={`text-sm ${currentTheme.textMuted}`}>Breathing Exercise</div>
                        <div className="flex justify-center space-x-2">
                          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm">
                            Start
                          </button>
                          <button className={`px-4 py-2 border ${currentTheme.border} rounded-lg text-sm`}>
                            Settings
                          </button>
                        </div>
                      </div>
                    )}

                    {!['weather-widget', 'task-manager', 'mindfulness'].includes(app.id) && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">{app.icon}</div>
                        <div className={`text-sm ${currentTheme.textMuted}`}>
                          {app.name} Widget
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Widget Mode Overlay Controls */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setActiveTab('installed')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <ArrowRight size={16} />
              <span>Exit Widget Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Main App Manager Interface */}
      {activeTab !== 'widgets' && (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={`text-3xl font-bold ${currentTheme.text} flex items-center space-x-3`}>
                    <Palette className="text-purple-500" size={32} />
                    <span>Mini Apps</span>
                    <span className="text-lg text-purple-500">🚀 App Manager</span>
                  </h1>
                  <p className={`mt-2 ${currentTheme.textMuted}`}>
                    Discover, install, and manage lightweight applications and widgets for your workspace
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveTab('widgets')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Monitor size={18} />
                    <span>Widget Mode</span>
                  </button>
                  <button
                    onClick={() => setIsAppBuilderOpen(true)}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>Create App</span>
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mt-6 flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'installed', name: 'My Apps', icon: Box },
                  { id: 'store', name: 'App Store', icon: Globe },
                  { id: 'development', name: 'Development', icon: Code },
                  { id: 'widgets', name: 'Widget Mode', icon: Monitor }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id
                        ? 'bg-white shadow-sm text-purple-600 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border} mb-6`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search apps..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${currentTheme.card}`}
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-3 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.count})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-3 border ${currentTheme.border} rounded-lg focus:ring-2 focus:ring-purple-500 ${currentTheme.card}`}
                  >
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="downloads">Downloads</option>
                    <option value="lastUpdated">Last Updated</option>
                  </select>

                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : currentTheme.hover}`}
                    >
                      <Box size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : currentTheme.hover}`}
                    >
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Quick Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                {categories.slice(1).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${selectedCategory === category.id
                        ? 'bg-purple-500 text-white border-purple-500'
                        : `${currentTheme.card} ${currentTheme.border} ${currentTheme.hover}`
                      }`}
                  >
                    <category.icon size={16} />
                    <span>{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Apps Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className={`${currentTheme.card} rounded-xl border ${currentTheme.border} p-6 hover:shadow-lg transition-all duration-200 group relative`}
                >
                  {/* App Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${currentTheme.text} group-hover:text-purple-600 transition-colors`}>
                          {app.name}
                        </h3>
                        <p className={`text-sm ${currentTheme.textMuted} mt-1 line-clamp-2`}>
                          {app.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {app.category}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            v{app.version}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'active' ? 'bg-green-100 text-green-800' :
                          app.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            app.status === 'development' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                        }`}>
                        {app.status}
                      </span>
                      <button
                        onClick={() => toggleFavorite(app.id)}
                        className={`p-1 rounded transition-colors ${app.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <Heart size={16} fill={app.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* App Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center space-x-1">
                        <Star size={12} className="text-yellow-500" />
                        <span className={`text-sm font-medium ${currentTheme.text}`}>{app.rating}</span>
                      </div>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Rating</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${currentTheme.text}`}>{app.downloads.toLocaleString()}</p>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Downloads</p>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mb-4">
                    <p className={`text-xs ${currentTheme.textMuted} mb-2`}>Capabilities</p>
                    <div className="flex flex-wrap gap-1">
                      {app.capabilities.slice(0, 2).map((cap, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {cap}
                        </span>
                      ))}
                      {app.capabilities.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{app.capabilities.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {app.isInstalled ? (
                      <>
                        <button
                          onClick={() => launchWidget(app.id)}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Play size={16} />
                          <span>Launch</span>
                        </button>
                        <button
                          onClick={() => toggleAppStatus(app.id)}
                          className={`px-3 py-2 rounded-lg transition-colors ${app.status === 'active'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                        >
                          {app.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => setShowAppDetails(app.id)}
                          className={`px-3 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}
                        >
                          <Settings size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => installApp(app.id)}
                          className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download size={16} />
                          <span>Install</span>
                        </button>
                        <button
                          onClick={() => setShowAppDetails(app.id)}
                          className={`px-3 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}
                        >
                          <Eye size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredApps.length === 0 && (
              <div className="text-center py-12">
                <Box size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>No Apps Found</h3>
                <p className={`${currentTheme.textMuted} mb-6`}>
                  Try adjusting your search criteria or explore different categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* App Builder Modal */}
      {isAppBuilderOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme.card} rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${currentTheme.text}`}>Create New Mini App</h2>
              <button
                onClick={() => setIsAppBuilderOpen(false)}
                className={`p-2 rounded-lg ${currentTheme.hover}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center py-12">
              <Code size={64} className="mx-auto text-purple-500 mb-4" />
              <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>App Builder Studio</h3>
              <p className={`${currentTheme.textMuted} mb-6`}>
                Create custom widgets and tools with our visual app builder
              </p>
              <div className="flex space-x-4 justify-center">
                <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Visual Builder
                </button>
                <button className={`px-6 py-3 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}>
                  Code Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Details Modal */}
      {showAppDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme.card} rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto`}>
            {(() => {
              const app = miniApps.find(a => a.id === showAppDetails);
              if (!app) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${currentTheme.text}`}>{app.name}</h2>
                    <button
                      onClick={() => setShowAppDetails(null)}
                      className={`p-2 rounded-lg ${currentTheme.hover}`}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-3xl">
                        {app.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`${currentTheme.textMuted} mb-4`}>{app.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className={`text-sm font-medium ${currentTheme.text}`}>Version</p>
                            <p className={`text-sm ${currentTheme.textMuted}`}>{app.version}</p>
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${currentTheme.text}`}>Author</p>
                            <p className={`text-sm ${currentTheme.textMuted}`}>{app.author}</p>
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${currentTheme.text}`}>Size</p>
                            <p className={`text-sm ${currentTheme.textMuted}`}>{app.size}</p>
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${currentTheme.text}`}>Type</p>
                            <p className={`text-sm ${currentTheme.textMuted}`}>{app.type}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className={`text-sm font-medium ${currentTheme.text} mb-2`}>Capabilities</p>
                      <div className="flex flex-wrap gap-2">
                        {app.capabilities.map((cap, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {app.dependencies.length > 0 && (
                      <div>
                        <p className={`text-sm font-medium ${currentTheme.text} mb-2`}>Dependencies</p>
                        <div className="flex flex-wrap gap-2">
                          {app.dependencies.map((dep, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      {app.isInstalled ? (
                        <>
                          <button
                            onClick={() => {
                              launchWidget(app.id);
                              setShowAppDetails(null);
                            }}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Launch App
                          </button>
                          <button
                            onClick={() => uninstallApp(app.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Uninstall
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            installApp(app.id);
                            setShowAppDetails(null);
                          }}
                          className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          Install App
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMiniApps;
