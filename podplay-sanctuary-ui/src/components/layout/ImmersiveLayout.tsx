import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  BeakerIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  CogIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

interface ImmersiveLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { 
    path: '/scout-hub', 
    name: 'Agent Scout Hub', 
    icon: BeakerIcon,
    description: 'AI Agent Discovery & Management',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    path: '/research', 
    name: 'Research Bookcase', 
    icon: BookOpenIcon,
    description: 'Knowledge Base & Documentation',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    path: '/messenger', 
    name: 'Podplay Messenger', 
    icon: ChatBubbleLeftRightIcon,
    description: 'Multi-Agent Communication Hub',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    path: '/workspace', 
    name: 'IDE Workspace', 
    icon: CodeBracketIcon,
    description: 'Development Environment',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    path: '/pipedream', 
    name: 'Pipedream Studio', 
    icon: CogIcon,
    description: 'Workflow Automation',
    gradient: 'from-indigo-500 to-purple-500'
  },
  { 
    path: '/mcp-marketplace', 
    name: 'MCP Marketplace', 
    icon: CubeIcon,
    description: 'Model Context Protocol Hub',
    gradient: 'from-teal-500 to-blue-500'
  }
];

const ImmersiveLayout: React.FC<ImmersiveLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative z-10 w-80 bg-black/20 backdrop-blur-xl border-r border-white/10"
        >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Podplay Sanctuary
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Neurodivergent-Friendly AI Hub</p>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r ' + item.gradient + ' shadow-lg shadow-purple-500/25' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.name}</h3>
                            <p className="text-xs text-gray-300 truncate">{item.description}</p>
                          </div>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 rounded-xl border-2 border-white/30"
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <div className="text-xs text-gray-400 text-center">
                  <p>Powered by 7 Mama Bear AI Variants</p>
                  <p className="mt-1">Flask • SocketIO • Gemini • OpenAI • Anthropic</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Bar */}
        <div className="h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center px-6">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors mr-4"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {navigationItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Backend Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">AI Agents Active</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveLayout;