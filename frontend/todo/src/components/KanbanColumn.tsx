import { Box, Heading } from '@chakra-ui/react';

function KanbanColumn({ title }: { title: string }) {
  return (
    <Box
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
      {/* This is where the tasks will be rendered */}
    </Box>
  );
}

export default KanbanColumn;