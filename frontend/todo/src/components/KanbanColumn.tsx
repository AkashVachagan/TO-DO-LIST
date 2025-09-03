import { Box, Heading, VStack } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import type { TaskRead } from '../schemas';

function KanbanColumn({ title, tasks, id }: { title: string; tasks: TaskRead[]; id: string }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <Box
      ref={setNodeRef}
      bg="white"
      w="300px"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      mx={2}
    >
      <Heading size="md" mb={4} textAlign="center">
        {title}
      </Heading>
      <VStack spacing={3} alignItems="stretch">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </VStack>
    </Box>
  );
}

export default KanbanColumn;