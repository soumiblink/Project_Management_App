import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Invitation from '@/models/Invitation';
import Project from '@/models/Project';
import User from '@/models/User';
import { requireAuth } from '@/lib/rbacMiddleware';
import { canInviteMembers } from '@/lib/rbac';
import { sendInvitationEmail } from '@/lib/email';
import crypto from 'crypto';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  projectId: z.string().min(1, 'Project ID is required'),
  role: z.enum(['admin', 'member']).default('member'),
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    const body = await req.json();
    const validatedData = inviteSchema.parse(body);

    // Check if project exists
    const project = await Project.findById(validatedData.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check permissions
    const userMember = project.members.find(
      (m: any) => m.userId.toString() === authResult.user!.userId
    );
    
    if (!canInviteMembers(authResult.user!.role, userMember?.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to invite members' },
        { status: 403 }
      );
    }

    // Check if user already exists and is a member
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      const isMember = project.members.some(
        (m: any) => m.userId.toString() === existingUser._id.toString()
      );
      if (isMember) {
        return NextResponse.json(
          { error: 'User is already a member of this project' },
          { status: 400 }
        );
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await Invitation.findOne({
      email: validatedData.email,
      projectId: validatedData.projectId,
      status: 'pending',
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email' },
        { status: 400 }
      );
    }

    // Create invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await Invitation.create({
      email: validatedData.email,
      projectId: validatedData.projectId,
      invitedBy: authResult.user!.userId,
      role: validatedData.role,
      token,
      expiresAt,
    });

    // Send invitation email
    await sendInvitationEmail({
      to: validatedData.email,
      projectName: project.name,
      inviterName: authResult.user!.email,
      token,
    });

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: {
        _id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Invitation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    const query: any = {};
    if (projectId) {
      query.projectId = projectId;
    }

    const invitations = await Invitation.find(query)
      .populate('invitedBy', 'name email')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
