import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { userService } from '../../../../lib/user-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await userService.checkUserPermissions(userId);
    return NextResponse.json(permissions);
  } catch (error: any) {
    console.error('API: Failed to check permissions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check permissions' },
      { status: 500 }
    );
  }
}