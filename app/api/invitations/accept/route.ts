import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Invitation from '@/models/Invitation';
import Project from '@/models/Project';
import User from '@/models/User';
import { requireAuth } from '@/lib/rbacMiddleware';
import { logActivity } from '@/lib/activityLogger';

const acceptSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    const body = await req.json();
    const validatedData = acceptSchema.parse(body);

    // Find invitation
    const invitation = await Invitation.findOne({
      token: validatedData.token,
      status: 'pending',
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Get user
    const user = await User.findById(authResult.user!.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if invitation email matches user email
    if (user.email !== invitation.email) {
      return NextResponse.json(
        { error: 'This invitation was sent to a different email address' },
        { status: 403 }
      );
    }

    // Get project
    const project = await Project.findById(invitation.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is already a member
    const isMember = project.members.some(
      (m: any) => m.userId.toString() === user._id.toString()
    );

    if (isMember) {
      invitation.status = 'accepted';
      await invitation.save();
      return NextResponse.json({
        message: 'You are already a member of this project',
        project,
      });
    }

    // Add user to project
    project.members.push({
      userId: user._id.toString(),
      role: invitation.role,
      joinedAt: new Date(),
    } as any);

    await project.save();

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    // Log activity
    await logActivity({
      userId: user._id.toString(),
      action: 'member_joined',
      entityType: 'project',
      entityId: project._id.toString(),
      metadata: {
        role: invitation.role,
        invitedBy: invitation.invitedBy,
      },
    });

    return NextResponse.json({
      message: 'Successfully joined the project',
      project: {
        _id: project._id,
        name: project.name,
        description: project.description,
        role: invitation.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Accept invitation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
