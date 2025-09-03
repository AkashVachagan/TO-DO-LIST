import { Flex, Heading } from '@chakra-ui/react';
import KanbanColumn from './KanbanColumn';
import { useState, useEffect } from 'react';
import { fetchTasks } from '../api.ts';
import type { TaskRead } from '../schemas.ts';

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

  return (
    <Flex p={5} minH="100vh" bg="gray.100" justifyContent="center">
      {groupedTasks.map((column) => (
        <KanbanColumn key={column.status} title={column.status.replace('_', ' ')} tasks={column.tasks} />
      ))}
    </Flex>
  );
}

export default KanbanBoard;