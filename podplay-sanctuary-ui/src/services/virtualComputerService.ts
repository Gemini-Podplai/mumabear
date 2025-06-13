/**
 * Virtual Computer Service - Frontend API Client
 * Handles communication with the backend virtual computer service
 */

import io, { Socket } from 'socket.io-client';

export interface WorkspaceCreationRequest {
  agent_name: string;
  user_id: string;
  task_description: string;
}

export interface WorkspaceStatus {
  workspace_id: string;
  agent_name: string;
  status: string;
  progress: number;
  current_step: string;
  timeline: TimelineActivity[];
  file_tree: FileTreeNode;
  environments: VirtualEnvironment[];
  output_files: string[];
}

export interface TimelineActivity {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  details?: string;
  status: string;
  files_affected: string[];
}

export interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  content?: string;
}

export interface VirtualEnvironment {
  environment_id: string;
  type: string;
  status: string;
}

export interface CommandExecutionRequest {
  command: string;
  environment_type?: string;
}

export interface FileUpdateRequest {
  file_path: string;
  content: string;
  operation?: 'create' | 'update' | 'delete';
}

class VirtualComputerService {
  private baseUrl: string;
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  /**
   * Initialize WebSocket connection for real-time updates
   */
  initializeSocket(userId: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.baseUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to virtual computer service');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from virtual computer service');
    });

    // Handle real-time events
    this.socket.on('workspace_created', (data) => {
      this.emitEvent('workspace_created', data);
    });

    this.socket.on('execution_started', (data) => {
      this.emitEvent('execution_started', data);
    });

    this.socket.on('command_executed', (data) => {
      this.emitEvent('command_executed', data);
    });

    this.socket.on('file_updated', (data) => {
      this.emitEvent('file_updated', data);
    });

    this.socket.on('workspace_stats_update', (data) => {
      this.emitEvent('workspace_stats_update', data);
    });
  }

  /**
   * Join a workspace room for real-time updates
   */
  joinWorkspace(workspaceId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit('join_workspace', {
        workspace_id: workspaceId,
        user_id: userId,
      });
    }
  }

  /**
   * Leave a workspace room
   */
  leaveWorkspace(workspaceId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit('leave_workspace', {
        workspace_id: workspaceId,
        user_id: userId,
      });
    }
  }

  /**
   * Create a new agent workspace
   */
  async createWorkspace(request: WorkspaceCreationRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create workspace');
      }

      return data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  }

  /**
   * Start agent execution in workspace
   */
  async startExecution(workspaceId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/workspaces/${workspaceId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start execution');
      }

      return data;
    } catch (error) {
      console.error('Error starting execution:', error);
      throw error;
    }
  }

  /**
   * Get workspace status and timeline
   */
  async getWorkspaceStatus(workspaceId: string): Promise<WorkspaceStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/workspaces/${workspaceId}/status`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get workspace status');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to get workspace status');
      }

      return data;
    } catch (error) {
      console.error('Error getting workspace status:', error);
      throw error;
    }
  }

  /**
   * Execute a command in the workspace
   */
  async executeCommand(workspaceId: string, request: CommandExecutionRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/workspaces/${workspaceId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute command');
      }

      return data;
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }

  /**
   * Update a file in the workspace
   */
  async updateFile(workspaceId: string, request: FileUpdateRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/workspaces/${workspaceId}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update file');
      }

      return data;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  /**
   * Get a file from the workspace
   */
  async getFile(workspaceId: string, filePath: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/workspaces/${workspaceId}/files/${encodeURIComponent(filePath)}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get file');
      }

      return data;
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  }

  /**
   * Get virtual computer service statistics
   */
  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/stats`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get stats');
      }

      return data;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  /**
   * Get available environment types
   */
  async getEnvironmentTypes(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/virtual-computer/environments/types`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get environment types');
      }

      return data;
    } catch (error) {
      console.error('Error getting environment types:', error);
      throw error;
    }
  }

  /**
   * Get timeline activities for a workspace
   */
  async getTimelineActivities(workspaceId: string): Promise<TimelineActivity[]> {
    try {
      const status = await this.getWorkspaceStatus(workspaceId);
      return status.timeline || [];
    } catch (error) {
      console.error('Error getting timeline activities:', error);
      return [];
    }
  }

  /**
   * Get file tree for a workspace
   */
  async getFileTree(workspaceId: string): Promise<FileTreeNode[]> {
    try {
      const status = await this.getWorkspaceStatus(workspaceId);
      return status.file_tree ? [status.file_tree] : [];
    } catch (error) {
      console.error('Error getting file tree:', error);
      return [];
    }
  }

  /**
   * Event listener shortcuts for workspace updates
   */
  onWorkspaceUpdate(callback: Function): void {
    this.addEventListener('workspace_stats_update', callback);
  }

  offWorkspaceUpdate(callback: Function): void {
    this.removeEventListener('workspace_stats_update', callback);
  }

  onTimelineUpdate(callback: Function): void {
    this.addEventListener('command_executed', callback);
  }

  offTimelineUpdate(callback: Function): void {
    this.removeEventListener('command_executed', callback);
  }

  onFileTreeUpdate(callback: Function): void {
    this.addEventListener('file_updated', callback);
  }

  offFileTreeUpdate(callback: Function): void {
    this.removeEventListener('file_updated', callback);
  }

  /**
   * Add event listener
   */
  addEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export singleton instance
export const virtualComputerService = new VirtualComputerService();
export default virtualComputerService;