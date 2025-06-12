import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { 
  Home, MessageSquare, Search, Bot, Zap, Monitor, Package, 
  ChevronDown, ChevronRight, Menu, User, Activity, Settings,
  Palette, Code, Globe, Sparkles, Bell, Computer, Layers, Users
} from 'lucide-react'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { cn } from '@/lib/utils'

// Enhanced Navigation Structure with new features
const NAVIGATION_STRUCTURE = {
  core: [
    {
      id: 'home',
      label: 'Sanctuary Home',
      icon: Home,
      path: 'home',
      description: 'Main dashboard and overview'
    },
    {
      id: 'main-chat',
      label: 'Main Chat',
      icon: MessageSquare,
      path: 'main-chat',
      description: 'Primary AI conversation interface'
    },
    {
      id: 'multi-modal-chat',
      label: 'MultiModal Chat',
      icon: Layers,
      path: 'multi-modal-chat',
      description: 'Enhanced multimedia conversations'
    },
    {
      id: 'ai-messenger',
      label: 'AI Messenger',
      icon: Users,
      path: 'ai-messenger',
      badge: { text: '52 Models', type: 'success' as const },
      isNew: true,
      description: 'World\'s first AI instant messenger'
    }
  ],
  ai_systems: [
    {
      id: 'scout-workflow',
      label: 'Scout Workflow',
      icon: Search,
      path: 'scout-workflow',
      description: 'Multi-model AI orchestration'
    },
    {
      id: 'enhanced-scout',
      label: 'Enhanced Scout',
      icon: Search,
      path: 'enhanced-scout',
      badge: { text: 'v2.5', type: 'success' as const },
      description: 'Advanced AI orchestration'
    },
    {
      id: 'agents',
      label: 'Agent Workbench',
      icon: Bot,
      path: 'agents',
      isNew: true,
      description: 'Create and manage AI agents'
    },
    {
      id: 'router',
      label: 'Execution Router',
      icon: Zap,
      path: 'router',
      isNew: true,
      description: 'Intelligent task routing'
    }
  ],
  development: [
    {
      id: 'dev-workspaces',
      label: 'Dev Workspaces',
      icon: Code,
      path: 'dev-workspaces',
      description: 'Development environments'
    },
    {
      id: 'live-api-studio',
      label: 'Live API Studio',
      icon: Globe,
      path: 'live-api-studio',
      description: 'API testing and development'
    },
    {
      id: 'computer-use',
      label: 'Computer Use',
      icon: Computer,
      path: 'computer-use',
      description: 'Remote system control'
    }
  ],
  system: [
    {
      id: 'system-monitor',
      label: 'System Monitor',
      icon: Activity,
      path: 'system-monitor',
      isNew: true,
      description: 'System health and performance'
    },
    {
      id: 'mcp-marketplace',
      label: 'MCP Marketplace',
      icon: Package,
      path: 'mcp-marketplace',
      description: 'Protocol marketplace'
    },
    {
      id: 'mini-apps',
      label: 'Mini Apps',
      icon: Monitor,
      path: 'mini-apps',
      description: 'Lightweight applications'
    }
  ],
  customization: [
    {
      id: 'themes',
      label: 'Theme Studio',
      icon: Palette,
      path: 'themes',
      isNew: true,
      description: 'Customize appearance and themes'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: 'settings',
      description: 'Application preferences'
    }
  ]
}

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  path: string
  description?: string
  badge?: { text: string; type: 'success' | 'warning' | 'error' }
  isNew?: boolean
}

interface EnhancedSanctuaryNavProps {
  className?: string
}

const EnhancedSanctuaryNav: React.FC<EnhancedSanctuaryNavProps> = ({ className = "" }) => {
  const { 
    activeExperience, 
    setActiveExperience, 
    sidebarCollapsed, 
    setSidebarCollapsed 
  } = useSanctuaryStore()
  
  const [expandedSections, setExpandedSections] = useState<string[]>(['core', 'ai_systems'])
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const navRef = useRef<HTMLDivElement>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleMouseMove = (e: React.MouseEvent, itemId: string) => {
    const navRect = navRef.current?.getBoundingClientRect()
    if (navRect) {
      setTooltipPosition({
        x: e.clientX - navRect.left,
        y: e.clientY - navRect.top
      })
      setHoveredItem(itemId)
    }
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const renderNavigationSection = (sectionId: string, items: NavigationItem[], title: string) => {
    const isExpanded = expandedSections.includes(sectionId)

    return (
      <div key={sectionId} className="mb-4">
        {!sidebarCollapsed && (
          <button
            onClick={() => toggleSection(sectionId)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{title}</span>
            <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
          </button>
        )}
        
        <AnimatePresence>
          {(isExpanded || sidebarCollapsed) && (
            <motion.div
              initial={!sidebarCollapsed ? { height: 0, opacity: 0 } : undefined}
              animate={!sidebarCollapsed ? { height: "auto", opacity: 1 } : undefined}
              exit={!sidebarCollapsed ? { height: 0, opacity: 0 } : undefined}
              className="space-y-1"
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveExperience(item.path)}
                  onMouseMove={(e) => handleMouseMove(e, item.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeExperience === item.path 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    sidebarCollapsed && "justify-center"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                          New
                        </span>
                      )}
                      {item.badge && (
                        <span className={cn(
                          "px-1.5 py-0.5 text-xs rounded-full",
                          item.badge.type === 'success' && "bg-green-100 text-green-700",
                          item.badge.type === 'warning' && "bg-yellow-100 text-yellow-700",
                          item.badge.type === 'error' && "bg-red-100 text-red-700"
                        )}>
                          {item.badge.text}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <MotionConfig transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
      <motion.nav
        ref={navRef}
        animate={{ width: sidebarCollapsed ? 64 : 256 }}
        className={cn(
          "bg-background/95 backdrop-blur-sm border-r border-border/50 h-full flex flex-col",
          className
        )}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">Sanctuary</span>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderNavigationSection('core', NAVIGATION_STRUCTURE.core, 'Core')}
          {renderNavigationSection('ai_systems', NAVIGATION_STRUCTURE.ai_systems, 'AI Systems')}
          {renderNavigationSection('development', NAVIGATION_STRUCTURE.development, 'Development')}
          {renderNavigationSection('system', NAVIGATION_STRUCTURE.system, 'System')}
          {renderNavigationSection('customization', NAVIGATION_STRUCTURE.customization, 'Customization')}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border/50">
          <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="text-sm font-medium">User</div>
                <div className="text-xs text-muted-foreground">user@sanctuary.ai</div>
              </div>
            )}
          </div>
        </div>

        {/* Tooltips for collapsed state */}
        <AnimatePresence>
          {hoveredItem && sidebarCollapsed && (
            <motion.div
              className="absolute left-full ml-2 px-3 py-1.5 rounded-md bg-foreground/90 text-background text-sm pointer-events-none whitespace-nowrap z-50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{
                top: tooltipPosition.y - 12,
              }}
            >
              {/* Find the hovered item and show its label */}
              {Object.values(NAVIGATION_STRUCTURE).flat().find(item => item.id === hoveredItem)?.label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </MotionConfig>
  )
}

export default EnhancedSanctuaryNav
