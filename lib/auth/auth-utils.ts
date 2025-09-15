import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import User, { IUser } from "@/lib/models/User";
import { connectDB } from "@/lib/db/mongoose";

/**
 * JWT payload interface
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  type?: string;
  iat?: number;
  exp?: number;
}

/**
 * Auth context for route handlers
 */
export interface AuthContext {
  user: JWTPayload;
  token: string;
}

/**
 * Extract token from request
 */
export async function extractToken(
  request: NextRequest
): Promise<string | null> {
  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookieStore = await cookies();

  // Try access-token cookie first
  const accessTokenCookie = cookieStore.get("access-token");
  if (accessTokenCookie) {
    return accessTokenCookie.value;
  }

  // Fallback to configured session cookie name
  const sessionCookie = cookieStore.get(config.auth.sessionCookieName);
  if (sessionCookie) {
    return sessionCookie.value;
  }

  return null;
}

/**
 * Verify JWT token using jsonwebtoken library
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const secret = config.auth.jwtAccessSecret;
    const payload = jwt.verify(token, secret) as any;

    return {
      userId: payload.userId,
      email: payload.email || "",
      role: payload.role || "member",
      type: payload.type,
      iat: payload.iat,
      exp: payload.exp,
    } as JWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("expired")) {
        throw new AuthenticationError("Token has expired");
      }
      if (error.message.includes("signature")) {
        throw new AuthenticationError("Invalid token signature");
      }
    }
    throw new AuthenticationError("Invalid token");
  }
}

/**
 * Get authenticated user from request
 */
export async function getAuth(request: NextRequest): Promise<AuthContext> {
  const token = await extractToken(request);

  if (!token) {
    throw new AuthenticationError("No authentication token provided");
  }

  const payload = verifyToken(token);

  return {
    user: payload,
    token,
  };
}

/**
 * Verify user has required role
 */
export function requireRole(userRole: string, requiredRoles: string[]): void {
  if (!requiredRoles.includes(userRole)) {
    throw new AuthorizationError(
      `Insufficient permissions. Required role: ${requiredRoles.join(" or ")}`
    );
  }
}

/**
 * Check if user has permission for resource
 */
export function canAccessResource(
  userId: string,
  resourceOwnerId: string,
  userRole: string
): boolean {
  // Owners and admins can access any resource
  if (userRole === "owner" || userRole === "admin") {
    return true;
  }

  // Others can only access their own resources
  return userId === resourceOwnerId;
}

/**
 * Role hierarchy for permission checking
 */
export const ROLE_HIERARCHY = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

/**
 * Check if user role has permission
 */
export function hasPermission(
  userRole: keyof typeof ROLE_HIERARCHY,
  requiredRole: keyof typeof ROLE_HIERARCHY
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
