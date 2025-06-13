import { editor } from 'monaco-editor'
import { io, Socket } from 'socket.io-client'

interface CursorPosition {
    lineNumber: number
    column: number
}

interface UserPresence {
    id: string
    name: string
    color: string
    cursorPosition?: CursorPosition
    selection?: editor.ISelection
}

interface CollaborationOptions {
    onUserJoined?: (user: UserPresence) => void
    onUserLeft?: (userId: string) => void
    onCursorMove?: (userId: string, position: CursorPosition) => void
    onSelectionChange?: (userId: string, selection: editor.ISelection) => void
    onContentChange?: (change: editor.IModelContentChange[]) => void
    onError?: (error: Error) => void
    onConnectionChange?: (connected: boolean) => void
}

class CollaborationService {
    private socket: Socket | null = null
    private options: CollaborationOptions
    private users: Map<string, UserPresence> = new Map()
    private isConnected: boolean = false
    private documentId: string | null = null
    private version: number = 0
    private pendingChanges: editor.IModelContentChange[] = []
    private readonly colors = [
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FFA500', '#800080'
    ]

    constructor(options: CollaborationOptions = {}) {
        this.options = options
    }

    public async connect(url: string = 'ws://localhost:3001'): Promise<void> {
        try {
            this.socket = io(url, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            })

            this.setupSocketListeners()
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    private setupSocketListeners(): void {
        if (!this.socket) return

        this.socket.on('connect', () => {
            this.isConnected = true
            this.options.onConnectionChange?.(true)

            // Rejoin document if was previously joined
            if (this.documentId) {
                this.joinDocument(this.documentId)
            }
        })

        this.socket.on('disconnect', () => {
            this.isConnected = false
            this.options.onConnectionChange?.(false)
        })

        this.socket.on('user:joined', (user: UserPresence) => {
            this.users.set(user.id, {
                ...user,
                color: this.getRandomColor()
            })
            this.options.onUserJoined?.(user)
        })

        this.socket.on('user:left', (userId: string) => {
            this.users.delete(userId)
            this.options.onUserLeft?.(userId)
        })

        this.socket.on('cursor:move', (userId: string, position: CursorPosition) => {
            const user = this.users.get(userId)
            if (user) {
                user.cursorPosition = position
                this.options.onCursorMove?.(userId, position)
            }
        })

        this.socket.on('selection:change', (userId: string, selection: editor.ISelection) => {
            const user = this.users.get(userId)
            if (user) {
                user.selection = selection
                this.options.onSelectionChange?.(userId, selection)
            }
        })

        this.socket.on('content:change', (changes: editor.IModelContentChange[], version: number) => {
            if (version > this.version) {
                this.version = version
                this.options.onContentChange?.(changes)
            }
        })

        this.socket.on('error', (error: Error) => {
            this.options.onError?.(error)
        })
    }

    public async joinDocument(documentId: string): Promise<void> {
        if (!this.socket || !this.isConnected) {
            throw new Error('Not connected to collaboration server')
        }

        try {
            this.documentId = documentId
            this.socket.emit('document:join', documentId)
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public async leaveDocument(): Promise<void> {
        if (!this.socket || !this.isConnected || !this.documentId) {
            return
        }

        try {
            this.socket.emit('document:leave', this.documentId)
            this.documentId = null
            this.users.clear()
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public updateCursor(position: CursorPosition): void {
        if (!this.socket || !this.isConnected || !this.documentId) {
            return
        }

        try {
            this.socket.emit('cursor:move', this.documentId, position)
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public updateSelection(selection: editor.ISelection): void {
        if (!this.socket || !this.isConnected || !this.documentId) {
            return
        }

        try {
            this.socket.emit('selection:change', this.documentId, selection)
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public applyChanges(changes: editor.IModelContentChange[]): void {
        if (!this.socket || !this.isConnected || !this.documentId) {
            this.pendingChanges.push(...changes)
            return
        }

        try {
            this.version++
            this.socket.emit('content:change', this.documentId, changes, this.version)
        } catch (error) {
            this.options.onError?.(error as Error)
        }
    }

    public getConnectedUsers(): UserPresence[] {
        return Array.from(this.users.values())
    }

    public disconnect(): void {
        if (this.documentId) {
            this.leaveDocument()
        }
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
        this.isConnected = false
        this.users.clear()
    }

    private getRandomColor(): string {
        const usedColors = new Set(Array.from(this.users.values()).map(u => u.color))
        const availableColors = this.colors.filter(c => !usedColors.has(c))
        return availableColors[Math.floor(Math.random() * availableColors.length)] || this.colors[0]
    }
}

export const collaboration = new CollaborationService()
export default CollaborationService
