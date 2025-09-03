import { Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Box } from '@chakra-ui/react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragCancelEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import type { TaskRead } from '../schemas';
import { useState, useMemo } from 'react';

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

interface KanbanBoardProps {
    tasks: TaskRead[];
    onTaskCreated: (newTask: Omit<TaskRead, 'id' | 'created_on' | 'updated_on'>) => Promise<void>;
    onTaskStatusUpdate: (taskId: number, newStatus: string) => Promise<void>;
    onTaskDelete: (taskId: number) => Promise<void>;
    onTaskUpdate: (updatedTask: TaskRead) => Promise<void>;
    sortOrder: string;
}

function KanbanBoard({ tasks, onTaskCreated, onTaskStatusUpdate, onTaskDelete, onTaskUpdate, sortOrder }: KanbanBoardProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
    const [createStatus, setCreateStatus] = useState<TaskRead['status'] | null>(null);
    const [activeTask, setActiveTask] = useState<TaskRead | null>(null);
    const statuses: TaskRead['status'][] = ['new', 'scheduled', 'in_progress', 'completed'];

    const boardVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const columnVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    const handleEdit = (task: TaskRead) => {
        setEditingTask(task);
        onOpen();
    };

    const handleClose = () => {
        setEditingTask(null);
        setCreateStatus(null);
        onClose();
    };

    const groupedTasks = useMemo(() => {
        const priorityMap: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
        return statuses.map(status => {
            const list = tasks.filter(task => task.status === status);
            list.sort((a, b) => {
                switch (sortOrder) {
                    case 'created_on_desc':
                        return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
                    case 'due_date_asc':
                        if (!a.due_date) return 1;
                        if (!b.due_date) return -1;
                        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
                    case 'priority':
                    default:
                        return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
                }
            });
            return { status, tasks: list };
        });
    }, [tasks, sortOrder, statuses]);

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as number;
        const task = tasks.find(t => t.id === id) || null;
        setActiveTask(task);
    };

    const handleDragCancel = (_event: DragCancelEvent) => {
        setActiveTask(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);
        if (over && active.id !== over.id) {
            const taskId = active.id as number;
            const newStatus = over.id as string;
            onTaskStatusUpdate(taskId, newStatus);
        }
    };

    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
                <MotionFlex
                    variants={boardVariants}
                    initial="hidden"
                    animate="visible"
                    px={4}
                    pb={4}
                    flexGrow={1}
                    minH={0}
                    justifyContent="center"
                    gap={6}
                    overflow="hidden"
                >
                    {groupedTasks.map((column) => (
                        <MotionBox variants={columnVariants} key={column.status}>
                            <KanbanColumn
                                id={column.status}
                                title={`${column.status.replace('_', ' ')}`}
                                tasks={column.tasks}
                                onTaskDelete={onTaskDelete}
                                onEdit={handleEdit}
                                activeId={activeTask?.id}
                                // This is where the second error was fixed
                                onAdd={(status: TaskRead['status']) => {
                                    setEditingTask(null);
                                    setCreateStatus(status);
                                    onOpen();
                                }}
                            />
                        </MotionBox>
                    ))}
                </MotionFlex>
                <DragOverlay dropAnimation={null}>
                    {activeTask ? (<Box boxShadow="2xl"><TaskCard task={activeTask} onDelete={async () => {}} onEdit={() => {}} /></Box>) : null}
                </DragOverlay>
            </DndContext>
            <Modal isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent>
                    <ModalHeader>{editingTask ? "Edit Task" : "Create a new task"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <TaskForm 
                            task={editingTask} 
                            createStatus={createStatus ?? undefined} 
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