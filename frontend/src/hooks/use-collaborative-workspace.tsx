import { useState, useEffect, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  cursorPosition?: { x: number; y: number };
  isTyping?: boolean;
  isSpeaking?: boolean;
  hasVideo?: boolean;
  hasMic?: boolean;
}

interface CollaborationMetrics {
  participantCount: number;
  activeCollaborations: number;
  responseTimeMs: number;
  codeExecutions: number;
  realTimeSync: {
    cursorUpdates: number;
    stateUpdates: number;
  };
  expressMode: {
    speedImprovement: number;
    agenticAssistance: number;
  };
}

interface UseCollaborativeWorkspaceOptions {
  sessionId: string;
  userId: string;
  userName: string;
  expressMode?: boolean;
  initialMetrics?: Partial<CollaborationMetrics>;
}

export const useCollaborativeWorkspace = ({
  sessionId,
  userId,
  userName,
  expressMode = true,
  initialMetrics = {}
}: UseCollaborativeWorkspaceOptions) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [metrics, setMetrics] = useState<CollaborationMetrics>({
    participantCount: 0,
    activeCollaborations: 0,
    responseTimeMs: 0,
    codeExecutions: 0,
    realTimeSync: {
      cursorUpdates: 0,
      stateUpdates: 0,
    },
    expressMode: {
      speedImprovement: 6, // Default Express Mode improvement
      agenticAssistance: 0,
    },
    ...initialMetrics
  });

  // Refs for performance optimization
  const lastCursorUpdate = useRef<number>(0);
  const lastStateSync = useRef<{ [key: string]: any }>({});

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io('wss://collaboration.dev', {
      query: {
        sessionId,
        userId,
        userName,
        expressMode
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to collaborative workspace');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from collaborative workspace');
    });

    // Handle collaborator updates
    newSocket.on('collaborator_joined', (collaborator: Collaborator) => {
      setCollaborators(prev => [...prev, collaborator]);
      setMetrics(prev => ({
        ...prev,
        participantCount: prev.participantCount + 1
      }));
    });

    newSocket.on('collaborator_left', (collaboratorId: string) => {
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      setMetrics(prev => ({
        ...prev,
        participantCount: Math.max(0, prev.participantCount - 1)
      }));
    });

    // Handle cursor and state updates
    newSocket.on('cursor_update', ({ userId, position }) => {
      setCollaborators(prev => prev.map(c =>
        c.id === userId ? { ...c, cursorPosition: position } : c
      ));

      setMetrics(prev => ({
        ...prev,
        realTimeSync: {
          ...prev.realTimeSync,
          cursorUpdates: prev.realTimeSync.cursorUpdates + 1
        }
      }));
    });

    // Handle Express Mode metrics
    newSocket.on('express_mode_update', (update) => {
      setMetrics(prev => ({
        ...prev,
        expressMode: {
          ...prev.expressMode,
          ...update
        }
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [sessionId, userId, userName, expressMode]);

  // Update cursor position with throttling for performance
  const updateCursorPosition = useCallback((position: { x: number; y: number }) => {
    const now = Date.now();
    if (now - lastCursorUpdate.current > (expressMode ? 16 : 32)) { // 60fps in Express Mode
      socket?.emit('cursor_update', { position });
      lastCursorUpdate.current = now;
    }
  }, [socket, expressMode]);

  // Sync state changes with optimized diffing
  const syncState = useCallback((state: { [key: string]: any }) => {
    const diff = Object.entries(state).reduce((acc, [key, value]) => {
      if (lastStateSync.current[key] !== value) {
        acc[key] = value;
      }
      return acc;
    }, {} as { [key: string]: any });

    if (Object.keys(diff).length > 0) {
      socket?.emit('state_sync', diff);
      lastStateSync.current = { ...lastStateSync.current, ...diff };

      setMetrics(prev => ({
        ...prev,
        realTimeSync: {
          ...prev.realTimeSync,
          stateUpdates: prev.realTimeSync.stateUpdates + 1
        }
      }));
    }
  }, [socket]);

  // Control video/audio streams
  const toggleVideo = useCallback((enabled: boolean) => {
    socket?.emit('toggle_video', { enabled });
    setCollaborators(prev => prev.map(c =>
      c.id === userId ? { ...c, hasVideo: enabled } : c
    ));
  }, [socket, userId]);

  const toggleMic = useCallback((enabled: boolean) => {
    socket?.emit('toggle_mic', { enabled });
    setCollaborators(prev => prev.map(c =>
      c.id === userId ? { ...c, hasMic: enabled } : c
    ));
  }, [socket, userId]);

  // Method to request AI assistance
  const requestAIAssistance = useCallback(async (task: string) => {
    socket?.emit('ai_assistance_request', { task });
  }, [socket]);

  return {
    isConnected,
    collaborators,
    metrics,
    updateCursorPosition,
    syncState,
    toggleVideo,
    toggleMic,
    requestAIAssistance
  };
};
