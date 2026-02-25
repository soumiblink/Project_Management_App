import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/auth';
import { emitToProject } from '@/lib/socket';

const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const project = await Project.findById(task.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isAuthorized =
      project.owner === decoded.userId ||
      project.members.some((member: any) => member.userId === decoded.userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const taskObj = task.toObject();

    if (task.assignedTo) {
      const assignedUser = await User.findById(task.assignedTo).select('-password');
      taskObj.assignedToUser = assignedUser?.toObject();
    }

    const createdByUser = await User.findById(task.createdBy).select('-password');
    taskObj.createdByUser = createdByUser?.toObject();

    return NextResponse.json({ task: taskObj });
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const project = await Project.findById(task.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isAuthorized =
      project.owner === decoded.userId ||
      project.members.some((member: any) => member.userId === decoded.userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateTaskSchema.parse(body);

    const updateData: any = { ...validatedData };
    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate);
    }

    const oldAssignedTo = task.assignedTo;
    const newAssignedTo = validatedData.assignedTo;

    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const taskObj = updatedTask.toObject();

    if (updatedTask.assignedTo) {
      const assignedUser = await User.findById(updatedTask.assignedTo).select('-password');
      taskObj.assignedToUser = assignedUser?.toObject();
    }

    const createdByUser = await User.findById(updatedTask.createdBy).select('-password');
    taskObj.createdByUser = createdByUser?.toObject();

    if (newAssignedTo && oldAssignedTo !== newAssignedTo) {
      const { createNotification } = await import('@/lib/notifications');
      await createNotification(
        newAssignedTo,
        'task_assigned',
        '📋 New Task Assigned',
        `You have been assigned to task: ${updatedTask.title}`,
        `/projects/${task.projectId}`
      );
    }

    if (validatedData.status === 'done' && task.status !== 'done') {
      if (updatedTask.assignedTo) {
        const { createNotification } = await import('@/lib/notifications');
        await createNotification(
          updatedTask.assignedTo,
          'task_completed',
          '✅ Task Completed',
          `Task "${updatedTask.title}" has been marked as completed`,
          `/projects/${task.projectId}`
        );
      }
    }

    try {
      emitToProject(task.projectId, 'task-updated', taskObj);
    } catch (socketError) {
      console.log('Socket emit failed:', socketError);
    }

    return NextResponse.json({ task: taskObj });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const project = await Project.findById(task.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isAuthorized =
      project.owner === decoded.userId ||
      task.createdBy === decoded.userId;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Task.findByIdAndDelete(params.id);

    try {
      emitToProject(task.projectId, 'task-deleted', { taskId: params.id });
    } catch (socketError) {
      console.log('Socket emit failed:', socketError);
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
