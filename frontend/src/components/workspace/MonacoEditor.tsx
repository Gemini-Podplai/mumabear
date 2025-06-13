import { useTheme } from '@/contexts/EnhancedThemeContext'
import type { OnMount } from '@monaco-editor/react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import React, { useCallback, useEffect, useRef } from 'react'

interface CursorPosition {
    lineNumber: number
    column: number
}

interface UserPresence {
    id: string
    name: string
    color: string
    cursorPosition?: CursorPosition
    selection?: monaco.Selection
}

interface CollaborationService {
    joinDocument: (path: string) => Promise<void>
    leaveDocument: () => Promise<void>
    updateCursor: (position: CursorPosition) => void
    updateSelection: (selection: monaco.Selection) => void
    applyChanges: (changes: monaco.editor.IModelContentChange[]) => void
    getConnectedUsers: () => UserPresence[]
}

interface FileWatcherService {
    watch: (path: string) => Promise<void>
    unwatch: (path: string) => Promise<void>
}

interface MonacoEditorProps {
    value: string
    language: string
    onChange?: (value: string) => void
    onSave?: () => void
    readOnly?: boolean
    path?: string
    markers?: monaco.editor.IMarkerData[]
    height?: string | number
    collaborationService?: CollaborationService
    fileWatcher?: FileWatcherService
    showCollaborators?: boolean
}

interface CursorDecoration {
    userId: string
    color: string
    decoration: string[]
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
    value,
    language,
    onChange,
    onSave,
    readOnly = false,
    path,
    markers = [],
    height = '100%',
    collaborationService,
    fileWatcher,
    showCollaborators = true
}: MonacoEditorProps) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
    const monacoRef = useRef<typeof monaco | null>(null)
    const cursorDecorationsRef = useRef<CursorDecoration[]>([])
    const { currentTheme } = useTheme()

    // Set up file watcher
    const setupFileWatcher = useCallback(async () => {
        if (!fileWatcher || !path) return undefined

        await fileWatcher.watch(path)
        return async () => {
            if (fileWatcher && path) {
                await fileWatcher.unwatch(path)
            }
        }
    }, [fileWatcher, path])

    // Set up real-time collaboration features
    const setupCollaborationFeatures = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
        if (!collaborationService || !path) return

        // Join document
        const joinDoc = async () => {
            await collaborationService.joinDocument(path)
        }
        joinDoc()

        // Handle cursor changes
        const cursorDisposable = editor.onDidChangeCursorPosition(e => {
            if (!readOnly) {
                collaborationService.updateCursor({
                    lineNumber: e.position.lineNumber,
                    column: e.position.column
                })
            }
        })

        // Handle selection changes
        const selectionDisposable = editor.onDidChangeCursorSelection(e => {
            if (!readOnly) {
                collaborationService.updateSelection(e.selection)
            }
        })

        // Handle content changes
        const contentDisposable = editor.onDidChangeModelContent(e => {
            if (!readOnly) {
                collaborationService.applyChanges(e.changes)
            }
        })

        return () => {
            cursorDisposable.dispose()
            selectionDisposable.dispose()
            contentDisposable.dispose()
        }
    }, [collaborationService, path, readOnly])

    // Handle editor initialization
    const handleEditorDidMount = useCallback<OnMount>((editor, monacoInstance) => {
        editorRef.current = editor
        monacoRef.current = monacoInstance

        // Configure editor
        editor.updateOptions({
            readOnly,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            automaticLayout: true,
            bracketPairColorization: { enabled: true },
            renderWhitespace: 'selection',
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            contextmenu: true,
            quickSuggestions: true
        })

        // Add keyboard shortcuts
        editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
            onSave?.()
        })

        // Set editor theme based on app theme
        const isDark = currentTheme.type === 'dark'
        monacoInstance.editor.setTheme(isDark ? 'vs-dark' : 'vs-light')

        // Setup collaboration features if enabled
        const cleanup = collaborationService && path ? setupCollaborationFeatures(editor) : undefined

        // Watch file changes if path is provided
        let watcherCleanup: (() => Promise<void>) | undefined
        if (fileWatcher && path) {
            setupFileWatcher().then(cleanup => {
                watcherCleanup = cleanup
            }).catch(console.error)
        }

        // Return cleanup function
        return () => {
            cleanup?.()
            if (watcherCleanup) {
                watcherCleanup().catch(console.error)
            }
        }
    }, [currentTheme, onSave, readOnly, collaborationService, fileWatcher, path, setupCollaborationFeatures, setupFileWatcher])

    // Update remote cursors
    useEffect(() => {
        if (!editorRef.current || !collaborationService || !showCollaborators) return

        const editor = editorRef.current
        const model = editor.getModel()
        if (!model) return

        // Remove old decorations
        cursorDecorationsRef.current.forEach(({ decoration }) => {
            model.deltaDecorations(decoration, [])
        })

        // Add new decorations for each user
        const users = collaborationService.getConnectedUsers()
        cursorDecorationsRef.current = users.map(user => {
            if (!user.cursorPosition) return null

            const decoration = model.deltaDecorations([], [{
                range: {
                    startLineNumber: user.cursorPosition.lineNumber,
                    endLineNumber: user.cursorPosition.lineNumber,
                    startColumn: user.cursorPosition.column,
                    endColumn: user.cursorPosition.column
                },
                options: {
                    className: `remote-cursor-${user.id}`,
                    hoverMessage: { value: user.name },
                    glyphMarginClassName: `remote-cursor-glyph-${user.id}`,
                    glyphMarginHoverMessage: { value: user.name }
                }
            }])

            return {
                userId: user.id,
                color: user.color,
                decoration
            }
        }).filter(Boolean) as CursorDecoration[]

        // Add styles for remote cursors
        const styleSheet = document.createElement('style')
        styleSheet.textContent = users.map(user => `
      .remote-cursor-${user.id} {
        background-color: ${user.color};
        width: 2px !important;
      }
      .remote-cursor-glyph-${user.id} {
        background-color: ${user.color};
        width: 4px !important;
      }
    `).join('\n')
        document.head.appendChild(styleSheet)

        return () => {
            document.head.removeChild(styleSheet)
        }
    }, [collaborationService, showCollaborators])

    // Update markers when they change
    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel()
            if (model) {
                monacoRef.current.editor.setModelMarkers(model, 'owner', markers)
            }
        }
    }, [markers])

    // Update theme when it changes
    useEffect(() => {
        if (monacoRef.current) {
            const isDark = currentTheme.type === 'dark'
            monacoRef.current.editor.setTheme(isDark ? 'vs-dark' : 'vs-light')
        }
    }, [currentTheme])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (collaborationService && path) {
                collaborationService.leaveDocument().catch(console.error)
            }
            if (fileWatcher && path) {
                fileWatcher.unwatch(path).catch(console.error)
            }
        }
    }, [collaborationService, fileWatcher, path])

    return (
        <div className="rounded-lg overflow-hidden border border-border">
            <Editor
                height={height}
                defaultLanguage={language}
                value={value}
                onChange={value => onChange?.(value ?? '')}
                onMount={handleEditorDidMount}
                options={{
                    readOnly,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    tabSize: 2,
                    automaticLayout: true
                }}
            />
        </div>
    )
}

export default MonacoEditor
