import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, Select, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import type { TaskRead } from '../schemas';

interface TaskFormProps {
    task?: TaskRead | null;
    createStatus?: TaskRead['status'];
    onTaskCreated?: (newTask: Omit<TaskRead, 'id' | 'created_on' | 'updated_on'>) => Promise<void>;
    onTaskUpdated?: (updatedTask: TaskRead) => Promise<void>;
    onClose: () => void;
}

function TaskForm({ task, createStatus, onTaskCreated, onTaskUpdated, onClose }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskRead['status']>('new');
    const [priority, setPriority] = useState<TaskRead['priority']>('medium');
    const [dueDate, setDueDate] = useState('');

    const isEditing = !!task;

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description ?? '');
            setStatus(task.status);
            setPriority(task.priority);
            setDueDate(task.due_date ? task.due_date.substring(0, 16) : '');
        } else {
            setTitle('');
            setDescription('');
            setStatus(createStatus || 'new');
            setPriority('medium');
            setDueDate('');
        }
    }, [task, createStatus]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;

        const payload = {
            title,
            description,
            status,
            priority,
            due_date: formattedDueDate
        };

        try {
            if (isEditing && task && onTaskUpdated) {
                await onTaskUpdated({ ...task, ...payload });
            } else if (onTaskCreated) {
                await onTaskCreated(payload);
            }
            onClose();
        } catch (error) {
            console.error(isEditing ? "Form failed to submit update:" : "Form failed to submit creation:", error);
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <FormControl id="title" isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Design the new homepage" />
                </FormControl>
                <FormControl id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Create mockups in Figma" />
                </FormControl>
                
                <FormControl id="status" isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value as TaskRead['status'])}
                        isDisabled={!!createStatus}
                    >
                        <option value="new">New</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </Select>
                </FormControl>

                <FormControl id="priority" isRequired>
                    <FormLabel>Priority</FormLabel>
                    <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskRead['priority'])}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </Select>
                </FormControl>
                <FormControl id="due_date">
                    <FormLabel>Due Date & Time</FormLabel>
                    <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </FormControl>
                <Flex w="100%" justifyContent="flex-end" mt={4}>
                    <Button type="submit" colorScheme="blue">
                        {isEditing ? "Update Task" : "Create Task"}
                    </Button>
                </Flex>
            </VStack>
        </Box>
    );
}

export default TaskForm;