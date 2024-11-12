import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { getToken } = getAuth(request);
  
  try {
    const token = await getToken();
    return NextResponse.json(token);
  } catch (error) {
    console.error('Auth token error:', error);
    return NextResponse.json(null, { status: 401 });
  }
} 