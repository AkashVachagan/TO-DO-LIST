import { Box, Text } from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { TaskRead } from '../schemas';

function TaskCard({ task }: { task: TaskRead }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      bg="gray.50"
      p={3}
      borderRadius="md"
      boxShadow="sm"
      mb={3}
      borderLeft="4px solid"
      borderColor="blue.500"
    >
      <Text fontWeight="bold">{task.title}</Text>
      <Text fontSize="sm" mt={1}>{task.description}</Text>
    </Box>
  );
}

export default TaskCard;