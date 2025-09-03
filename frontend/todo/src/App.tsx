import { Flex, Spinner } from '@chakra-ui/react';
import KanbanBoard from './components/KanbanBoard';
import { useState, useEffect } from 'react';
import { fetchTasks, updateTaskStatus, createTask, deleteTask } from './api';
import type { TaskRead, TaskCreate } from './schemas';

function App() {
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch of tasks
  useEffect(() => {
    setLoading(true);
    fetchTasks().then(tasks => {
      setTasks(tasks);
      setLoading(false);
    });
  }, []);

  const handleTaskCreated = (newTask: TaskRead) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskStatusUpdate = async (taskId: number, newStatus: string) => {
    try {
        await updateTaskStatus(taskId, newStatus);
        const updatedTasks = tasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus as TaskRead['status'] } : task
        );
        setTasks(updatedTasks);
    } catch (error) {
        console.error("Failed to update task status:", error);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleTaskUpdate = async (updatedTask: TaskRead) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <>
      {loading ? (
        <Flex minH="100vh" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <KanbanBoard 
          tasks={tasks} 
          onTaskCreated={handleTaskCreated}
          onTaskStatusUpdate={handleTaskStatusUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
}

export default App;