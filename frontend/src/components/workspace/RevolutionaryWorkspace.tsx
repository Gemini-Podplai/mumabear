// Revolutionary Draggable Workspace - The Windsurf Killer 🚀
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  Code2,
  Terminal,
  Globe,
  FileText,
  MessageSquare,
  Sparkles,
  Zap,
  Search,
  Image,
  Video,
  Music,
  Settings,
  Plus,
  X,
  GripVertical,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shuffle
} from 'lucide-react';
import { Button } from '../ui/button';

// Panel Types - Each one is a draggable puzzle piece
type PanelType =
  | 'monaco-editor'
  | 'terminal'
  | 'browser'
  | 'file-explorer'
  | 'ai-chat'
  | 'tool-marketplace'
  | 'media-creator'
  | 'web-search'
  | 'image-generator'
  | 'video-creator'
  | 'audio-mixer';

interface PanelConfig {
  id: string;
  type: PanelType;
  title: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isGenerating: boolean;
  animationType?: 'code' | 'search' | 'media' | 'chat' | 'terminal';
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'development' | 'ai' | 'media' | 'productivity';
  panelType: PanelType;
  animationColor: string;
}

const AVAILABLE_TOOLS: Tool[] = [
  {
    id: 'monaco',
    name: 'Code Editor',
    description: 'Monaco-powered VS Code experience',
    icon: <Code2 className="w-5 h-5" />,
    category: 'development',
    panelType: 'monaco-editor',
    animationColor: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Full bash terminal with MCP integration',
    icon: <Terminal className="w-5 h-5" />,
    category: 'development',
    panelType: 'terminal',
    animationColor: 'from-green-500 to-emerald-500'
  },
  {
    id: 'browser',
    name: 'MCP Browser',
    description: 'Integrated web browser with AI tools',
    icon: <Globe className="w-5 h-5" />,
    category: 'productivity',
    panelType: 'browser',
    animationColor: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ai-chat',
    name: 'AI Assistant',
    description: 'Multi-model AI conversation',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'ai',
    panelType: 'ai-chat',
    animationColor: 'from-orange-500 to-red-500'
  },
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'AI-powered web research',
    icon: <Search className="w-5 h-5" />,
    category: 'ai',
    panelType: 'web-search',
    animationColor: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'image-gen',
    name: 'Image Creator',
    description: 'AI image generation and editing',
    icon: <Image className="w-5 h-5" />,
    category: 'media',
    panelType: 'image-generator',
    animationColor: 'from-pink-500 to-rose-500'
  },
  {
    id: 'video-gen',
    name: 'Video Creator',
    description: 'AI video generation and editing',
    icon: <Video className="w-5 h-5" />,
    category: 'media',
    panelType: 'video-creator',
    animationColor: 'from-violet-500 to-purple-500'
  },
  {
    id: 'audio-mix',
    name: 'Audio Mixer',
    description: 'Music creation and audio editing',
    icon: <Music className="w-5 h-5" />,
    category: 'media',
    panelType: 'audio-mixer',
    animationColor: 'from-teal-500 to-cyan-500'
  }
];

// Stunning generation animations for each tool type
const GenerationAnimation: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const animations = {
    code: (
      <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${color} animate-pulse`}>
            <Code2 className="w-8 h-8 text-white m-4" />
          </div>
          <div className="text-white font-mono text-sm">
            <div className="animate-typing">Generating code...</div>
            <div className="flex justify-center mt-2 space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                     style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    search: (
      <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} animate-spin`}>
              <Search className="w-8 h-8 text-white m-4" />
            </div>
            <div className="absolute inset-2 rounded-full bg-black animate-pulse" />
          </div>
          <div className="text-white text-sm">
            <div className="animate-pulse">Searching the web...</div>
            <div className="mt-2 text-xs text-gray-400">AI agents deployed</div>
          </div>
        </div>
      </div>
    ),
    media: (
      <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} animate-ping`} />
            <div className={`relative w-full h-full rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}>
              <Sparkles className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <div className="text-white text-sm">
            <div className="animate-pulse">Creating media...</div>
            <div className="mt-1 text-xs text-gray-400">Neural networks processing</div>
          </div>
        </div>
      </div>
    ),
    chat: (
      <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="flex justify-center mb-4 space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-full bg-gradient-to-r ${color} animate-bounce`}
                   style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
          <div className="text-white text-sm">
            <div className="animate-pulse">AI thinking...</div>
            <div className="mt-1 text-xs text-gray-400">Processing context</div>
          </div>
        </div>
      </div>
    )
  };

  return animations[type as keyof typeof animations] || animations.chat;
};

