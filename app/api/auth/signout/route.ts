import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db/mongodb';
import Session from '@/lib/models/Session';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Get refresh token
    const refreshToken = cookieStore.get('refresh-token')?.value;
    
    if (refreshToken) {
      // Connect to database
      await connectDB();
      
      // Invalidate the session
      await Session.updateOne(
        { refreshToken },
        { isValid: false }
      );
    }
    
    // Clear cookies
    cookieStore.delete('access-token');
    cookieStore.delete('refresh-token');
    
    return NextResponse.json({
      message: 'Signed out successfully'
    });
    
  } catch (error) {
    console.error('Signout error:', error);
    
    // Still clear cookies even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete('access-token');
    cookieStore.delete('refresh-token');
    
    return NextResponse.json({
      message: 'Signed out'
    });
  }
}
