import { Flex, Heading } from '@chakra-ui/react';
import KanbanColumn from './KanbanColumn';

function KanbanBoard() {
  const statuses = ['new', 'scheduled', 'in_progress', 'completed'];

  return (
    <Flex p={5} minH="100vh" bg="gray.100" justifyContent="center">
      {statuses.map((status) => (
        <KanbanColumn key={status} title={status.replace('_', ' ')} />
      ))}
    </Flex>
  );
}

export default KanbanBoard;