import ActivityLog from '@/models/ActivityLog';

interface LogActivityParams {
  userId: string;
  action: string;
  entityType: 'project' | 'task' | 'user' | 'invitation';
  entityId: string;
  metadata?: Record<string, any>;
}

export async function logActivity(params: LogActivityParams) {
  try {
    await ActivityLog.create({
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata || {},
    });
  } catch (error) {
    console.error('Activity logging error:', error);
    // Don't throw error to prevent breaking the main flow
  }
}

export const ActivityActions = {
  // Project actions
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  PROJECT_ARCHIVED: 'project_archived',
  
  // Task actions
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_STATUS_CHANGED: 'task_status_changed',
  
  // Member actions
  MEMBER_ADDED: 'member_added',
  MEMBER_REMOVED: 'member_removed',
  MEMBER_JOINED: 'member_joined',
  MEMBER_ROLE_CHANGED: 'member_role_changed',
  
  // Invitation actions
  INVITATION_SENT: 'invitation_sent',
  INVITATION_ACCEPTED: 'invitation_accepted',
  INVITATION_EXPIRED: 'invitation_expired',
  
  // User actions
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
} as const;
