// components/TaskContextMenu.tsx
import { Box, Button, Flex } from '@chakra-ui/react';
import { FaPen, FaTrash } from 'react-icons/fa';

interface TaskContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  position: { x: number; y: number } | null;
}

function TaskContextMenu({ onEdit, onDelete, position }: TaskContextMenuProps) {
  if (!position) return null;

  return (
    <Box
      position="fixed"
      top={`${position.y}px`}
      left={`${position.x}px`}
      bg="white"
      boxShadow="md"
      borderRadius="md"
      p={2}
      zIndex={50}
    >
      <Flex direction="column" gap={1}>
        <Button 
          leftIcon={<FaPen />} 
          variant="ghost" 
          justifyContent="flex-start" 
          width="100%" 
          size="sm"
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button 
          leftIcon={<FaTrash />} 
          variant="ghost" 
          justifyContent="flex-start" 
          width="100%" 
          size="sm"
          colorScheme="red"
          onClick={onDelete}
        >
          Delete
        </Button>
      </Flex>
    </Box>
  );
}

export default TaskContextMenu;