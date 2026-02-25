import Notification from '@/models/Notification';
import { emitToUser } from './socket';
import { NotificationType } from '@/types/notification';

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      read: false,
    });

    // Emit real-time notification via Socket.io
    try {
      emitToUser(userId, 'notification', notification.toObject());
    } catch (socketError) {
      console.log('Socket emit failed (socket may not be initialized):', socketError);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function checkTaskDeadlines() {
  const Task = require('@/models/Task').default;
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  // Find tasks due within 24 hours that haven't been completed
  const upcomingTasks = await Task.find({
    dueDate: { $gte: now, $lte: tomorrow },
    status: { $ne: 'done' },
    assignedTo: { $exists: true, $ne: null },
  });

  for (const task of upcomingTasks) {
    // Check if notification already sent
    const existingNotification = await Notification.findOne({
      userId: task.assignedTo,
      type: 'deadline_approaching',
      link: `/projects/${task.projectId}`,
      createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    });

    if (!existingNotification) {
      await createNotification(
        task.assignedTo,
        'deadline_approaching',
        '⏰ Task Deadline Approaching',
        `Task "${task.title}" is due soon!`,
        `/projects/${task.projectId}`
      );
    }
  }

  // Find overdue tasks
  const overdueTasks = await Task.find({
    dueDate: { $lt: now },
    status: { $ne: 'done' },
    assignedTo: { $exists: true, $ne: null },
  });

  for (const task of overdueTasks) {
    // Check if notification already sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingNotification = await Notification.findOne({
      userId: task.assignedTo,
      type: 'deadline_overdue',
      link: `/projects/${task.projectId}`,
      createdAt: { $gte: today },
    });

    if (!existingNotification) {
      await createNotification(
        task.assignedTo,
        'deadline_overdue',
        '🚨 Task Overdue',
        `Task "${task.title}" is overdue!`,
        `/projects/${task.projectId}`
      );
    }
  }
}
