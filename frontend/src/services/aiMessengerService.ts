// AI Messenger Integration Service
// Connects the AI Instant Messenger frontend with the multimodal chat backend

import { useCallback, useState } from 'react';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    model?: any;
}

interface ModelResponse {
    success: boolean;
    response?: string;
    error?: string;
    timing?: {
        total_time_ms: number;
        model_selection_ms: number;
        processing_ms: number;
    };
    model_used?: string;
    capabilities_used?: string[];
}

export class AIMessengerService {
    private baseUrl: string;
    private endpoint: string;

    constructor(baseUrl = 'http://localhost:5000') {
        this.baseUrl = baseUrl;
        this.endpoint = `${baseUrl}/api/multimodal-chat`;
    }

    /**
     * Get all available models from the backend
     */
    async getAvailableModels(): Promise<any> {
        try {
            const response = await fetch(`${this.endpoint}/models`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch models:', error);
            return { success: false, error: 'Failed to connect to backend' };
        }
    }

    /**
     * Send a message to a specific AI model
     */
    async sendMessage(
        message: string,
        modelId: string,
        options: {
            expressMode?: boolean;
            images?: string[];
            temperature?: number;
            maxTokens?: number;
        } = {}
    ): Promise<ModelResponse> {
        try {
            const payload = {
                message,
                model: modelId,
                express_mode: options.expressMode || false,
                images: options.images || [],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 4096
            };

            const response = await fetch(`${this.endpoint}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to send message:', error);
            return {
                success: false,
                error: 'Failed to send message to backend'
            };
        }
    }

    /**
     * Test model availability and response time
     */
    async testModel(modelId: string): Promise<ModelResponse> {
        const testMessage = `Hello! I'm testing the ${modelId} model. Please respond with a brief greeting and your specialty.`;
        return this.sendMessage(testMessage, modelId, { expressMode: true });
    }

    /**
     * Get model health status
     */
    async getModelHealth(): Promise<any> {
        try {
            const response = await fetch(`${this.endpoint}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to get health status:', error);
            return { success: false, error: 'Health check failed' };
        }
    }
}

/**
 * React hook for AI Messenger integration
 */
export function useAIMessengerService() {
    const [service] = useState(() => new AIMessengerService());
    const [isConnected, setIsConnected] = useState(false);
    const [backendModels, setBackendModels] = useState(null);

    const initializeConnection = useCallback(async () => {
        try {
            const models = await service.getAvailableModels();
            if (models.success) {
                setBackendModels(models);
                setIsConnected(true);
                return true;
            }
        } catch (error) {
            console.error('Failed to initialize connection:', error);
        }
        setIsConnected(false);
        return false;
    }, [service]);

    const sendMessage = useCallback(async (
        message: string,
        modelId: string,
        options?: any
    ) => {
        if (!isConnected) {
            // Fallback: simulate response if backend is not available
            return {
                success: true,
                response: `[Simulated Response from ${modelId}] Hello! I received your message: "${message}". The backend is currently not connected, but this is how I would respond.`,
                timing: { total_time_ms: Math.floor(Math.random() * 500) + 100 },
                model_used: modelId,
                capabilities_used: ['text_generation', 'conversation']
            };
        }

        return service.sendMessage(message, modelId, options);
    }, [service, isConnected]);

    return {
        service,
        isConnected,
        backendModels,
        initializeConnection,
        sendMessage,
        testModel: service.testModel.bind(service),
        getModelHealth: service.getModelHealth.bind(service),
    };
}

export default AIMessengerService;
