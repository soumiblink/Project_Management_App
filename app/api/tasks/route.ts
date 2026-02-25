import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/auth';
import { emitToProject } from '@/lib/socket';
import { createNotification } from '@/lib/notifications';

const taskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Check both Authorization header and cookies
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('accessToken')?.value;
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : cookieToken;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    let query: any = {};

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const isAuthorized =
        project.owner === decoded.userId ||
        project.members.some((member: any) => member.userId === decoded.userId);

      if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      query.projectId = projectId;
    } else {
      const userProjects = await Project.find({
        $or: [
          { owner: decoded.userId }, 
          { 'members.userId': decoded.userId }
        ],
      }).select('_id');

      const projectIds = userProjects.map((p) => p._id.toString());
      query.projectId = { $in: projectIds };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const taskObj = task.toObject();
        
        if (task.assignedTo) {
          const assignedUser = await User.findById(task.assignedTo).select('-password');
          taskObj.assignedToUser = assignedUser?.toObject();
        }

        const createdByUser = await User.findById(task.createdBy).select('-password');
        taskObj.createdByUser = createdByUser?.toObject();

        return taskObj;
      })
    );

    return NextResponse.json({ tasks: tasksWithDetails });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Check both Authorization header and cookies
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('accessToken')?.value;
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : cookieToken;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);

    const body = await req.json();
    const validatedData = taskSchema.parse(body);

    const project = await Project.findById(validatedData.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isAuthorized =
      project.owner === decoded.userId ||
      project.members.some((member: any) => member.userId === decoded.userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const task = await Task.create({
      ...validatedData,
      createdBy: decoded.userId,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
    });

    const taskObj = task.toObject();
    const createdByUser = await User.findById(decoded.userId).select('-password');
    taskObj.createdByUser = createdByUser?.toObject();

    if (validatedData.assignedTo) {
      const assignedUser = await User.findById(validatedData.assignedTo).select('-password');
      taskObj.assignedToUser = assignedUser?.toObject();

      const { createNotification } = await import('@/lib/notifications');
      await createNotification(
        validatedData.assignedTo,
        'task_assigned',
        '📋 New Task Assigned',
        `You have been assigned to task: ${task.title}`,
        `/projects/${validatedData.projectId}`
      );
    }

    try {
      emitToProject(validatedData.projectId, 'task-created', taskObj);
    } catch (socketError) {
      console.log('Socket emit failed (socket may not be initialized):', socketError);
    }

    return NextResponse.json({ task: taskObj }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
