import io from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

export interface VirtualAgentEvent {
    type: 'web' | 'terminal' | 'code' | 'file';
    description: string;
    details?: string;
    taskId?: string;
}

export interface AgentTask {
    id: string;
    title: string;
    status: 'running' | 'completed' | 'error';
    progress: number;
    startTime: number;
    endTime?: number;
    events: VirtualAgentEvent[];
}

class VirtualAgentService {
    private taskListeners: ((task: AgentTask) => void)[] = [];
    private eventListeners: ((event: VirtualAgentEvent) => void)[] = [];

    constructor() {
        // Listen for agent events from the backend
        socket.on('agent:event', this.handleAgentEvent);
        socket.on('agent:task_update', this.handleTaskUpdate);
    }

    private handleAgentEvent = (event: VirtualAgentEvent) => {
        this.eventListeners.forEach(listener => listener(event));
    };

    private handleTaskUpdate = (task: AgentTask) => {
        this.taskListeners.forEach(listener => listener(task));
    };

    // Subscribe to agent events
    public onEvent(callback: (event: VirtualAgentEvent) => void): () => void {
        this.eventListeners.push(callback);
        return () => {
            this.eventListeners = this.eventListeners.filter(cb => cb !== callback);
        };
    }

    // Subscribe to task updates
    public onTaskUpdate(callback: (task: AgentTask) => void): () => void {
        this.taskListeners.push(callback);
        return () => {
            this.taskListeners = this.taskListeners.filter(cb => cb !== callback);
        };
    }

    // Start a new agent task
    public async startTask(prompt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:start_task', { prompt }, (response: { taskId: string; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.taskId);
            });
        });
    }

    // Stop an ongoing task
    public async stopTask(taskId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:stop_task', { taskId }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    // Get task status and progress
    public async getTaskStatus(taskId: string): Promise<AgentTask> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:get_task_status', { taskId }, (response: { task: AgentTask; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.task);
            });
        });
    }

    // Get all events for a task
    public async getTaskEvents(taskId: string): Promise<VirtualAgentEvent[]> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:get_task_events', { taskId }, (response: { events: VirtualAgentEvent[]; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.events);
            });
        });
    }

    // Execute a command in the virtual computer
    public async executeCommand(command: string, taskId?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:execute_command', { command, taskId }, (response: { output: string; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.output);
            });
        });
    }

    // Navigate to a URL in the virtual browser
    public async navigateToUrl(url: string, taskId?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:navigate', { url, taskId }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    // Create or modify a file in the virtual workspace
    public async writeFile(path: string, content: string, taskId?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:write_file', { path, content, taskId }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    // Read a file from the virtual workspace
    public async readFile(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('agent:read_file', { path }, (response: { content: string; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.content);
            });
        });
    }
}

export const virtualAgentService = new VirtualAgentService();
