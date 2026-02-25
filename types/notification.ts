export type NotificationType = 'task_assigned' | 'task_updated' | 'project_invite' | 'task_completed' | 'deadline_approaching' | 'deadline_overdue';

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}
