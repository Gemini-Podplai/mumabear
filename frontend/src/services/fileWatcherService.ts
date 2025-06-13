import { io, Socket } from 'socket.io-client'

interface FileChangeEvent {
    type: 'create' | 'update' | 'delete'
    path: string
    content?: string
}

interface FileWatcherOptions {
    onFileChange?: (event: FileChangeEvent) => void
    onError?: (error: Error) => void
    onConnectionChange?: (connected: boolean) => void
}

class FileWatcherService {
    private socket: Socket | null = null
    private options: FileWatcherOptions
    private watchedPaths: Set<string> = new Set()
    private isConnected: boolean = false
    private reconnectAttempts: number = 0
    private maxReconnectAttempts: number = 5
    private reconnectDelay: number = 1000

    constructor(options: FileWatcherOptions = {}) {
        this.options = options
    }

    public async connect(url: string = 'ws://localhost:3001') {
        try {
            this.socket = io(url, {
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectDelay
            })

            this.socket.on('connect', () => {
                this.isConnected = true
                this.reconnectAttempts = 0
                this.options.onConnectionChange?.(true)

                // Rewatch paths after reconnection
                this.watchedPaths.forEach(path => this.watch(path))
            })

            this.socket.on('disconnect', () => {
                this.isConnected = false
                this.options.onConnectionChange?.(false)
            })

            this.socket.on('file:change', (event: FileChangeEvent) => {
                this.options.onFileChange?.(event)
            })

            this.socket.on('error', (error: Error) => {
                this.options.onError?.(error)
            })

            this.socket.on('reconnect_failed', () => {
                this.options.onError?.(new Error('Failed to reconnect to file watcher service'))
            })

        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public async watch(path: string): Promise<void> {
        if (!this.socket || !this.isConnected) {
            throw new Error('File watcher is not connected')
        }

        try {
            this.socket.emit('watch', path)
            this.watchedPaths.add(path)
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public async unwatch(path: string): Promise<void> {
        if (!this.socket || !this.isConnected) {
            throw new Error('File watcher is not connected')
        }

        try {
            this.socket.emit('unwatch', path)
            this.watchedPaths.delete(path)
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public isWatching(path: string): boolean {
        return this.watchedPaths.has(path)
    }

    public getWatchedPaths(): string[] {
        return Array.from(this.watchedPaths)
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.isConnected = false
            this.watchedPaths.clear()
        }
    }
}

export const fileWatcher = new FileWatcherService()
export default FileWatcherService
