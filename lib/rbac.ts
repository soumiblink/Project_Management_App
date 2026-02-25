import { UserRole } from '@/types/user';

export type Permission = 
  | 'project:create'
  | 'project:read'
  | 'project:update'
  | 'project:delete'
  | 'task:create'
  | 'task:read'
  | 'task:update'
  | 'task:delete'
  | 'member:invite'
  | 'member:remove'
  | 'role:assign'
  | 'activity:read'
  | 'analytics:read';

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'project:create',
    'project:read',
    'project:update',
    'project:delete',
    'task:create',
    'task:read',
    'task:update',
    'task:delete',
    'member:invite',
    'member:remove',
    'role:assign',
    'activity:read',
    'analytics:read',
  ],
  member: [
    'project:read',
    'task:create',
    'task:read',
    'task:update',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

export function canAccessProject(userRole: UserRole, projectMemberRole?: string): boolean {
  if (userRole === 'admin') return true;
  return projectMemberRole !== undefined;
}

export function canModifyProject(userRole: UserRole, projectMemberRole?: string): boolean {
  if (userRole === 'admin') return true;
  return projectMemberRole === 'admin';
}

export function canDeleteProject(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function canInviteMembers(userRole: UserRole, projectMemberRole?: string): boolean {
  if (userRole === 'admin') return true;
  return projectMemberRole === 'admin';
}

export function canAssignRoles(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function canModifyTask(
  userRole: UserRole,
  taskAssignedTo?: string,
  userId?: string,
  projectMemberRole?: string
): boolean {
  if (userRole === 'admin') return true;
  if (projectMemberRole === 'admin') return true;
  return taskAssignedTo === userId;
}
