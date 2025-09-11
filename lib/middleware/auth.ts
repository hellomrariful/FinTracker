import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { cookies } from 'next/headers';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export async function authenticateUser(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return {
        authenticated: false,
        error: 'No access token provided',
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        ),
      };
    }

    const payload = verifyToken(accessToken, 'access');
    if (!payload) {
      return {
        authenticated: false,
        error: 'Invalid or expired token',
        response: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        ),
      };
    }

    // Connect to database and verify user exists
    await connectDB();
    const user = await User.findById(payload.userId).select('_id email role isActive');
    
    if (!user) {
      return {
        authenticated: false,
        error: 'User not found',
        response: NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        ),
      };
    }

    if (!user.isActive) {
      return {
        authenticated: false,
        error: 'Account deactivated',
        response: NextResponse.json(
          { error: 'Your account has been deactivated' },
          { status: 403 }
        ),
      };
    }

    return {
      authenticated: true,
      user: {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authenticated: false,
      error: 'Authentication failed',
      response: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      ),
    };
  }
}

// Helper function to check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

// Helper function to check if user owns the resource
export async function ownsResource(
  userId: string,
  resourceId: string,
  Model: any
): Promise<boolean> {
  try {
    const resource = await Model.findOne({ _id: resourceId, userId });
    return !!resource;
  } catch (error) {
    console.error('Error checking resource ownership:', error);
    return false;
  }
}
