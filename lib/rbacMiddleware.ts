import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './auth';
import { Permission, hasPermission } from './rbac';
import connectDB from './db';
import User from '@/models/User';
import { UserRole } from '@/types/user';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export async function requireAuth(req: NextRequest) {
  try {
    const token = req.cookies.get('accessToken')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    const decoded = verifyAccessToken(token);
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return { error: 'User not found', status: 401 };
    }

    return {
      user: {
        userId: user._id.toString(),
        email: user.email,
        role: user.role as UserRole,
      },
    };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

export async function requirePermission(req: NextRequest, permission: Permission) {
  const authResult = await requireAuth(req);
  
  if (authResult.error) {
    return authResult;
  }

  const { user } = authResult;
  
  if (!hasPermission(user!.role, permission)) {
    return { error: 'Forbidden: Insufficient permissions', status: 403 };
  }

  return { user };
}

export async function requireAdmin(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (authResult.error) {
    return authResult;
  }

  const { user } = authResult;
  
  if (user!.role !== 'admin') {
    return { error: 'Forbidden: Admin access required', status: 403 };
  }

  return { user };
}

export function createAuthResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}
