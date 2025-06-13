import { motion } from 'framer-motion';
import React from 'react';
import { useAgentStore } from '../../state/agentStore';
import { AgentCard } from '../ui/AgentCard';

export const AgentScoutHub: React.FC = () => {
    const { agents, selectedAgent, setSelectedAgent } = useAgentStore();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Mama Bear Agent Hub
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            isSelected={selectedAgent === agent.id}
                            onClick={() => setSelectedAgent(agent.id)}
                        />
                    ))}
                </div>

                {selectedAgent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                    >
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Working with {agents.find(a => a.id === selectedAgent)?.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Interact with your selected Mama Bear agent here. Start a conversation
                            or initiate a workflow.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default AgentScoutHub;
