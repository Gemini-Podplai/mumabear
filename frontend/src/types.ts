export interface CollaborativePresence {
    id: string;
    name: string;
    color: string;
    cursor?: { x: number; y: number };
    selection?: { path: string; range: { start: number; end: number } };
    activity?: string;
}

export interface VirtualMachine {
    id: string;
    name: string;
    status: 'starting' | 'running' | 'stopped';
    terminal?: string;
    browser?: string;
    files?: string[];
}

export interface ResearchMessage {
    id: string;
    content: string;
    sender: 'user' | 'ai' | 'system';
    timestamp: Date;
    attachments?: {
        type: 'link' | 'file' | 'image';
        url: string;
        title?: string;
    }[];
    context?: string;
    sources?: string[];
}

export interface BrowserView {
    id: string;
    url: string;
    title: string;
    shared: boolean;
    notes?: string[];
}

export interface ResearchContext {
    documents: string[];
    snippets: { text: string; source: string }[];
    aiInsights: string[];
    relatedTopics: string[];
}
