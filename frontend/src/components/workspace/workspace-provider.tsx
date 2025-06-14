import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCollaborativeWorkspace } from '../../hooks/use-collaborative-workspace';
import { CollaborationInsights } from './collaboration-insights';
import { CollaboratorPresence } from './collaborator-presence';
import { FloatingToolbar } from './floating-toolbar';
import { FloatingComponent } from './fluid-transition';

interface WorkspaceContextType {
  sessionId: string;
  userId: string;
  collaborators: any[];
  metrics: any;
  expressMode: boolean;
  setExpressMode: (enabled: boolean) => void;
  toggleVideo: (enabled: boolean) => void;
  toggleMic: (enabled: boolean) => void;
  requestAIAssistance: (task: string) => void;
  updateCursorPosition: (position: { x: number; y: number }) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProviderProps {
  children: React.ReactNode;
  sessionId: string;
  userId: string;
  userName: string;
  initialExpressMode?: boolean;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({
  children,
  sessionId,
  userId,
  userName,
  initialExpressMode = true
}) => {
  const [expressMode, setExpressMode] = useState(initialExpressMode);
  const [showCollaborationInsights, setShowCollaborationInsights] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 100, y: 100 });

  const {
    isConnected,
    collaborators,
    metrics,
    updateCursorPosition,
    syncState,
    toggleVideo,
    toggleMic,
    requestAIAssistance
  } = useCollaborativeWorkspace({
    sessionId,
    userId,
    userName,
    expressMode
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [updateCursorPosition]);

  const handleToolClick = (toolId: string) => {
    switch (toolId) {
      case 'command':
        // Handle command palette
        break;
      case 'switch':
        // Handle workspace switch
        break;
      case 'insights':
        setShowCollaborationInsights(!showCollaborationInsights);
        break;
      default:
        setActiveTools(prev =>
          prev.includes(toolId)
            ? prev.filter(t => t !== toolId)
            : [...prev, toolId]
        );
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      sessionId,
      userId,
      collaborators,
      metrics,
      expressMode,
      setExpressMode,
      toggleVideo,
      toggleMic,
      requestAIAssistance,
      updateCursorPosition
    }}>
      <div className="relative">
        {/* Main workspace content */}
        {children}

        {/* Floating toolbar */}
        <FloatingComponent position={toolbarPosition}>
          <FloatingToolbar
            isVisible={isConnected}
            activeTools={activeTools}
            onToolClick={handleToolClick}
          />
        </FloatingComponent>

        {/* Collaborator presence indicators */}
        {collaborators.map(collaborator => (
          collaborator.id !== userId && (
            <CollaboratorPresence
              key={collaborator.id}
              collaborator={collaborator}
              onToggleVideo={() => toggleVideo(!collaborator.hasVideo)}
              onToggleMic={() => toggleMic(!collaborator.hasMic)}
            />
          )
        ))}

        {/* Collaboration insights */}
        <FloatingComponent
          position={{ x: window.innerWidth - 400, y: 100 }}
          isDraggable
          className={showCollaborationInsights ? 'block' : 'hidden'}
        >
          <CollaborationInsights metrics={metrics} />
        </FloatingComponent>

        {/* Express Mode indicator */}
        <div className={`fixed bottom-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${expressMode
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700'
          }`}>
          {expressMode ? '⚡ Express Mode' : 'Standard Mode'}
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
};
