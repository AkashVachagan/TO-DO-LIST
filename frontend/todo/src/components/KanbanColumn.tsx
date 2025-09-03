import { Box, Heading, VStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import type { TaskRead } from '../schemas';

// ... (interface KanbanColumnProps remains the same)
interface KanbanColumnProps {
  title: string;
  tasks: TaskRead[];
  id: string;
  onTaskDelete: (taskId: number) => Promise<void>;
  onEdit: (task: TaskRead) => void;
  activeId?: number | null;
  onAdd?: (status: 'new' | 'scheduled') => void;
}


function KanbanColumn({ title, tasks, id, onTaskDelete, onEdit, activeId, onAdd }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  // Dynamic colors for theme
  const columnBg = useColorModeValue('white', 'gray.700');
  const titleColor = useColorModeValue('gray.700', 'gray.200');
  const countBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const countColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      ref={setNodeRef}
      bg={columnBg}
      w="300px"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      mx={2}
      display="flex"
      flexDirection="column"
    >
      <Heading size="md" mb={4} textAlign="center" color={titleColor} display="flex" alignItems="center" justifyContent="center" gap={2} fontFamily="Poppins, sans-serif">
        <Box as="span">{title.toUpperCase()}</Box>
        <Box as="span" w="26px" h="26px" borderRadius="full" bg={countBg} color={countColor} display="inline-flex" alignItems="center" justifyContent="center" fontSize="sm">
          {tasks.length}
        </Box>
        <IconButton aria-label="Add task" icon={<FaPlus />} size="xs" ml={2} variant="ghost" onClick={() => onAdd && onAdd(id as 'new' | 'scheduled')} />
      </Heading>
      <VStack spacing={4} alignItems="stretch" flex={1} overflowY="auto">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDelete={onTaskDelete} 
            onEdit={onEdit}
            isDragging={activeId === task.id}
          />
        ))}
      </VStack>
    </Box>
  );
}

export default KanbanColumn;