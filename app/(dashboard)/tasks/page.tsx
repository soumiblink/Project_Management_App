'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import KanbanBoard from '@/components/task/KanbanBoard';
import TaskForm from '@/components/task/TaskForm';
import axiosInstance from '@/lib/axios';
import { ITask, ITaskWithDetails, TaskStatus } from '@/types/task';
import { IProject } from '@/types/project';
import { useTaskStore } from '@/store/taskStore';
import { useSocket } from '@/hooks/useSocket';

export default function TasksPage() {
  const { tasks, setTasks, addTask, updateTask, deleteTask, moveTask } = useTaskStore();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('task-created', (task: ITaskWithDetails) => {
      addTask(task);
    });

    socket.on('task-updated', (task: ITaskWithDetails) => {
      updateTask(task._id, task);
    });

    socket.on('task-deleted', ({ taskId }: { taskId: string }) => {
      deleteTask(taskId);
    });

    return () => {
      socket.off('task-created');
      socket.off('task-updated');
      socket.off('task-deleted');
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axiosInstance.get('/api/tasks'),
        axiosInstance.get('/api/projects'),
      ]);
      setTasks(tasksRes.data.tasks);
      setProjects(projectsRes.data.projects);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateTask = async (data: Partial<ITask>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/api/tasks', data);
      addTask(response.data.task);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (data: Partial<ITask>) => {
    if (!selectedTask) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/api/tasks/${selectedTask._id}`, data);
      updateTask(selectedTask._id, response.data.task);
      setIsFormOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
      deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      moveTask(taskId, newStatus);
      await axiosInstance.put(`/api/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error('Error moving task:', error);
      fetchData();
    }
  };

  const handleEditClick = (task: ITaskWithDetails) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Tasks</h1>
          <p className="text-slate-400 mt-1">
            Manage your tasks with Kanban board
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/50">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <KanbanBoard
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onEditTask={handleEditClick}
        onDeleteTask={handleDeleteTask}
      />

      <TaskForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        projects={projects}
        isLoading={isLoading}
      />
    </div>
  );
}
