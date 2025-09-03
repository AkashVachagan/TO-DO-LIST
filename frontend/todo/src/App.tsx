import { Flex, Spinner, Box, useColorModeValue, HStack, IconButton, useColorMode, Select, FormControl, FormLabel } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
// --- FIX APPLIED HERE ---
import KanbanBoard from './components/KanbanBoard'; // Corrected the import path
import { useState, useEffect } from 'react';
import { fetchTasks, updateTaskStatus, createTask, deleteTask, updateTask } from './api';
import type { TaskRead, TaskCreate } from './schemas';

// ... The rest of the App.tsx file remains exactly the same
function App() {
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('priority');
  
  const { colorMode, toggleColorMode } = useColorMode();

  // Styling hooks
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, blue.100)",
    "linear(to-br, gray.900, blue.900)"
  );
  const switchBg = useColorModeValue('gray.200', 'gray.700');
  const activeSwitchBg = useColorModeValue('blue.500', 'blue.300');
  const activeSwitchColor = useColorModeValue('white', 'gray.800');
  const sortLabelColor = useColorModeValue('gray.600', 'gray.400');
  const sortSelectBg = useColorModeValue('white', 'whiteAlpha.100');
  const sortSelectBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  // Typing animation effect
  useEffect(() => {
    if (!loading) {
      const text = 'Just do it';
      const el = document.getElementById('typing-header');
      if (!el) return;
      el.textContent = '';
      let i = 0;
      const interval = setInterval(() => {
          el.textContent = text.slice(0, i + 1);
          i += 1;
          if (i >= text.length) clearInterval(interval);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Initial data fetch
  useEffect(() => {
    setLoading(true);
    fetchTasks().then(tasks => {
      setTasks(tasks);
      setLoading(false);
    }).catch(console.error);
  }, []);

  // API handler functions
  const handleTaskCreated = async (newTaskData: TaskCreate) => {
    const createdTask = await createTask(newTaskData);
    setTasks(prevTasks => [...prevTasks, createdTask]);
  };
  const handleTaskStatusUpdate = async (taskId: number, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
    setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus as TaskRead['status'] } : task
    ));
  };
  const handleTaskDelete = async (taskId: number) => {
    await deleteTask(taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  const handleTaskUpdate = async (updatedTaskData: TaskRead) => {
    const { id, ...taskPayload } = updatedTaskData;
    const returnedTask = await updateTask(id, taskPayload); 
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === returnedTask.id ? returnedTask : task))
    );
  };

  return (
    <Flex direction="column" minH="100vh" bgGradient={bgGradient}>
      {loading ? (
        <Flex flexGrow={1} justifyContent="center" alignItems="center">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <>
          <Flex w="100%" alignItems="center" justifyContent="space-between" px={4} pt={4} mb={2}>
              <Box w={{ base: '0px', md: '220px' }} />
              <Flex
                  fontSize={{ base: '4xl', md: '5xl' }}
                  fontWeight="extrabold"
                  fontFamily="'Poppins', sans-serif"
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  bgClip="text"
                  py={2}
                  textAlign="center"
              >
                  <span id="typing-header" style={{ display: 'inline-block', whiteSpace: 'pre' }}></span>
                  <span className="blink" style={{ marginLeft: '4px' }}>|</span>
              </Flex>
              <HStack spacing={4} w={{ base: 'auto', md: '220px' }} justifyContent="flex-end">
                  <FormControl maxW="150px">
                      <FormLabel fontSize="xs" mb={0} color={sortLabelColor} fontWeight="medium">Sort by</FormLabel>
                      <Select
                          size="sm"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          bg={sortSelectBg}
                          borderColor={sortSelectBorderColor}
                          borderRadius="md"
                          _focus={{ boxShadow: "outline" }}
                      >
                          <option value="priority">Priority</option>
                          <option value="due_date_asc">Due Date</option>
                          <option value="created_on_desc">Newest</option>
                      </Select>
                  </FormControl>
                  <HStack as="button" onClick={toggleColorMode} aria-label="Toggle color mode" spacing={1} bg={switchBg} p={1} borderRadius="full" _focus={{ outline: "none", boxShadow: "outline" }}>
                      <IconButton aria-label="Light mode" icon={<FaSun />} isRound size="sm" bg={colorMode === 'light' ? activeSwitchBg : 'transparent'} color={colorMode === 'light' ? activeSwitchColor : undefined} pointerEvents="none" />
                      <IconButton aria-label="Dark mode" icon={<FaMoon />} isRound size="sm" bg={colorMode === 'dark' ? activeSwitchBg : 'transparent'} color={colorMode === 'dark' ? activeSwitchColor : undefined} pointerEvents="none" />
                  </HStack>
              </HStack>
          </Flex>
          <KanbanBoard 
            tasks={tasks} 
            onTaskCreated={handleTaskCreated}
            onTaskStatusUpdate={handleTaskStatusUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={handleTaskUpdate}
            sortOrder={sortOrder}
          />
        </>
      )}
    </Flex>
  );
}

export default App;