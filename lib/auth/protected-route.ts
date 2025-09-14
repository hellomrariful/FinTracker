import { NextRequest, NextResponse } from 'next/server';
import { getAuth, requireRole, AuthContext } from './auth-utils';
import { withErrorHandling, ApiHandler } from '@/lib/api-middleware';
import * as apiResponse from '@/lib/api-response';

/**
 * Protected route handler with auth context
 */
export type ProtectedApiHandler = (
  request: NextRequest,
  context: { auth: AuthContext; params?: any }
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap API route with authentication
 */
export function withAuth(
  handler: ProtectedApiHandler,
  options?: {
    roles?: string[];
    optional?: boolean;
  }
): ApiHandler {
  return withErrorHandling(async (request: NextRequest, context?: any) => {
    try {
      // Get authentication
      const auth = await getAuth(request);
      
      // Check roles if specified
      if (options?.roles && options.roles.length > 0) {
        requireRole(auth.user.role, options.roles);
      }
      
      // Call handler with auth context
      return await handler(request, {
        auth,
        params: context?.params,
      });
    } catch (error) {
      // If auth is optional and failed, continue without auth
      if (options?.optional) {
        return await handler(request, {
          auth: null as any,
          params: context?.params,
        });
      }
      
      throw error;
    }
  });
}

/**
 * Require owner role
 */
export function ownerOnly(handler: ProtectedApiHandler): ApiHandler {
  return withAuth(handler, { roles: ['owner'] });
}

/**
 * Require admin or owner role
 */
export function adminOnly(handler: ProtectedApiHandler): ApiHandler {
  return withAuth(handler, { roles: ['owner', 'admin'] });
}

/**
 * Require manager, admin, or owner role
 */
export function managerOnly(handler: ProtectedApiHandler): ApiHandler {
  return withAuth(handler, { roles: ['owner', 'admin', 'manager'] });
}

/**
 * Optional authentication (public routes that may have auth)
 */
export function optionalAuth(handler: ProtectedApiHandler): ApiHandler {
  return withAuth(handler, { optional: true });
}