import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
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

                {/* Revolutionary MCP Client Card */}
                <Link to="/revolutionary-mcp">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg cursor-pointer"
                    >
                        <div className="text-white">
                            <h2 className="text-2xl font-bold mb-2">🚀 Revolutionary MCP Client</h2>
                            <p className="text-purple-100">
                                Connect to ALL MCP marketplaces (Docker, Continue.dev, Claude Desktop). 
                                Let Mama Bear create perfect agents for your projects!
                            </p>
                            <div className="mt-4 flex items-center gap-4 text-sm">
                                <span className="bg-purple-400/30 px-3 py-1 rounded-full">Docker MCP Toolkit</span>
                                <span className="bg-purple-400/30 px-3 py-1 rounded-full">Continue.dev Store</span>
                                <span className="bg-purple-400/30 px-3 py-1 rounded-full">7 AI Personas</span>
                            </div>
                        </div>
                    </motion.div>
                </Link>

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
