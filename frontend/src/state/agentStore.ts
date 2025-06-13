import { create } from 'zustand';
import { type AgentVariant, type WorkflowStep } from '../types/agents';

interface AgentState {
    agents: AgentVariant[];
    selectedAgent: string | null;
    workflowSteps: WorkflowStep[];
    setSelectedAgent: (id: string | null) => void;
    updateAgentStatus: (id: string, status: AgentVariant['status']) => void;
    updateWorkflowStep: (stepId: string, status: WorkflowStep['status']) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
    agents: [
        {
            id: 'scout_commander',
            name: '🧭 Scout Commander',
            description: 'Strategy & orchestration expert',
            icon: '🧭',
            status: 'idle'
        },
        {
            id: 'code_review_bear',
            name: '🛠️ Code Review Bear',
            description: 'Code quality & best practices guardian',
            icon: '🛠️',
            status: 'idle'
        },
        {
            id: 'research_bear',
            name: '📚 Research Bear',
            description: 'Deep learning & analysis specialist',
            icon: '📚',
            status: 'idle'
        },
        {
            id: 'test_bear',
            name: '🧪 Test Bear',
            description: 'Quality assurance & testing expert',
            icon: '🧪',
            status: 'idle'
        },
        {
            id: 'security_bear',
            name: '🔒 Security Bear',
            description: 'Security & compliance guardian',
            icon: '🔒',
            status: 'idle'
        },
        {
            id: 'deploy_bear',
            name: '🚀 Deploy Bear',
            description: 'Deployment & DevOps specialist',
            icon: '🚀',
            status: 'idle'
        },
        {
            id: 'docs_bear',
            name: '📝 Docs Bear',
            description: 'Documentation & knowledge expert',
            icon: '📝',
            status: 'idle'
        }
    ],
    selectedAgent: null,
    workflowSteps: [],
    setSelectedAgent: (id) => set({ selectedAgent: id }),
    updateAgentStatus: (id, status) =>
        set((state) => ({
            agents: state.agents.map((agent) =>
                agent.id === id ? { ...agent, status } : agent
            ),
        })),
    updateWorkflowStep: (stepId, status) =>
        set((state) => ({
            workflowSteps: state.workflowSteps.map((step) =>
                step.id === stepId ? { ...step, status } : step
            ),
        })),
}));
