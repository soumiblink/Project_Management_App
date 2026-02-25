import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ActivityLog from '@/models/ActivityLog';
import { requireAuth } from '@/lib/rbacMiddleware';
import { hasPermission } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Check permission
    if (!hasPermission(authResult.user!.role, 'activity:read')) {
      return NextResponse.json(
        { error: 'You do not have permission to view activity logs' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};
    
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('userId', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
