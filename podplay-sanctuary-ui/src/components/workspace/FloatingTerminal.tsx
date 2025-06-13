import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  MinusIcon,
  Square2StackIcon,
  CommandLineIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  ShareIcon,
  CpuChipIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

interface FloatingTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
}

interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  status: 'running' | 'completed' | 'error';
  duration?: number;
}

const FloatingTerminal: React.FC<FloatingTerminalProps> = ({
  isOpen,
  onClose,
  workspaceId
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([
    {
      id: '1',
      command: 'echo "🐻 Muma Scout Terminal Initialized"',
      output: '🐻 Muma Scout Terminal Initialized\nConnected to virtual environment: scrapybara-001\nAgent workspace ready for autonomous operations',
      timestamp: new Date(Date.now() - 30000),
      status: 'completed',
      duration: 120
    },
    {
      id: '2',
      command: 'ls -la',
      output: 'total 24\ndrwxr-xr-x  6 agent agent 4096 Dec  6 23:15 .\ndrwxr-xr-x  3 root  root  4096 Dec  6 23:10 ..\n-rw-r--r--  1 agent agent  220 Dec  6 23:10 .bash_logout\n-rw-r--r--  1 agent agent 3771 Dec  6 23:10 .bashrc\ndrwxr-xr-x  2 agent agent 4096 Dec  6 23:15 workspace\n-rw-r--r--  1 agent agent  807 Dec  6 23:10 .profile',
      timestamp: new Date(Date.now() - 15000),
      status: 'completed',
      duration: 89
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSharing, setIsSharing] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(23);
  const [memoryUsage, setMemoryUsage] = useState(45);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Simulate real-time system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 8)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMinimized) return;
    setIsDragging(true);
    const rect = terminalRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX - offsetX,
          y: e.clientY - offsetY
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [isMinimized]);

  const executeCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command,
      output: '',
      timestamp: new Date(),
      status: 'running'
    };

    setCommandHistory(prev => [...prev, newCommand]);
    setCurrentCommand('');
    setHistoryIndex(-1);

    // Simulate command execution
    setTimeout(() => {
      let output = '';
      const duration = Math.floor(Math.random() * 2000) + 500;

      // Smart command responses
      if (command.includes('ls')) {
        output = 'workspace/\n├── src/\n│   ├── main.py\n│   └── utils.py\n├── data/\n│   └── research.json\n└── output/\n    └── results.txt';
      } else if (command.includes('pwd')) {
        output = '/home/agent/workspace';
      } else if (command.includes('ps')) {
        output = 'PID  COMMAND\n1234 python main.py\n5678 scrapybara-browser\n9012 muma-scout-agent';
      } else if (command.includes('top') || command.includes('htop')) {
        output = `CPU Usage: ${cpuUsage}%\nMemory Usage: ${memoryUsage}%\nActive Processes: 12\nAgent Status: RUNNING`;
      } else if (command.includes('git')) {
        output = 'On branch main\nYour branch is up to date with \'origin/main\'.\nnothing to commit, working tree clean';
      } else if (command.includes('python') || command.includes('node')) {
        output = '🚀 Executing agent script...\n✅ Task completed successfully\n📊 Results saved to output/';
      } else {
        output = `Command executed: ${command}\n✅ Operation completed successfully`;
      }

      setCommandHistory(prev => 
        prev.map(cmd => 
          cmd.id === newCommand.id 
            ? { ...cmd, output, status: 'completed' as const, duration }
            : cmd
        )
      );
    }, Math.random() * 1500 + 500);
  }, [cpuUsage, memoryUsage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = commandHistory.map(cmd => cmd.command);
      if (historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commands[commands.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const commands = commandHistory.map(cmd => cmd.command);
        setCurrentCommand(commands[commands.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  }, [currentCommand, commandHistory, historyIndex, executeCommand]);

  const shareTerminal = useCallback(() => {
    setIsSharing(true);
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false);
      // In real implementation, this would generate a share link
      navigator.clipboard?.writeText('https://mumabear.dev/terminal/share/abc123');
    }, 1500);
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={terminalRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isMinimized ? 0.3 : 1,
        opacity: 1,
        x: position.x,
        y: position.y
      }}
      className={`fixed z-50 bg-black border border-green-500/30 rounded-lg shadow-2xl overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
      style={{
        width: isMinimized ? 200 : size.width,
        height: isMinimized ? 40 : size.height,
        left: position.x,
        top: position.y
      }}
    >
        {/* Terminal Header */}
        <div 
          className="flex items-center justify-between p-2 bg-gray-900 border-b border-green-500/20 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center space-x-2">
            <CommandLineIcon className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-mono">
              🐻 Muma Terminal {workspaceId ? `[${workspaceId.slice(0, 8)}]` : ''}
            </span>
            {!isMinimized && (
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-1">
                  <CpuChipIcon className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-400">{cpuUsage}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BoltIcon className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400">{memoryUsage}%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {!isMinimized && (
              <>
                <button
                  onClick={shareTerminal}
                  disabled={isSharing}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                  title="Share Terminal"
                >
                  <ShareIcon className={`w-3 h-3 text-gray-400 ${isSharing ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                  title="Minimize"
                >
                  <MinusIcon className="w-3 h-3 text-gray-400" />
                </button>
              </>
            )}
            {isMinimized && (
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 rounded hover:bg-gray-700 transition-colors"
                title="Restore"
              >
                <Square2StackIcon className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-red-600 transition-colors"
              title="Close"
            >
              <XMarkIcon className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Terminal Output */}
            <div 
              ref={outputRef}
              className="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-y-auto"
              style={{ height: size.height - 100 }}
            >
              {commandHistory.map((cmd) => (
                <div key={cmd.id} className="mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-blue-400">agent@muma-scout:</span>
                    <span className="text-purple-400">~/workspace$</span>
                    <span className="text-white">{cmd.command}</span>
                    {cmd.status === 'running' && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                    {cmd.duration && (
                      <span className="text-gray-500 text-xs">({cmd.duration}ms)</span>
                    )}
                  </div>
                  {cmd.output && (
                    <pre className="text-green-300 whitespace-pre-wrap ml-4 border-l border-green-500/20 pl-2">
                      {cmd.output}
                    </pre>
                  )}
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <div className="flex items-center p-2 bg-gray-900 border-t border-green-500/20">
              <span className="text-blue-400 font-mono text-sm mr-2">agent@muma-scout:</span>
              <span className="text-purple-400 font-mono text-sm mr-2">~/workspace$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none"
                placeholder="Enter command..."
                autoFocus
              />
            </div>

            {/* Resize Handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-green-500/20 hover:bg-green-500/40 transition-colors"
              onMouseDown={(e) => {
                setIsResizing(true);
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = size.width;
                const startHeight = size.height;

                const handleMouseMove = (e: MouseEvent) => {
                  setSize({
                    width: Math.max(400, startWidth + (e.clientX - startX)),
                    height: Math.max(300, startHeight + (e.clientY - startY))
                  });
                };

                const handleMouseUp = () => {
                  setIsResizing(false);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </>
        )}
    </motion.div>
  );
};

export default FloatingTerminal;