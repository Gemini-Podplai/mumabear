import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Container,
  Cpu,
  Download,
  FileText,
  FolderOpen,
  Globe,
  HardDrive,
  MemoryStick,
  Monitor,
  Network,
  Pause,
  Play,
  RefreshCw,
  Square,
  Terminal,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface WorkspaceEnvironment {
  id: string;
  name: string;
  type: 'e2b' | 'scrapybara' | 'local' | 'cloud';
  status: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
  resources: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  runtime: {
    language: string;
    version: string;
    frameworks: string[];
  };
  files: FileNode[];
  ports: number[];
  processes: Process[];
  uptime: number;
  lastActivity: string;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  modified?: string;
  children?: FileNode[];
  content?: string;
}

interface Process {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu: number;
  memory: number;
  pid: number;
  port?: number;
}

interface CodeExecution {
  id: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  output: string;
  timestamp: string;
  duration?: number;
}

const EnhancedDevWorkspaces = ({ theme }) => {
  // Core state
  const [workspaces, setWorkspaces] = useState<WorkspaceEnvironment[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [codeExecutions, setCodeExecutions] = useState<CodeExecution[]>([]);

  // UI state
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(true);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(true);
  const [showResourceMonitor, setShowResourceMonitor] = useState(true);
  const [activeTab, setActiveTab] = useState<'files' | 'terminal' | 'processes' | 'monitoring'>('files');

  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState('/workspace');

  // Code editor state
  const [editorContent, setEditorContent] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('javascript');

  // Initialize mock workspaces
  useEffect(() => {
    const mockWorkspaces: WorkspaceEnvironment[] = [
      {
        id: 'e2b-main',
        name: 'E2B Development Environment',
        type: 'e2b',
        status: 'running',
        resources: { cpu: 35, memory: 45, storage: 23, network: 78 },
        runtime: {
          language: 'Node.js',
          version: '18.17.0',
          frameworks: ['React', 'Express', 'TypeScript']
        },
        files: [
          {
            id: 'src',
            name: 'src',
            type: 'directory',
            path: '/workspace/src',
            children: [
              {
                id: 'app.tsx',
                name: 'App.tsx',
                type: 'file',
                path: '/workspace/src/App.tsx',
                size: 2048,
                modified: '2024-01-15T10:30:00Z',
                content: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;`
              },
              {
                id: 'components',
                name: 'components',
                type: 'directory',
                path: '/workspace/src/components',
                children: []
              }
            ]
          },
          {
            id: 'package.json',
            name: 'package.json',
            type: 'file',
            path: '/workspace/package.json',
            size: 1024,
            modified: '2024-01-15T09:00:00Z',
            content: `{
  "name": "podplay-workspace",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}`
          }
        ],
        ports: [3000, 8080],
        processes: [
          { id: 'npm-dev', name: 'npm run dev', status: 'running', cpu: 15, memory: 128, pid: 1234, port: 3000 },
          { id: 'ts-watch', name: 'tsc --watch', status: 'running', cpu: 5, memory: 64, pid: 1235 }
        ],
        uptime: 14523,
        lastActivity: '2 minutes ago'
      },
      {
        id: 'scrapybara-web',
        name: 'Scrapybara Web Scraper',
        type: 'scrapybara',
        status: 'running',
        resources: { cpu: 28, memory: 52, storage: 18, network: 95 },
        runtime: {
          language: 'Python',
          version: '3.11.0',
          frameworks: ['Scrapy', 'Selenium', 'BeautifulSoup']
        },
        files: [
          {
            id: 'scrapers',
            name: 'scrapers',
            type: 'directory',
            path: '/workspace/scrapers',
            children: [
              {
                id: 'main_scraper.py',
                name: 'main_scraper.py',
                type: 'file',
                path: '/workspace/scrapers/main_scraper.py',
                size: 3072,
                modified: '2024-01-15T11:15:00Z',
                content: `import scrapy
from selenium import webdriver
from bs4 import BeautifulSoup

class MainScraper(scrapy.Spider):
    name = 'main_scraper'

    def __init__(self):
        self.driver = webdriver.Chrome()

    def parse(self, response):
        # Scraping logic here
        yield {
            'title': response.css('title::text').get(),
            'url': response.url
        }`
              }
            ]
          }
        ],
        ports: [8000],
        processes: [
          { id: 'scrapy-crawler', name: 'scrapy crawl', status: 'running', cpu: 25, memory: 256, pid: 2456, port: 8000 }
        ],
        uptime: 8934,
        lastActivity: '5 minutes ago'
      }
    ];

    setWorkspaces(mockWorkspaces);
    setActiveWorkspace(mockWorkspaces[0].id);
  }, []);

  // Real-time resource updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkspaces(prev => prev.map(workspace => ({
        ...workspace,
        resources: {
          cpu: Math.max(0, Math.min(100, workspace.resources.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, workspace.resources.memory + (Math.random() - 0.5) * 8)),
          storage: Math.max(0, Math.min(100, workspace.resources.storage + (Math.random() - 0.5) * 3)),
          network: Math.max(0, Math.min(100, workspace.resources.network + (Math.random() - 0.5) * 15))
        },
        processes: workspace.processes.map(proc => ({
          ...proc,
          cpu: Math.max(0, Math.min(100, proc.cpu + (Math.random() - 0.5) * 5)),
          memory: Math.max(0, Math.min(512, proc.memory + (Math.random() - 0.5) * 20))
        })),
        uptime: workspace.status === 'running' ? workspace.uptime + 1 : workspace.uptime
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Get active workspace
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspace);

  // Execute code
  const executeCode = async (code: string, language: string) => {
    const execution: CodeExecution = {
      id: `exec_${Date.now()}`,
      code,
      language,
      status: 'running',
      output: '',
      timestamp: new Date().toLocaleTimeString()
    };

    setCodeExecutions(prev => [execution, ...prev]);

    // Simulate execution
    setTimeout(() => {
      setCodeExecutions(prev => prev.map(exec =>
        exec.id === execution.id
          ? {
            ...exec,
            status: 'completed',
            output: `// Execution completed\n// Language: ${language}\n// Code executed successfully\n\nOutput: Hello from ${language}!\nExecution time: ${Math.random() * 2 + 0.5}s`,
            duration: Math.random() * 2000 + 500
          }
          : exec
      ));
    }, 1500);
  };

  // Handle terminal command
  const executeTerminalCommand = (command: string) => {
    const newOutput = `${currentDirectory}$ ${command}`;
    setTerminalOutput(prev => [...prev, newOutput]);

    // Simulate command output
    setTimeout(() => {
      let response = '';
      if (command.startsWith('ls')) {
        response = 'src/  package.json  node_modules/  README.md';
      } else if (command.startsWith('pwd')) {
        response = currentDirectory;
      } else if (command.startsWith('cd ')) {
        const newDir = command.split(' ')[1];
        setCurrentDirectory(`${currentDirectory}/${newDir}`);
        response = '';
      } else if (command.startsWith('npm ')) {
        response = 'npm command executed successfully';
      } else {
        response = `Command executed: ${command}`;
      }

      if (response) {
        setTerminalOutput(prev => [...prev, response]);
      }
    }, 300);

    setTerminalInput('');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'stopped': return 'text-gray-600 bg-gray-100';
      case 'starting': return 'text-blue-600 bg-blue-100';
      case 'stopping': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Render file tree
  const renderFileTree = (files: FileNode[], level = 0) => {
    return files.map(file => (
      <div key={file.id} style={{ marginLeft: level * 16 }}>
        <div
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedFile?.id === file.id ? 'bg-blue-100' : ''
            }`}
          onClick={() => setSelectedFile(file)}
        >
          {file.type === 'directory' ? (
            <FolderOpen size={16} className="text-blue-500" />
          ) : (
            <FileText size={16} className="text-gray-500" />
          )}
          <span className={`text-sm ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
            {file.name}
          </span>
          {file.size && (
            <span className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
              ({(file.size / 1024).toFixed(1)}KB)
            </span>
          )}
        </div>
        {file.children && renderFileTree(file.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'comfort'
        ? 'bg-gradient-to-br from-purple-50 to-pink-50'
        : theme === 'professional'
          ? 'bg-gray-50'
          : 'bg-gray-900'
      }`}>

      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-md'
        }`}>

        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme === 'comfort'
              ? 'bg-gradient-to-br from-green-400 to-blue-400'
              : theme === 'professional'
                ? 'bg-green-600'
                : 'bg-green-600'
            }`}>
            <Code className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className={`font-bold text-xl flex items-center gap-2 ${theme === 'custom' ? 'text-white' : 'text-gray-900'
              }`}>
              Enhanced Dev Workspaces
              <Container className="w-5 h-5 text-green-500" />
            </h1>
            <p className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-500'}`}>
              E2B & Scrapybara Integration • {workspaces.length} active environments
            </p>
          </div>
        </div>

        {/* Workspace selector */}
        <div className="flex items-center space-x-4">
          <select
            value={activeWorkspace || ''}
            onChange={(e) => setActiveWorkspace(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${theme === 'custom'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
              }`}
          >
            {workspaces.map(workspace => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowResourceMonitor(!showResourceMonitor)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${theme === 'custom'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Monitor size={16} />
            Monitor
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex">

        {/* Left Panel - File Explorer & Navigation */}
        {leftPanelExpanded && (
          <div className={`w-80 border-r ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            } flex flex-col`}>

            {/* Panel tabs */}
            <div className={`flex border-b ${theme === 'custom' ? 'border-gray-700' : 'border-gray-200'}`}>
              {[
                { id: 'files', label: 'Files', icon: FolderOpen },
                { id: 'terminal', label: 'Terminal', icon: Terminal },
                { id: 'processes', label: 'Processes', icon: Activity }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium transition-colors ${activeTab === tab.id
                      ? theme === 'custom'
                        ? 'bg-gray-700 text-white border-b-2 border-green-500'
                        : 'bg-white text-gray-900 border-b-2 border-green-500'
                      : theme === 'custom'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'files' && currentWorkspace && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      File Explorer
                    </h3>
                    <button className={`p-1 rounded hover:bg-gray-200 ${theme === 'custom' ? 'hover:bg-gray-700' : ''
                      }`}>
                      <RefreshCw size={16} />
                    </button>
                  </div>
                  {renderFileTree(currentWorkspace.files)}
                </div>
              )}

              {activeTab === 'terminal' && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                      Terminal
                    </h3>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className={`flex-1 p-3 rounded-lg font-mono text-sm overflow-y-auto ${theme === 'custom' ? 'bg-gray-900 text-green-400' : 'bg-black text-green-400'
                    }`}>
                    {terminalOutput.map((line, index) => (
                      <div key={index} className="mb-1">{line}</div>
                    ))}
                    <div className="flex items-center">
                      <span className="mr-2">{currentDirectory}$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            executeTerminalCommand(terminalInput);
                          }
                        }}
                        className="flex-1 bg-transparent outline-none"
                        placeholder="Enter command..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'processes' && currentWorkspace && (
                <div>
                  <h3 className={`font-semibold mb-4 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                    Running Processes
                  </h3>
                  <div className="space-y-3">
                    {currentWorkspace.processes.map(process => (
                      <div
                        key={process.id}
                        className={`p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                            {process.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(process.status)}`}>
                            {process.status}
                          </span>
                        </div>

                        <div className={`text-sm space-y-1 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="flex justify-between">
                            <span>PID: {process.pid}</span>
                            {process.port && <span>Port: {process.port}</span>}
                          </div>
                          <div className="flex justify-between">
                            <span>CPU: {process.cpu.toFixed(1)}%</span>
                            <span>Memory: {process.memory}MB</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-3">
                          <button className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200">
                            <Play size={14} />
                          </button>
                          <button className="p-1 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
                            <Pause size={14} />
                          </button>
                          <button className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200">
                            <Square size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            {selectedFile ? (
              <>
                {/* File header */}
                <div className={`flex items-center justify-between p-4 border-b ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <FileText className={`w-5 h-5 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div>
                      <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedFile.name}
                      </h3>
                      <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedFile.path}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => executeCode(selectedFile.content || '', editorLanguage)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Play size={16} />
                      Run
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                      <Download size={16} />
                    </button>
                  </div>
                </div>

                {/* Code content */}
                <div className="flex-1 p-4">
                  <textarea
                    value={selectedFile.content || editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className={`w-full h-full font-mono text-sm p-4 rounded-lg border resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme === 'custom'
                        ? 'bg-gray-900 border-gray-700 text-gray-100'
                        : 'bg-white border-gray-300'
                      }`}
                    placeholder="Select a file to edit or write code here..."
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'custom' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  <p className={`text-lg font-medium ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Select a file to edit
                  </p>
                  <p className={`text-sm ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Choose a file from the explorer to start coding
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Execution Results */}
          {codeExecutions.length > 0 && (
            <div className={`h-64 border-t ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              } p-4 overflow-y-auto`}>
              <h3 className={`font-semibold mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Execution Results
              </h3>
              <div className="space-y-3">
                {codeExecutions.map(execution => (
                  <div
                    key={execution.id}
                    className={`p-3 rounded-lg ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {execution.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : execution.status === 'running' ? (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : execution.status === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                          {execution.language} Execution
                        </span>
                      </div>
                      <span className={`text-xs ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {execution.timestamp}
                        {execution.duration && ` • ${(execution.duration / 1000).toFixed(2)}s`}
                      </span>
                    </div>

                    <pre className={`text-sm font-mono p-3 rounded ${theme === 'custom' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
                      } whitespace-pre-wrap`}>
                      {execution.output || 'Running...'}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Resource Monitor */}
        {rightPanelExpanded && showResourceMonitor && currentWorkspace && (
          <div className={`w-80 border-l ${theme === 'custom' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            } p-4 overflow-y-auto`}>

            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Resource Monitor
              </h3>
              <button
                onClick={() => setRightPanelExpanded(false)}
                className={`p-1 rounded ${theme === 'custom' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Environment Status */}
            <div className={`p-4 rounded-lg mb-4 ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
              }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                  {currentWorkspace.name}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(currentWorkspace.status)}`}>
                  {currentWorkspace.status}
                </span>
              </div>

              <div className={`text-sm space-y-2 ${theme === 'custom' ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-mono">{currentWorkspace.type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Runtime:</span>
                  <span className="font-mono">{currentWorkspace.runtime.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-mono">
                    {Math.floor(currentWorkspace.uptime / 3600)}h {Math.floor((currentWorkspace.uptime % 3600) / 60)}m
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Usage */}
            <div className={`p-4 rounded-lg mb-4 ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
              }`}>
              <h4 className={`font-medium mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Resource Usage
              </h4>

              <div className="space-y-3">
                {[
                  { name: 'CPU', value: currentWorkspace.resources.cpu, icon: Cpu, unit: '%' },
                  { name: 'Memory', value: currentWorkspace.resources.memory, icon: MemoryStick, unit: '%' },
                  { name: 'Storage', value: currentWorkspace.resources.storage, icon: HardDrive, unit: '%' },
                  { name: 'Network', value: currentWorkspace.resources.network, icon: Network, unit: '%' }
                ].map(resource => (
                  <div key={resource.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <resource.icon className={`w-4 h-4 ${theme === 'custom' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${theme === 'custom' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {resource.name}
                        </span>
                      </div>
                      <span className={`text-sm font-mono ${resource.value > 80 ? 'text-red-500' :
                          resource.value > 60 ? 'text-yellow-500' :
                            'text-green-500'
                        }`}>
                        {Math.round(resource.value)}{resource.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${resource.value > 80 ? 'bg-red-500' :
                            resource.value > 60 ? 'bg-yellow-500' :
                              'bg-green-500'
                          }`}
                        style={{ width: `${resource.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Ports */}
            <div className={`p-4 rounded-lg mb-4 ${theme === 'custom' ? 'bg-gray-700' : 'bg-white border'
              }`}>
              <h4 className={`font-medium mb-3 ${theme === 'custom' ? 'text-white' : 'text-gray-900'}`}>
                Active Ports
              </h4>
              <div className="space-y-2">
                {currentWorkspace.ports.map(port => (
                  <div
                    key={port}
                    className="flex items-center justify-between p-2 rounded bg-green-100 text-green-700"
                  >
                    <span className="font-mono">:{port}</span>
                    <button className="p-1 rounded hover:bg-green-200">
                      <Globe size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Play size={16} />
                Start Environment
              </button>
              <button className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Square size={16} />
                Stop Environment
              </button>
              <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={16} />
                Restart Environment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toggle buttons for collapsed panels */}
      {!leftPanelExpanded && (
        <button
          onClick={() => setLeftPanelExpanded(true)}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-r-lg shadow-lg hover:bg-gray-700 transition-colors z-10"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {!rightPanelExpanded && showResourceMonitor && (
        <button
          onClick={() => setRightPanelExpanded(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-l-lg shadow-lg hover:bg-gray-700 transition-colors z-10"
        >
          <ChevronLeft size={16} />
        </button>
      )}
    </div>
  );
};

export default EnhancedDevWorkspaces;
