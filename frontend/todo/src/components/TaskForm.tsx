import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
  } from '@chakra-ui/react';
import { useState } from 'react';
import { createTask } from '../api';
import type { TaskRead } from '../schemas';

function TaskForm({ onTaskCreated, onClose }: { onTaskCreated: (task: TaskRead) => void; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const newTask = await createTask({ title, description });
        onTaskCreated(newTask);
        onClose();
      } catch (error) {
        console.error("Failed to create task:", error);
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
  
          <Button type="submit" colorScheme="blue">
            Create Task
          </Button>
        </VStack>
      </Box>
    );
  }
  
  export default TaskForm;