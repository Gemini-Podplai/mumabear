import React from 'react';
import AgenticChat from '../ui/AgenticChat';

const MCPMarketDockPanel: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MCP MarketDock Agent</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
                {/* MCP MarketDock UI and agentic controls coming soon */}
                <div className="mb-4 text-gray-700 dark:text-gray-200">MCP MarketDock features coming soon...</div>
                <AgenticChat
                    agentId="mcp_marketdock_agent"
                    agentName="MCP MarketDock Agent"
                    features={{
                        file: true,
                        image: true,
                        audio: true,
                        video: true,
                        rag: true,
                        browser: true
                    }}
                    context={{ /* agentic context properties */ }}
                />
            </div>
        </div>
    );
};

export default MCPMarketDockPanel;
