export interface AgentVariant {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: 'idle' | 'active' | 'busy';
}

export interface WorkflowStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'completed' | 'error';
    agentId: string;
}
