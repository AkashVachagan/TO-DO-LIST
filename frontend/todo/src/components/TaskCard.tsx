import { Box, Text } from '@chakra-ui/react';
import type { TaskRead } from '../schemas.ts';

function TaskCard({ task }: { task: TaskRead }) {
  return (
    <Box
      bg="gray.50"
      p={3}
      borderRadius="md"
      boxShadow="sm"
      mb={3}
      borderLeft="4px solid"
      borderColor="blue.500" // You can change this color based on priority
    >
      <Text fontWeight="bold">{task.title}</Text>
      <Text fontSize="sm" mt={1}>{task.description}</Text>
    </Box>
  );
}

export default TaskCard;