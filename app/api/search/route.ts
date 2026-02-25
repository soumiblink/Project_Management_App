import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import User from '@/models/User';
import { requireAuth } from '@/lib/rbacMiddleware';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'all', 'projects', 'tasks', 'users'
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const searchRegex = new RegExp(query, 'i');
    const results: any = {
      projects: [],
      tasks: [],
      users: [],
    };

    // Search projects (only those user has access to)
    if (!type || type === 'all' || type === 'projects') {
      const projectQuery: any = {
        $or: [
          { name: searchRegex },
          { description: searchRegex },
        ],
      };

      // Filter by user access
      if (authResult.user!.role !== 'admin') {
        projectQuery.$or.push(
          { owner: authResult.user!.userId },
          { 'members.userId': authResult.user!.userId }
        );
      }

      results.projects = await Project.find(projectQuery)
        .select('name description status owner createdAt')
        .populate('owner', 'name email')
        .limit(limit)
        .lean();
    }

    // Search tasks (only in accessible projects)
    if (!type || type === 'all' || type === 'tasks') {
      // Get accessible project IDs
      let accessibleProjectIds: string[] = [];
      
      if (authResult.user!.role === 'admin') {
        const allProjects = await Project.find().select('_id');
        accessibleProjectIds = allProjects.map(p => p._id.toString());
      } else {
        const userProjects = await Project.find({
          $or: [
            { owner: authResult.user!.userId },
            { 'members.userId': authResult.user!.userId },
          ],
        }).select('_id');
        accessibleProjectIds = userProjects.map(p => p._id.toString());
      }

      if (accessibleProjectIds.length > 0) {
        results.tasks = await Task.find({
          projectId: { $in: accessibleProjectIds },
          $or: [
            { title: searchRegex },
            { description: searchRegex },
          ],
        })
          .select('title description status priority projectId assignedTo dueDate createdAt')
          .populate('projectId', 'name')
          .populate('assignedTo', 'name email')
          .limit(limit)
          .lean();
      }
    }

    // Search users (admin only or project members)
    if (!type || type === 'all' || type === 'users') {
      if (authResult.user!.role === 'admin') {
        results.users = await User.find({
          $or: [
            { name: searchRegex },
            { email: searchRegex },
          ],
        })
          .select('name email avatar role createdAt')
          .limit(limit)
          .lean();
      }
    }

    // Calculate total results
    const total =
      results.projects.length +
      results.tasks.length +
      results.users.length;

    return NextResponse.json({
      query,
      total,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
