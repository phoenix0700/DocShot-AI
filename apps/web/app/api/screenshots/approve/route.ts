import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createSupabaseClient } from '@docshot/database';

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { screenshotId, action } = await request.json();
    
    if (!screenshotId || !action) {
      return NextResponse.json({ error: 'Screenshot ID and action required' }, { status: 400 });
    }

    // Map approval actions to database status values
    let newStatus: string;
    switch (action) {
      case 'approved':
        newStatus = 'captured';
        break;
      case 'rejected':
        newStatus = 'failed';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { error } = await supabase
      .from('screenshots')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', screenshotId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Screenshot ${action} successfully`,
      status: newStatus 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}