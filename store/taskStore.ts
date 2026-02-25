import { create } from 'zustand';
import { ITask, ITaskWithDetails } from '@/types/task';

interface TaskState {
  tasks: ITaskWithDetails[];
  setTasks: (tasks: ITaskWithDetails[]) => void;
  addTask: (task: ITaskWithDetails) => void;
  updateTask: (taskId: string, updates: Partial<ITaskWithDetails>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: ITask['status']) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === taskId ? { ...t, ...updates } : t)),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    })),
  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ),
    })),
}));
