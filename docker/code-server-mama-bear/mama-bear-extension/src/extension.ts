/**
 * 🐻 MAMA BEAR VS CODE EXTENSION
 * Integrates Mama Bear AI directly into VS Code for autonomous development
 */

import * as vscode from 'vscode';
import axios from 'axios';

class MamaBearAI {
    private backendUrl: string;
    private outputChannel: vscode.OutputChannel;
    private isActive: boolean = false;

    constructor() {
        this.backendUrl = 'http://localhost:5001';
        this.outputChannel = vscode.window.createOutputChannel('Mama Bear AI');
        this.outputChannel.appendLine('🐻 Mama Bear AI Extension activated!');
    }

    async initialize() {
        try {
            const response = await axios.get(`${this.backendUrl}/api/health`);
            this.isActive = true;
            this.outputChannel.appendLine('✅ Connected to Mama Bear backend!');

            // Load all documentation into RAG
            await this.loadDocumentationRAG();

            // Start autonomous monitoring
            this.startAutonomousMode();

        } catch (error) {
            this.outputChannel.appendLine('❌ Failed to connect to Mama Bear backend');
            vscode.window.showErrorMessage('Mama Bear backend not available');
        }
    }

    async loadDocumentationRAG() {
        this.outputChannel.appendLine('📚 Loading all documentation into Mama Bear RAG...');

        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) return;

        // Find all documentation files
        const docFiles = await vscode.workspace.findFiles('**/*.md', '**/node_modules/**');

        for (const file of docFiles) {
            try {
                const content = await vscode.workspace.fs.readFile(file);
                const text = Buffer.from(content).toString('utf8');

                // Send to Mama Bear RAG system
                await axios.post(`${this.backendUrl}/api/memory/store`, {
                    content: text,
                    metadata: {
                        type: 'documentation',
                        file: file.fsPath,
                        timestamp: new Date().toISOString()
                    }
                });

                this.outputChannel.appendLine(`📄 Loaded: ${file.fsPath}`);
            } catch (error) {
                this.outputChannel.appendLine(`❌ Failed to load: ${file.fsPath}`);
            }
        }

