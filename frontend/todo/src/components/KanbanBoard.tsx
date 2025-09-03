import { Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import KanbanColumn from './KanbanColumn';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import TaskForm from './TaskForm'; 
import type { TaskRead } from '../schemas';

// Define the shape of the props the component expects
interface KanbanBoardProps {
  tasks: TaskRead[];
  onTaskCreated: (newTask: TaskRead) => void;
  onTaskStatusUpdate: (taskId: number, newStatus: string) => Promise<void>;
}

// Update the function signature to accept and destructure the props
function KanbanBoard({ tasks, onTaskCreated, onTaskStatusUpdate }: KanbanBoardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const statuses = ['new', 'scheduled', 'in_progress', 'completed'];

  const groupedTasks = statuses.map(status => {
    return {
      status,
      tasks: tasks.filter(task => task.status === status)
    };
  });
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const taskId = active.id as number;
        const newStatus = over.id as string;
        onTaskStatusUpdate(taskId, newStatus);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" position="fixed" bottom="4" right="4" zIndex="10">
        Create New Task
      </Button>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaskForm onTaskCreated={onTaskCreated} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default KanbanBoard;