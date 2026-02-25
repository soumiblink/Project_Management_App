export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignedTo?: string;
  createdBy: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskWithDetails extends ITask {
  assignedToUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdByUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}