        this.outputChannel.appendLine('✅ All documentation loaded into Mama Bear memory!');
    }

    async startAutonomousMode() {
        this.outputChannel.appendLine('🤖 Starting Mama Bear autonomous development mode...');

        // Watch for file changes
        const watcher = vscode.workspace.createFileSystemWatcher('**/*');

        watcher.onDidChange(async (uri) => {
            if (uri.fsPath.includes('.git') || uri.fsPath.includes('node_modules')) return;

            this.outputChannel.appendLine(`👀 Mama Bear detected change in: ${uri.fsPath}`);
            await this.analyzeAndSuggestFixes(uri);
        });

        // Register commands
        this.registerCommands();
    }

    async analyzeAndSuggestFixes(uri: vscode.Uri) {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const content = document.getText();

            // Send to Mama Bear for analysis
            const response = await axios.post(`${this.backendUrl}/api/mama-bear/analyze`, {
                file: uri.fsPath,
                content: content,
                language: document.languageId
            });

            if (response.data.suggestions?.length > 0) {
                const suggestion = response.data.suggestions[0];

                vscode.window.showInformationMessage(
                    `🐻 Mama Bear suggests: ${suggestion.message}`,
                    'Apply Fix', 'Ignore'
                ).then(async (selection) => {
                    if (selection === 'Apply Fix') {
                        await this.applyMamaBearFix(uri, suggestion);
                    }
                });
            }
        } catch (error) {
            this.outputChannel.appendLine(`❌ Error analyzing file: ${error}`);
        }
    }

    async applyMamaBearFix(uri: vscode.Uri, suggestion: any) {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const edit = new vscode.WorkspaceEdit();

            // Apply Mama Bear's suggested fix
            const range = new vscode.Range(
                suggestion.range.start.line,
                suggestion.range.start.character,
                suggestion.range.end.line,
                suggestion.range.end.character
            );

            edit.replace(uri, range, suggestion.fixedCode);
            await vscode.workspace.applyEdit(edit);

            this.outputChannel.appendLine(`✅ Applied Mama Bear fix to: ${uri.fsPath}`);

            // Auto-save the file
            await document.save();

        } catch (error) {
            this.outputChannel.appendLine(`❌ Error applying fix: ${error}`);
        }
    }

    registerCommands() {
        // Register Mama Bear commands
        vscode.commands.registerCommand('mamaBear.buildProject', async () => {
            await this.buildProjectAutonomously();
        });

        vscode.commands.registerCommand('mamaBear.deployProject', async () => {
            await this.deployProjectAutonomously();
        });

        vscode.commands.registerCommand('mamaBear.fixAllErrors', async () => {
            await this.fixAllErrorsAutonomously();
        });

        vscode.commands.registerCommand('mamaBear.chat', async () => {
            await this.openMamaBearChat();
        });
    }

    async buildProjectAutonomously() {
        this.outputChannel.appendLine('🔨 Mama Bear is building the project autonomously...');

        try {
            const response = await axios.post(`${this.backendUrl}/api/mama-bear/build`, {
                project: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                autonomous: true
            });

            if (response.data.success) {
                vscode.window.showInformationMessage('🎉 Mama Bear successfully built the project!');
                this.outputChannel.appendLine('✅ Project built successfully!');
            } else {
                vscode.window.showErrorMessage('❌ Mama Bear encountered build errors');
                this.outputChannel.appendLine(`❌ Build failed: ${response.data.error}`);
            }
        } catch (error) {
            this.outputChannel.appendLine(`❌ Build error: ${error}`);
        }
    }

    async deployProjectAutonomously() {
        this.outputChannel.appendLine('🚀 Mama Bear is deploying the project autonomously...');

        try {
            const response = await axios.post(`${this.backendUrl}/api/mama-bear/deploy`, {
                project: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                autonomous: true
            });

            if (response.data.success) {
                vscode.window.showInformationMessage('🎉 Mama Bear successfully deployed the project!');
                this.outputChannel.appendLine('✅ Project deployed successfully!');
            }
        } catch (error) {
            this.outputChannel.appendLine(`❌ Deploy error: ${error}`);
        }
    }

    async fixAllErrorsAutonomously() {
        this.outputChannel.appendLine('🔧 Mama Bear is fixing all errors autonomously...');

        const diagnostics = vscode.languages.getDiagnostics();
        let fixedCount = 0;

        for (const [uri, diagnostic] of diagnostics) {
            if (diagnostic.length === 0) continue;

            try {
                const response = await axios.post(`${this.backendUrl}/api/mama-bear/fix-errors`, {
                    file: uri.fsPath,
                    errors: diagnostic.map(d => ({
                        message: d.message,
                        range: {
                            start: { line: d.range.start.line, character: d.range.start.character },
                            end: { line: d.range.end.line, character: d.range.end.character }
                        }
                    }))
                });

                if (response.data.fixes) {
                    for (const fix of response.data.fixes) {
                        await this.applyMamaBearFix(uri, fix);
                        fixedCount++;
                    }
                }
            } catch (error) {
                this.outputChannel.appendLine(`❌ Error fixing ${uri.fsPath}: ${error}`);
            }
        }

        vscode.window.showInformationMessage(`🐻 Mama Bear fixed ${fixedCount} errors autonomously!`);
    }

    async openMamaBearChat() {
        const panel = vscode.window.createWebviewPanel(
            'mamaBearChat',
            '🐻 Chat with Mama Bear',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getChatHTML();

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'sendMessage') {
                const response = await this.sendMessageToMamaBear(message.text);
                panel.webview.postMessage({
                    command: 'receiveMessage',
                    text: response
                });
            }
        });
    }

    async sendMessageToMamaBear(message: string): Promise<string> {
        try {
            const response = await axios.post(`${this.backendUrl}/api/chat`, {
                message: message,
                model_id: 'claude-3.5-sonnet',
                session_id: 'vscode-mama-bear',
                user_id: 'developer',
                context: {
                    workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                    activeFile: vscode.window.activeTextEditor?.document.uri.fsPath
                }
            });

            return response.data.response || 'Mama Bear is thinking...';
        } catch (error) {
            return `❌ Error communicating with Mama Bear: ${error}`;
        }
    }

    getChatHTML(): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: #1e1e1e; color: #fff; }
                .chat-container { height: 400px; overflow-y: auto; border: 1px solid #444; padding: 10px; margin-bottom: 10px; background: #2d2d30; }
                .message { margin-bottom: 10px; padding: 8px; border-radius: 5px; }
                .user-message { background: #007acc; text-align: right; }
                .mama-bear-message { background: #4a4a4a; }
                input { width: 70%; padding: 8px; background: #3c3c3c; border: 1px solid #555; color: #fff; }
                button { padding: 8px 15px; background: #007acc; color: white; border: none; cursor: pointer; }
            </style>
        </head>
        <body>
            <h2>🐻 Chat with Mama Bear</h2>
            <div id="chatContainer" class="chat-container"></div>
            <input type="text" id="messageInput" placeholder="Ask Mama Bear anything..." />
            <button onclick="sendMessage()">Send</button>

            <script>
                const vscode = acquireVsCodeApi();

                function sendMessage() {
                    const input = document.getElementById('messageInput');
                    const message = input.value.trim();
                    if (!message) return;

                    addMessage(message, 'user');
                    input.value = '';

                    vscode.postMessage({
                        command: 'sendMessage',
                        text: message
                    });
                }

                function addMessage(text, sender) {
                    const container = document.getElementById('chatContainer');
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message ' + (sender === 'user' ? 'user-message' : 'mama-bear-message');
                    messageDiv.textContent = (sender === 'user' ? 'You: ' : '🐻 Mama Bear: ') + text;
                    container.appendChild(messageDiv);
                    container.scrollTop = container.scrollHeight;
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'receiveMessage') {
                        addMessage(message.text, 'mama-bear');
                    }
                });

                document.getElementById('messageInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            </script>
        </body>
        </html>`;
    }
}

export function activate(context: vscode.ExtensionContext) {
    const mamaBear = new MamaBearAI();

    // Initialize Mama Bear when extension activates
    mamaBear.initialize();

    // Show welcome message
    vscode.window.showInformationMessage(
        '🐻 Mama Bear AI is now in control of your development environment!',
        'Open Chat', 'View Output'
    ).then((selection) => {
        if (selection === 'Open Chat') {
            vscode.commands.executeCommand('mamaBear.chat');
        } else if (selection === 'View Output') {
            vscode.commands.executeCommand('workbench.action.output.toggleOutput');
        }
    });
}

export function deactivate() {
    // Cleanup when extension deactivates
}
