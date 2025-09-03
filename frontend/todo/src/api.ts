import type { TaskRead, TaskCreate } from './schemas';

const API_URL = 'http://localhost:8000';

export const fetchTasks = async (): Promise<TaskRead[]> => {
    const response = await fetch(`${API_URL}/tasks/`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
};

export const updateTaskStatus = async (taskId: number, newStatus: string) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
        throw new Error('Failed to update task status');
    }
    return response.json();
};

export const createTask = async (taskData: TaskCreate): Promise<TaskRead> => {
    const response = await fetch(`${API_URL}/tasks/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    return response.json();
};