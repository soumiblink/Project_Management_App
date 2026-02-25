import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAccessToken, sanitizeUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Get all users except the current user
    const users = await User.find({ _id: { $ne: decoded.userId } })
      .select('-password')
      .limit(50)
      .sort({ name: 1 });

    const sanitizedUsers = users.map((user) => sanitizeUser(user.toObject()));

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
