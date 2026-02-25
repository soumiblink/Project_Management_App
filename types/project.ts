export interface IProject {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  status: 'active' | 'archived' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectWithDetails extends IProject {
  taskCount?: number;
  completedTaskCount?: number;
}
