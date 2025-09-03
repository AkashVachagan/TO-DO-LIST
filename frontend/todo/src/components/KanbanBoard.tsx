import { Flex, Heading } from '@chakra-ui/react';
import KanbanColumn from './KanbanColumn';
import { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { fetchTasks, updateTaskStatus } from '../api';
import type { TaskRead } from '../schemas';

function KanbanBoard() {
  const statuses = ['new', 'scheduled', 'in_progress', 'completed'];
  const [tasks, setTasks] = useState<TaskRead[]>([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const groupedTasks = statuses.map(status => {
    return {
      status,
      tasks: tasks.filter(task => task.status === status)
    };
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const taskId = active.id as number;
        const newStatus = over.id as 'new' | 'scheduled' | 'in_progress' | 'completed';
        
        try {
            await updateTaskStatus(taskId, newStatus);
            const updatedTasks = tasks.map(task => 
                task.id === taskId ? { ...task, status: newStatus } : task
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Flex p={5} minH="100vh" bg="gray.100" justifyContent="center">
        {groupedTasks.map((column) => (
          <KanbanColumn
            key={column.status}
            id={column.status}
            title={column.status.replace('_', ' ')}
            tasks={column.tasks}
          />
        ))}
      </Flex>
    </DndContext>
  );
}

export default KanbanBoard;