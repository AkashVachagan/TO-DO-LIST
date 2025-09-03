import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../api';
import type { TaskRead } from '../schemas';

interface TaskFormProps {
  task?: TaskRead | null;
  createStatus?: TaskRead['status'];
  onTaskCreated?: (newTask: TaskRead) => void;
  onTaskUpdated?: (updatedTask: TaskRead) => Promise<void>;
  onClose: () => void;
}

function TaskForm({ task, createStatus, onTaskCreated, onTaskUpdated, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskRead['status']>(task?.status || createStatus || 'new');
  const [priority, setPriority] = useState<TaskRead['priority']>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState<string>(task?.due_date || '');

  const isEditing = !!task;

  useEffect(() => {
      if (task) {
          setTitle(task.title);
          setDescription(task.description ?? '');
          setStatus(task.status);
          setPriority(task.priority);
          setDueDate(task.due_date ?? '');
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
      // FIX: If dueDate is an empty string, send null instead.
      const payload = {
        title,
        description,
        status,
        priority,
        due_date: dueDate || null
      };

      try {
          if (isEditing && task) {
              const updatedTask = await updateTask(task.id, payload);
              onTaskUpdated?.(updatedTask);
          } else {
              const newTask = await createTask(payload);
              onTaskCreated?.(newTask);
          }
          onClose();
      } catch (error) {
          console.error(isEditing ? "Failed to update task:" : "Failed to create task:", error);
      }
  };

  return (
      <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
              <FormControl id="title" isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Fix the code" />
              </FormControl>

              <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Find the bug in the DND component" />
              </FormControl>

              {!createStatus && (
                  <FormControl id="status" isRequired>
                      <FormLabel>Status</FormLabel>
                      <Select value={status} onChange={(e) => setStatus(e.target.value as TaskRead['status'])}>
                          <option value="new">New</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                      </Select>
                  </FormControl>
              )}

              <FormControl id="priority" isRequired>
                  <FormLabel>Priority</FormLabel>
                  <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskRead['priority'])}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                  </Select>
              </FormControl>

              <FormControl id="due_date" isRequired={status === 'scheduled'}>
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