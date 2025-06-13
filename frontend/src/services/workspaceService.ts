import io from 'socket.io-client';
import { type CollaborativePresence, type VirtualMachine } from '../types';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

export type FileOperation = {
    type: 'read' | 'write' | 'create' | 'delete';
    path: string;
    content?: string;
};

class WorkspaceService {
    // File operations
    async readFile(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('workspace:readFile', { path }, (response: { content: string; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.content);
            });
        });
    }

    async writeFile(path: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('workspace:writeFile', { path, content }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    async deleteFile(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('workspace:deleteFile', { path }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    async createDirectory(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('workspace:createDirectory', { path }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    async listDirectory(path: string): Promise<{ name: string; type: 'file' | 'directory' }[]> {
        return new Promise((resolve, reject) => {
            socket.emit('workspace:listDirectory', { path }, (response: {
                items: { name: string; type: 'file' | 'directory' }[];
                error?: string
            }) => {
                if (response.error) reject(response.error);
                else resolve(response.items);
            });
        });
    }

    // Git operations
    async getGitStatus(): Promise<any> {
        return new Promise((resolve, reject) => {
            socket.emit('git:status', (response: { status: any; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.status);
            });
        });
    }

    async gitAdd(files: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('git:add', { files }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    async gitCommit(message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit('git:commit', { message }, (response: { error?: string }) => {
                if (response.error) reject(response.error);
                else resolve();
            });
        });
    }

    // Terminal operations
    async executeCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('terminal:execute', { command }, (response: { output: string; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.output);
            });
        });
    }

    // File search
    async searchFiles(query: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            socket.emit('workspace:search', { query }, (response: { results: string[]; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.results);
            });
        });
    }

    // Live file system events
    onFileChange(callback: (operation: FileOperation) => void): () => void {
        socket.on('workspace:fileChange', callback);
        return () => {
            socket.off('workspace:fileChange', callback);
        };
    }

    // File sharing
    async shareFile(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('workspace:shareFile', { path }, (response: { shareUrl: string; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.shareUrl);
            });
        });
    }

    // Track shared files
    onFileShared(callback: (data: { path: string; shareUrl: string }) => void): () => void {
        socket.on('workspace:fileShared', callback);
        return () => {
            socket.off('workspace:fileShared', callback);
        };
    }

    // Collaboration features
    updateCollaboratorPosition(position: { x: number; y: number }): void {
        socket.emit('collaborator:updatePosition', position);
    }

    onCollaboratorUpdate(callback: (collaborators: CollaborativePresence[]) => void): () => void {
        socket.on('collaborator:update', callback);
        return () => {
            socket.off('collaborator:update', callback);
        };
    }

    // Virtual machine management
    async startVirtualMachine(): Promise<VirtualMachine> {
        return new Promise((resolve, reject) => {
            socket.emit('vm:start', (response: { vm: VirtualMachine; error?: string }) => {
                if (response.error) reject(response.error);
                else resolve(response.vm);
            });
        });
    }

    // Directory operations
    onDirectoryUpdated(callback: (data: { path: string }) => void): () => void {
        socket.on('workspace:directoryUpdated', callback);
        return () => {
            socket.off('workspace:directoryUpdated', callback);
        };
    }
}

export const workspaceService = new WorkspaceService();