// Draggable Panel Component - The magic puzzle piece!
const DraggablePanel: React.FC<{
  panel: PanelConfig;
  onUpdate: (id: string, updates: Partial<PanelConfig>) => void;
  onClose: (id: string) => void;
  onBringToFront: (id: string) => void;
}> = ({ panel, onUpdate, onClose, onBringToFront }) => {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  const tool = AVAILABLE_TOOLS.find(t => t.panelType === panel.type);

  const handleDragStart = () => {
    setIsDragging(true);
    onBringToFront(panel.id);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    onUpdate(panel.id, {
      x: panel.x + info.offset.x,
      y: panel.y + info.offset.y
    });
  };

  const toggleMinimize = () => {
    onUpdate(panel.id, { isMinimized: !panel.isMinimized });
  };

  const startGeneration = () => {
    onUpdate(panel.id, { isGenerating: true });
    // Simulate generation time
    setTimeout(() => {
      onUpdate(panel.id, { isGenerating: false });
    }, 3000 + Math.random() * 2000);
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: panel.isMinimized ? 0.3 : 1,
        opacity: 1,
        x: panel.x,
        y: panel.y
      }}
      style={{
        width: panel.width,
        height: panel.isMinimized ? 60 : panel.height,
        zIndex: panel.zIndex
      }}
      className={`absolute bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden
                  ${isDragging ? 'shadow-cyan-500/50' : ''}
                  ${panel.isMinimized ? 'cursor-pointer' : ''}`}
      whileHover={{ scale: panel.isMinimized ? 0.35 : 1.02 }}
      onClick={() => panel.isMinimized && toggleMinimize()}
    >
      {/* Panel Header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-gray-800 cursor-move border-b border-gray-700"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded bg-gradient-to-r ${tool?.animationColor || 'from-gray-500 to-gray-600'}`}>
            {tool?.icon}
          </div>
          <span className="text-white text-sm font-medium">{panel.title}</span>
          {panel.isGenerating && (
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                     style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={startGeneration}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-cyan-400 transition-colors"
            title="Generate with AI"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          >
            {panel.isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onClose(panel.id)}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      {!panel.isMinimized && (
        <div className="relative h-full bg-gray-900 p-4">
          {/* Generation Animation Overlay */}
          <AnimatePresence>
            {panel.isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50"
              >
                <GenerationAnimation
                  type={panel.animationType || 'chat'}
                  color={tool?.animationColor || 'from-gray-500 to-gray-600'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panel-specific content */}
          <PanelContent type={panel.type} />
        </div>
      )}
    </motion.div>
  );
};

// Content renderer for each panel type
const PanelContent: React.FC<{ type: PanelType }> = ({ type }) => {
  const content = {
    'monaco-editor': (
      <div className="h-full bg-gray-950 rounded border border-gray-700">
        <div className="p-4 text-gray-300 font-mono text-sm">
          <div className="text-cyan-400 mb-2">// Monaco Editor Integration</div>
          <div className="text-white">function revolutionaryWorkspace() {'{}'}</div>
          <div className="text-gray-500 mt-4">// Full VS Code experience with AI...</div>
        </div>
      </div>
    ),
    'terminal': (
      <div className="h-full bg-black rounded border border-gray-700 p-3 font-mono text-sm">
        <div className="text-green-400">$ mama-bear-assistant --mode=revolutionary</div>
        <div className="text-white mt-1">🚀 Ready for world domination!</div>
        <div className="text-gray-400 mt-2">$ _</div>
      </div>
    ),
    'browser': (
      <div className="h-full bg-white rounded border border-gray-700">
        <div className="bg-gray-200 p-2 border-b flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="bg-white rounded px-3 py-1 text-sm text-gray-600 flex-1">
            🌐 MCP Browser - AI-Powered Browsing
          </div>
        </div>
        <div className="p-4 text-center text-gray-600">
          <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div>Integrated Web Browser</div>
          <div className="text-sm text-gray-400">with MCP Tools</div>
        </div>
      </div>
    ),
    'ai-chat': (
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-gray-800 rounded border border-gray-700 p-3 space-y-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg text-sm max-w-xs">
            Hey! Ready to revolutionize development? 🚀
          </div>
          <div className="bg-gray-700 text-white p-2 rounded-lg text-sm max-w-xs ml-auto">
            Let's crush the competition! What tools do you need?
          </div>
        </div>
        <div className="mt-2 flex">
          <input
            placeholder="Chat with AI assistant..."
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l border border-gray-700"
          />
          <Button className="rounded-l-none">Send</Button>
        </div>
      </div>
    ),
    'web-search': (
      <div className="h-full">
        <div className="mb-3">
          <input
            placeholder="AI-powered web search..."
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
          />
        </div>
        <div className="bg-gray-800 rounded border border-gray-700 p-3 text-sm text-gray-300">
          <div className="flex items-center space-x-2 mb-2">
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search Results</span>
          </div>
          <div className="space-y-1 text-xs">
            <div>🎯 Revolutionary AI tools...</div>
            <div>🚀 Latest MCP integrations...</div>
            <div>💎 Cutting-edge development...</div>
          </div>
        </div>
      </div>
    ),
    'image-generator': (
      <div className="h-full flex flex-col">
        <input
          placeholder="Describe the image you want to create..."
          className="mb-3 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
        />
        <div className="flex-1 bg-gray-800 rounded border border-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Image className="w-12 h-12 mx-auto mb-2" />
            <div>AI Image Generation</div>
            <div className="text-sm">Ready to create stunning visuals</div>
          </div>
        </div>
      </div>
    )
  };

  return content[type] || <div className="text-gray-400 text-center">Panel Content</div>;
};

