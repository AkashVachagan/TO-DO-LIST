const API_URL = 'http://localhost:8000';

export const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks/`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
};