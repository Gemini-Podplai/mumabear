import React from 'react';
import DynamicWorkspaceLayout from '../components/layout/DynamicWorkspaceLayout';

const IDEWorkspace = () => {
  return (
    <DynamicWorkspaceLayout
      agentName="Code Mama Bear"
      agentType="code"
      agentDescription="🚀 Advanced IDE workspace with E2B code execution, file management, and AI-powered development assistance"
      showFileTree={true}
      showTerminal={true}
      showFilePreview={true}
      showProcessTicker={true}
    >
      {/* Main IDE Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Code Editor Area */}
        <div className="flex-1 bg-black/30 backdrop-blur-sm rounded-lg m-4 border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white font-mono text-sm ml-4">App.tsx</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">TypeScript React</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="p-6 font-mono text-sm text-gray-300 leading-relaxed overflow-auto h-full">
            <pre className="text-green-400">
{`import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DynamicWorkspaceLayout from './components/layout/DynamicWorkspaceLayout';
import AgentScoutHub from './pages/AgentScoutHub';
import ResearchBookcaseView from './pages/ResearchBookcaseView';
import PodplayMessenger from './pages/PodplayMessenger';
import IDEWorkspace from './pages/IDEWorkspace';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AgentScoutHub />} />
      <Route path="/scout-hub" element={<AgentScoutHub />} />
      <Route path="/research" element={<ResearchBookcaseView />} />
      <Route path="/messenger" element={<PodplayMessenger />} />
      <Route path="/workspace" element={<IDEWorkspace />} />
    </Routes>
  </BrowserRouter>
);

export default App;`}
            </pre>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-3 mx-4 mb-4 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">Connected to Vertex AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-400">Express Mode Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-purple-400">E2B Environment Ready</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>Ln 23, Col 15</span>
              <span>UTF-8</span>
              <span>TypeScript React</span>
              <span>🚀 Mama Bear IDE</span>
            </div>
          </div>
        </div>
      </div>
    </DynamicWorkspaceLayout>
  );
};

export default IDEWorkspace;