// Tool Marketplace Sidebar
const ToolMarketplace: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddTool: (tool: Tool) => void;
}> = ({ isOpen, onClose, onAddTool }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          exit={{ x: -400 }}
          className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Tool Marketplace</span>
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {['development', 'ai', 'media', 'productivity'].map(category => (
              <div key={category}>
                <h3 className="text-gray-300 font-medium mb-2 capitalize">{category}</h3>
                <div className="space-y-2">
                  {AVAILABLE_TOOLS.filter(tool => tool.category === category).map(tool => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:border-cyan-500 transition-colors"
                      onClick={() => onAddTool(tool)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded bg-gradient-to-r ${tool.animationColor}`}>
                          {tool.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{tool.name}</div>
                          <div className="text-gray-400 text-xs">{tool.description}</div>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Revolutionary Workspace Component
export const RevolutionaryWorkspace: React.FC = () => {
  const [panels, setPanels] = useState<PanelConfig[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [isToolMarketplaceOpen, setIsToolMarketplaceOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<'development' | 'creative' | 'hybrid'>('hybrid');

  // Add a new panel from tool marketplace
  const addPanel = useCallback((tool: Tool) => {
    const newPanel: PanelConfig = {
      id: `panel-${Date.now()}`,
      type: tool.panelType,
      title: tool.name,
      icon: tool.icon,
      x: 100 + (panels.length * 50),
      y: 100 + (panels.length * 30),
      width: 400,
      height: 300,
      zIndex: nextZIndex,
      isMinimized: false,
      isGenerating: false,
      animationType: tool.category === 'development' ? 'code' :
                    tool.category === 'ai' ? 'chat' :
                    tool.category === 'media' ? 'media' : 'search'
    };

    setPanels(prev => [...prev, newPanel]);
    setNextZIndex(prev => prev + 1);
    setIsToolMarketplaceOpen(false);
  }, [panels.length, nextZIndex]);

  // Update panel properties
  const updatePanel = useCallback((id: string, updates: Partial<PanelConfig>) => {
    setPanels(prev => prev.map(panel =>
      panel.id === id ? { ...panel, ...updates } : panel
    ));
  }, []);

  // Remove panel
  const removePanel = useCallback((id: string) => {
    setPanels(prev => prev.filter(panel => panel.id !== id));
  }, []);

  // Bring panel to front
  const bringToFront = useCallback((id: string) => {
    const newZIndex = nextZIndex;
    updatePanel(id, { zIndex: newZIndex });
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, updatePanel]);

  // Auto-arrange panels
  const autoArrange = useCallback(() => {
    const arranged = panels.map((panel, index) => ({
      ...panel,
      x: (index % 3) * 420 + 50,
      y: Math.floor(index / 3) * 350 + 50,
      isMinimized: false
    }));
    setPanels(arranged);
  }, [panels]);

  // Reset workspace
  const resetWorkspace = useCallback(() => {
    setPanels([]);
    setNextZIndex(1);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Floating Action Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="flex items-center space-x-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
          <Button
            onClick={() => setIsToolMarketplaceOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tool
          </Button>

          <Button
            variant="outline"
            onClick={autoArrange}
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Auto Arrange
          </Button>

          <Button
            variant="outline"
            onClick={resetWorkspace}
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <div className="border-l border-gray-600 pl-3 ml-3">
            <span className="text-gray-400 text-sm">
              {panels.length} panels active
            </span>
          </div>
        </div>
      </motion.div>

      {/* Draggable Panels */}
      <AnimatePresence>
        {panels.map(panel => (
          <DraggablePanel
            key={panel.id}
            panel={panel}
            onUpdate={updatePanel}
            onClose={removePanel}
            onBringToFront={bringToFront}
          />
        ))}
      </AnimatePresence>

      {/* Tool Marketplace Sidebar */}
      <ToolMarketplace
        isOpen={isToolMarketplaceOpen}
        onClose={() => setIsToolMarketplaceOpen(false)}
        onAddTool={addPanel}
      />

      {/* Empty State */}
      {panels.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Revolutionary Workspace
            </h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Drag, drop, resize, and arrange your tools however you want.
              The future of development is here! 🚀
            </p>
            <Button
              onClick={() => setIsToolMarketplaceOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Building
            </Button>
          </div>
        </motion.div>
      )}

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 grid-rows-8 h-full gap-4 p-4">
          {[...Array(96)].map((_, i) => (
            <div key={i} className="border border-cyan-500/20 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};
