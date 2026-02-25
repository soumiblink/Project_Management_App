import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { requireAuth } from '@/lib/rbacMiddleware';
import { canModifyTask } from '@/lib/rbac';
import Project from '@/models/Project';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const taskId = formData.get('taskId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get project to check permissions
    const project = await Project.findById(task.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check permissions
    const userMember = project.members.find(
      (m: any) => m.userId?.toString() === authResult.user!.userId
    ) as { userId: string; role: string; joinedAt: Date } | undefined;

    if (
      !canModifyTask(
        authResult.user!.role,
        task.assignedTo,
        authResult.user!.userId,
        userMember?.role || 'member'
      )
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to upload files to this task' },
        { status: 403 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedFilename}`;
    const filepath = join(uploadsDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update task with attachment
    const attachment = {
      filename: file.name,
      url: `/uploads/${filename}`,
      size: file.size,
      mimeType: file.type,
      uploadedBy: authResult.user!.userId,
      uploadedAt: new Date(),
    };

    (task as any).attachments = (task as any).attachments || [];
    (task as any).attachments.push(attachment);
    await task.save();

    return NextResponse.json({
      message: 'File uploaded successfully',
      attachment,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    const attachmentUrl = searchParams.get('url');

    if (!taskId || !attachmentUrl) {
      return NextResponse.json(
        { error: 'Task ID and attachment URL are required' },
        { status: 400 }
      );
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get project to check permissions
    const project = await Project.findById(task.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check permissions
    const userMember = project.members.find(
      (m: any) => m.userId?.toString() === authResult.user!.userId
    ) as { userId: string; role: string; joinedAt: Date } | undefined;

    if (
      !canModifyTask(
        authResult.user!.role,
        task.assignedTo,
        authResult.user!.userId,
        userMember?.role || 'member'
      )
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to delete files from this task' },
        { status: 403 }
      );
    }

    // Remove attachment from task
    (task as any).attachments = (task as any).attachments?.filter((a: any) => a.url !== attachmentUrl) || [];
    await task.save();

    return NextResponse.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Delete attachment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
