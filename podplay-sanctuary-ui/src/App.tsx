import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon,
  BeakerIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
  CogIcon,
  CubeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Import your sophisticated components
import AgentScoutHub from './components/agentHub/AgentScoutHub';
import ResearchBookcaseView from './components/research/ResearchBookcaseView';
import PodplayMessenger from './components/messenger/PodplayMessenger';
import IDEWorkspace from './pages/IDEWorkspace';
import PipedreamStudio from './pages/PipedreamStudio';
import MCPMarketDock from './pages/MCPMarketDock';
import FloatingMamaBearButton from './components/ui/FloatingMamaBearButton';
import MamaBearChatOverlay from './components/ui/MamaBearChatOverlay';
import ThemeProvider from './components/shared/ThemeProvider';

interface NavigationItem {
  path: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  component: React.ComponentType;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      path: '/',
      name: 'Scout Command',
      description: 'Autonomous full-stack development workflows',
      icon: BeakerIcon,
      color: 'from-purple-500 to-blue-500',
      component: AgentScoutHub
    },
    {
      path: '/research',
      name: 'Research Center',
      description: 'Claude & Gemini collaborative research',
      icon: BookOpenIcon,
      color: 'from-indigo-500 to-purple-500',
      component: ResearchBookcaseView
    },
    {
      path: '/messenger',
      name: 'AI Orchestra',
      description: '50+ specialized Gemini models',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-blue-500 to-cyan-500',
      component: PodplayMessenger
    },
    {
      path: '/workspace',
      name: 'Dev Workspace',
      description: 'VS Code-inspired development environment',
      icon: CommandLineIcon,
      color: 'from-green-500 to-teal-500',
      component: IDEWorkspace
    },
    {
      path: '/pipedream',
      name: 'Automation Studio',
      description: 'Visual workflow automation',
      icon: CogIcon,
      color: 'from-orange-500 to-red-500',
      component: PipedreamStudio
    },
    {
      path: '/marketplace',
      name: 'MCP Marketplace',
      description: 'Docker toolkit and package management',
      icon: CubeIcon,
      color: 'from-pink-500 to-rose-500',
      component: MCPMarketDock
    }
  ];

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-slate-800/80 backdrop-blur rounded-lg border border-purple-500/30"
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur border-r border-purple-500/20 z-40 overflow-y-auto"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <HomeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Podplay Sanctuary
                      </h1>
                      <p className="text-sm text-gray-400">AI Development Platform</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `block p-4 rounded-lg border transition-all duration-200 ${
                            isActive
                              ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} ${isActive ? 'shadow-lg' : ''}`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-400">{item.description}</p>
                            </div>
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
                  <div className="text-center text-sm text-gray-500">
                    <p>🐻 Mama Bear AI Platform</p>
                    <p>Built with ❤️ for neurodivergent developers</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="lg:ml-80 min-h-screen">
            <Routes>
              <Route path="/" element={<AgentScoutHub />} />
              <Route path="/research" element={<ResearchBookcaseView />} />
              <Route path="/messenger" element={<PodplayMessenger />} />
              <Route path="/workspace" element={<IDEWorkspace />} />
              <Route path="/pipedream" element={<PipedreamStudio />} />
              <Route path="/marketplace" element={<MCPMarketDock />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Global Floating Components */}
          <FloatingMamaBearButton />
          <MamaBearChatOverlay />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
