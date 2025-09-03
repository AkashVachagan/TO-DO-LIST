import { Box, Text, IconButton, Flex, useColorModeValue } from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash, FaPen } from 'react-icons/fa';
import type { TaskRead } from '../schemas';
import type React from 'react';

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'red.500';
        case 'medium':
            return 'yellow.500';
        case 'low':
        default:
            return 'green.500';
    }
};

// ... (interface TaskCardProps remains the same)
interface TaskCardProps {
    task: TaskRead;
    onDelete: (taskId: number) => Promise<void>; 
    onEdit: (task: TaskRead) => void;
    isDragging?: boolean;
}

function TaskCard({ task, onDelete, onEdit, isDragging = false }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
        data: { task },
    });

    // Dynamic colors for theme
    const cardBg = useColorModeValue(
        task.priority === 'high' ? 'red.50' : task.priority === 'medium' ? 'yellow.50' : 'green.50',
        'gray.600' // A single, consistent background for dark mode cards
    );
    const dateColor = useColorModeValue('gray.600', 'gray.400');

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        visibility: isDragging ? 'hidden' : 'visible',
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            cursor="grab"
            opacity={isDragging ? 0.5 : 1}
            transition="transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
            p={3}
            borderRadius="md"
            boxShadow="sm"
            mb={3}
            borderLeft="4px solid"
            borderColor={getPriorityColor(task.priority)}
            bg={cardBg}
            position="relative"
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold">{task.title}</Text>
                <Flex>
                    <IconButton
                        aria-label="Delete task"
                        icon={<FaTrash />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        mr={1}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onDelete(task.id)}
                    />
                    <IconButton
                        aria-label="Edit task"
                        icon={<FaPen />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onEdit(task)}
                    />
                </Flex>
            </Flex>
            <Text fontSize="sm" mt={1}>{task.description}</Text>
            {task.due_date ? (
                <Text fontSize="xs" mt={2} color={dateColor}>
                    {(() => {
                        const days = Math.ceil((new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        if (days < 0) {
                            return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
                        }
                        return `${days} day${days !== 1 ? 's' : ''} left`;
                    })()}
                </Text>
            ) : null}
        </Box>
    );
}

export default TaskCard;