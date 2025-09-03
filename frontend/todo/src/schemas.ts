export interface TaskRead {
    id: number;
    title: string;
    description: string | null;
    status: 'new' | 'scheduled' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    created_on: string;
    updated_on: string;
}

export interface TaskCreate {
    title: string;
    description?: string | null;
    status?: 'new' | 'scheduled' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string | null;
}