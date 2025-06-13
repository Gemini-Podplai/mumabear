import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { virtualAgentService } from '../../services/virtualAgentService';

interface PlanningViewProps {
    onStartWorkspace: () => void;
}

export const PlanningView: React.FC<PlanningViewProps> = ({ onStartWorkspace }) => {
    const [prompt, setPrompt] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);
    const [plan, setPlan] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsPlanning(true);
        try {
            const taskId = await virtualAgentService.startTask(prompt);

            // Subscribe to task events to show the planning process
            const unsubscribe = virtualAgentService.onEvent((event) => {
                if (event.type === 'plan') {
                    setPlan(prev => [...prev, event.description]);
                }
            });

            // Wait for initial plan to be ready
            await new Promise(resolve => setTimeout(resolve, 2000));
            unsubscribe();
            onStartWorkspace();
        } catch (error) {
            console.error('Failed to start task:', error);
        }
        setIsPlanning(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white"
        >
            <div className="max-w-2xl w-full mx-4">
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-gray-800 rounded-lg p-6 shadow-xl"
                >
                    <h2 className="text-2xl font-semibold mb-4">What would you like MamaBear to help you with?</h2>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-32 px-4 py-2 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Describe your task or research goal..."
                            disabled={isPlanning}
                        />
                        <div className="mt-4 flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    px-6 py-2 rounded-lg font-semibold
                                    ${isPlanning
                                        ? 'bg-purple-500 cursor-wait'
                                        : 'bg-purple-600 hover:bg-purple-700'}
                                `}
                                type="submit"
                                disabled={isPlanning}
                            >
                                {isPlanning ? 'Planning...' : 'Begin'}
                            </motion.button>
                        </div>
                    </form>

                    {isPlanning && plan.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 border-t border-gray-700 pt-4"
                        >
                            <h3 className="text-lg font-medium mb-2">Planning in progress...</h3>
                            <div className="space-y-2">
                                {plan.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start space-x-3"
                                    >
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-xs">
                                            {index + 1}
                                        </div>
                                        <p className="text-gray-300">{step}</p>
                                    </motion.div>
                                ))}
                                <motion.div
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                    className="flex items-center space-x-2 text-purple-400"
                                >
                                    <div className="w-2 h-2 bg-current rounded-full" />
                                    <span className="text-sm">Thinking...</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};
