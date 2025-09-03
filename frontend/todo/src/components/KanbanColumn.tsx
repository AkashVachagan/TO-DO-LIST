import { Box, Heading, VStack, IconButton, useColorModeValue, Icon, Flex, Text } from '@chakra-ui/react';
import { FaPlus, FaLightbulb, FaCalendarAlt, FaSyncAlt, FaCheckCircle } from 'react-icons/fa';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import type { TaskRead } from '../schemas';
import type { IconType } from 'react-icons';

const statusIcons: { [key: string]: IconType } = {
    new: FaLightbulb,
    scheduled: FaCalendarAlt,
    in_progress: FaSyncAlt,
    completed: FaCheckCircle,
};

interface KanbanColumnProps {
    title: string;
    tasks: TaskRead[];
    id: string;
    onTaskDelete: (taskId: number) => Promise<void>;
    onEdit: (task: TaskRead) => void;
    activeId?: number | null;
    // --- FIX APPLIED HERE ---
    // The type is now more specific, matching what KanbanBoard provides.
    onAdd?: (status: TaskRead['status']) => void;
}

function KanbanColumn({ title, tasks, id, onTaskDelete, onEdit, activeId, onAdd }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });
    const StatusIcon = statusIcons[id];

    const columnBg = useColorModeValue('white', 'whiteAlpha.100');
    const columnHeaderBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
    const backdropFilter = useColorModeValue('none', 'blur(10px)');
    const borderColor = useColorModeValue('slate.200', 'whiteAlpha.200');
    const titleColor = useColorModeValue('slate.700', 'slate.200');
    const countBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
    const countColor = useColorModeValue('gray.600', 'gray.400');
    const emptyStateColor = useColorModeValue('gray.400', 'gray.500');

    return (
        <Box
            ref={setNodeRef}
            w="300px"
            p={4}
            borderRadius="lg"
            mx={2}
            display="flex"
            flexDirection="column"
            h="100%"
            bg={columnBg}
            backdropFilter={backdropFilter}
            boxShadow="lg"
            borderWidth="1px"
            borderColor={borderColor}
        >
            <Heading
                size="md"
                p={2}
                borderRadius="md"
                mb={4}
                bg={columnHeaderBg}
                textAlign="center"
                color={titleColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
            >
                {StatusIcon && <Icon as={StatusIcon} />}
                <Box as="span">{title.toUpperCase()}</Box>
                <Box as="span" w="26px" h="26px" borderRadius="full" bg={countBg} color={countColor} display="inline-flex" alignItems="center" justifyContent="center" fontSize="sm">
                    {tasks.length}
                </Box>
                {onAdd && (
                    // Add a type assertion to satisfy TypeScript
                    <IconButton aria-label="Add task" icon={<FaPlus />} size="xs" ml="auto" variant="ghost" onClick={() => onAdd(id as TaskRead['status'])} />
                )}
            </Heading>
            <VStack 
                spacing={4} 
                alignItems="stretch" 
                flex={1} 
                overflowY="auto" 
                overflowX="hidden"
            >
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onDelete={onTaskDelete} 
                            onEdit={onEdit}
                            isDragging={activeId === task.id}
                        />
                    ))
                ) : (
                    <Flex
                        justify="center"
                        align="center"
                        h="100%"
                        direction="column"
                        color={emptyStateColor}
                        textAlign="center"
                    >
                        <Text fontSize="sm" fontWeight="medium">This lane is empty.</Text>
                        <Text fontSize="xs">Click the '+' to add a new task!</Text>
                    </Flex>
                )}
            </VStack>
        </Box>
    );
}

export default KanbanColumn;