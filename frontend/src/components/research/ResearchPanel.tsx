import React from 'react';
import AgenticChat from '../ui/AgenticChat';

const ResearchPanel: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Research Agent</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
                {/* Research tools and UI would go here */}
                <div className="mb-4 text-gray-700 dark:text-gray-200">Research tools coming soon...</div>
                <AgenticChat
                    agentId="research_agent"
                    agentName="Research Agent"
                    features={{
                        file: true,
                        image: true,
                        audio: true,
                        video: true,
                        rag: true,
                        browser: true
                    }}
                    context={{ /* agentic context here */ }}
                />
            </div>
        </div>
    );
};

export default ResearchPanel;
