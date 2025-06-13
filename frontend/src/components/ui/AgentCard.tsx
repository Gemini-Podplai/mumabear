import { motion } from 'framer-motion';
import React from 'react';
import { AgentVariant } from '../types/agents';

interface AgentCardProps {
    agent: AgentVariant;
    isSelected: boolean;
    onClick: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isSelected, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        p-4 rounded-xl cursor-pointer transition-colors duration-200
        ${isSelected
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700'
                }
      `}
            onClick={onClick}
        >
            <div className="flex items-start space-x-4">
                <div className="text-4xl">{agent.icon}</div>
                <div className="flex-1">
                    <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {agent.name}
                    </h3>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {agent.description}
                    </p>
                    <div className="mt-2">
                        <span
                            className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${agent.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : agent.status === 'busy'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }
              `}
                        >
                            {agent.status}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
