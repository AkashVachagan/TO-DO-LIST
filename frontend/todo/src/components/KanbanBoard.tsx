import { Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Box, IconButton, useColorMode, useColorModeValue, HStack } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import KanbanColumn from './KanbanColumn';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragCancelEvent } from '@dnd-kit/core';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import type { TaskRead } from '../schemas';
import { useEffect, useState } from 'react';

// ... (interface KanbanBoardProps remains the same)
interface KanbanBoardProps {
  tasks: TaskRead[];
  onTaskCreated: (newTask: TaskRead) => void;
  onTaskStatusUpdate: (taskId: number, newStatus: string) => Promise<void>;
  onTaskDelete: (taskId: number) => Promise<void>;
  onTaskUpdate: (updatedTask: TaskRead) => Promise<void>;
}

function KanbanBoard({ tasks, onTaskCreated, onTaskStatusUpdate, onTaskDelete, onTaskUpdate }: KanbanBoardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Get the toggle function instead of the setter
  const { colorMode, toggleColorMode } = useColorMode();
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [createStatus, setCreateStatus] = useState<'new' | 'scheduled' | 'in_progress' | 'completed' | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<TaskRead | null>(null);
  const statuses = ['new', 'scheduled', 'in_progress', 'completed'];

  // Dynamic colors for theme
  const boardBg = useColorModeValue('gray.100', 'gray.800');
  const headerColor = useColorModeValue('black', 'white');
  const switchBg = useColorModeValue('gray.200', 'gray.700');
  const activeSwitchBg = useColorModeValue('blue.500', 'blue.300');
  const activeSwitchColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const text = 'Just do it';
    const el = document.getElementById('typing-header');
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i += 1;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // ... (all handler functions like handleEdit, handleDragStart, etc. remain the same)
  const handleEdit = (task: TaskRead) => {
    setEditingTask(task);
    onOpen();
  };

  const handleClose = () => {
    setEditingTask(null);
    onClose();
  };

  const groupedTasks = statuses.map(status => {
    const list = tasks.filter(task => task.status === status);
    return {
      status,
      tasks: list,
      count: list.length,
    };
  });
  
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as number;
    setActiveTaskId(id);
    const task = tasks.find(t => t.id === id) || null;
    setActiveTask(task);
  };

  const handleDragCancel = (_event: DragCancelEvent) => {
    setActiveTaskId(null);
    setActiveTask(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const taskId = active.id as number;
      const newStatus = over.id as string;
      onTaskStatusUpdate(taskId, newStatus);
    }
    setActiveTaskId(null);
    setActiveTask(null);
  };

  return (
    <>
      <Flex w="100%" justifyContent="center" alignItems="center" mt={4} mb={2} position="relative">
        <Flex fontSize="2xl" fontWeight="bold" fontFamily="Poppins, sans-serif" color={headerColor}>
          <span id="typing-header" style={{ display: 'inline-block', whiteSpace: 'pre' }}></span>
          <span className="blink" style={{ marginLeft: '2px' }}>|</span>
        </Flex>
        
        {/* UPDATED THEME SWITCHER */}
        <HStack
          as="button" // Render the container as a button for accessibility
          onClick={toggleColorMode} // Apply the toggle function to the whole container
          aria-label="Toggle color mode"
          spacing={1}
          bg={switchBg}
          p={1}
          borderRadius="full"
          position="absolute"
          right={4}
          top="50%"
          transform="translateY(-50%)"
          // Reset default button styles
          border="none"
          outline="none"
          _focus={{ outline: "none", boxShadow: "outline" }}
        >
          <IconButton
            aria-label="Light mode is active"
            icon={<FaSun />}
            isRound
            size="sm"
            bg={colorMode === 'light' ? activeSwitchBg : 'transparent'}
            color={colorMode === 'light' ? activeSwitchColor : undefined}
            pointerEvents="none" // Make the icon non-interactive
          />
          <IconButton
            aria-label="Dark mode is active"
            icon={<FaMoon />}
            isRound
            size="sm"
            bg={colorMode === 'dark' ? activeSwitchBg : 'transparent'}
            color={colorMode === 'dark' ? activeSwitchColor : undefined}
            pointerEvents="none" // Make the icon non-interactive
          />
        </HStack>
      </Flex>
      <DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
        {/* ... (rest of the component remains the same) */}
        <Flex p={4} minH="calc(100vh - 70px)" h="calc(100vh - 70px)" bg={boardBg} justifyContent="center" gap={4} overflow="hidden">
          {groupedTasks.map((column) => (
            <KanbanColumn
              key={column.status}
              id={column.status}
              title={`${column.status.replace('_', ' ')}`}
              tasks={column.tasks}
              onTaskDelete={onTaskDelete}
              onEdit={handleEdit}
              activeId={activeTaskId}
              onAdd={(status) => {
                setEditingTask(null);
                setCreateStatus(status as 'new' | 'scheduled');
                onOpen();
              }}
            />
          ))}
        </Flex>
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <TaskCard task={activeTask} onDelete={async () => {}} onEdit={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingTask ? "Edit Task" : "Create a new task"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaskForm 
              task={editingTask}
              createStatus={editingTask ? undefined : createStatus ?? undefined}
              onTaskCreated={onTaskCreated} 
              onTaskUpdated={onTaskUpdate}
              onClose={handleClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default KanbanBoard;