import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_KEY?.substring(0, 20) + '...',
    nodeEnv: process.env.NODE_ENV,
  });
}