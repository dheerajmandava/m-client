import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const auth = getAuth(request);
  
  try {
    if (!auth.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const token = await auth.getToken();
    if (!token) {
      return NextResponse.json({ error: 'No token available' }, { status: 401 });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Auth token error:', error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
} 