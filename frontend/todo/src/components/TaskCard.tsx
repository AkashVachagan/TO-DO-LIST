import { Box, Text, IconButton, Flex, useColorModeValue } from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash, FaPen } from 'react-icons/fa';
import type { TaskRead } from '../schemas';
import type React from 'react';

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'red.400';
        case 'medium': return 'yellow.400';
        case 'low': default: return 'green.400';
    }
};

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
    
    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
    };

    const cardBg = task.priority === 'high' 
        ? useColorModeValue('red.100', 'red.100') 
        : task.priority === 'medium' 
        ? useColorModeValue('yellow.100', 'yellow.100') 
        : useColorModeValue('green.100', 'green.100');

    const textColor = "black";
    const dateColor = "blackAlpha.700";

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            cursor="grab"
            transition="box-shadow 0.2s ease"
            _hover={{ boxShadow: 'xl' }}
            p={4}
            borderRadius="md"
            boxShadow="md"
            borderLeft="4px solid"
            borderColor={getPriorityColor(task.priority)}
            bg={cardBg}
            position="relative"
            zIndex={isDragging ? 20 : 10}
        >
            <Flex justifyContent="space-between" alignItems="flex-start">
                <Text fontWeight="600" fontSize="md" color={textColor}>{task.title}</Text>
                <Flex>
                    <IconButton aria-label="Delete task" icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" mr={1} onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(task.id)} />
                    <IconButton aria-label="Edit task" icon={<FaPen />} size="sm" variant="ghost" colorScheme="blue" onPointerDown={(e) => e.stopPropagation()} onClick={() => onEdit(task)} />
                </Flex>
            </Flex>
            <Text fontSize="sm" mt={1} fontWeight="400" color={textColor}>{task.description}</Text>
            {task.due_date ? (
                <Text fontSize="xs" mt={3} fontWeight="500" color={dateColor}>
                    {(() => {
                        const dueDate = new Date(task.due_date);
                        const today = new Date();
                        dueDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        
                        const days = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        
                        if (days < 0) return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
                        if (days === 0) return `Due today`;
                        return `${days} day${days !== 1 ? 's' : ''} left`;
                    })()}
                </Text>
            ) : null}
        </Box>
    );
}

export default TaskCard;