import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { checkTaskDeadlines } from '@/lib/notifications';

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, or external service)
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from a trusted source (optional but recommended)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    await checkTaskDeadlines();

    return NextResponse.json({ 
      success: true, 
      message: 'Deadline checks completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
