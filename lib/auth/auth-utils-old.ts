import { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";
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
  sessionId?: string;
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
 * Token types
 */
export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_RESET = "password_reset",
}

/**
 * Get JWT secret for token type
 */
function getSecret(type: TokenType): string {
  const secrets = {
    [TokenType.ACCESS]: config.auth.jwtAccessSecret,
    [TokenType.REFRESH]: config.auth.jwtRefreshSecret,
    [TokenType.EMAIL_VERIFICATION]: config.auth.jwtAccessSecret,
    [TokenType.PASSWORD_RESET]: config.auth.jwtAccessSecret,
  };

  const secret = secrets[type];
  if (!secret) {
    throw new Error(`Secret not configured for token type: ${type}`);
  }

  return secret;
}

/**
 * Generate JWT token
 */
export async function generateToken(
  payload: Omit<JWTPayload, "iat" | "exp">,
  type: TokenType = TokenType.ACCESS,
  expiresIn: string | number = "1h"
): Promise<string> {
  const secret = getSecret(type);

  const token = jwt.sign({ ...payload, type }, secret, { expiresIn } as jwt.SignOptions);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(
  token: string,
  type: TokenType = TokenType.ACCESS
): Promise<JWTPayload> {
  try {
    const secret = getSecret(type);
    const payload = jwt.verify(token, secret) as any;

    // Convert the payload to match our JWTPayload interface
    return {
      userId: payload.userId,
      email: payload.email || "",
      role: payload.role || "member",
      sessionId: payload.sessionId,
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

  // Check X-API-Key header (for API key auth)
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    return apiKey;
  }

  // Check cookies - try both access-token and the configured session cookie name
  const cookieStore = await cookies();

  // First try the access-token cookie (used by signin/signout)
  const accessTokenCookie = cookieStore.get("access-token");
  if (accessTokenCookie) {
    return accessTokenCookie.value;
  }

  // Fallback to configured session cookie name for backwards compatibility
  const sessionCookie = cookieStore.get(config.auth.sessionCookieName);
  if (sessionCookie) {
    return sessionCookie.value;
  }

  return null;
}

/**
 * Get authenticated user from request
 */
export async function getAuth(request: NextRequest): Promise<AuthContext> {
  const token = await extractToken(request);

  if (!token) {
    throw new AuthenticationError("No authentication token provided");
  }

  const payload = await verifyToken(token);

  return {
    user: payload,
    token,
  };
}

/**
 * Get authenticated user from request (safe version)
 */
export async function getAuthSafe(
  request: NextRequest
): Promise<AuthContext | null> {
  try {
    return await getAuth(request);
  } catch (error) {
    return null;
  }
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
 * Get user by ID from database
 */
export async function getUserById(userId: string): Promise<IUser | null> {
  await connectDB();
  return User.findById(userId).select("-password");
}

/**
 * Create session tokens for user
 */
export async function createSessionTokens(user: IUser): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const payload: Omit<JWTPayload, "iat" | "exp"> = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    sessionId: crypto.randomUUID(),
  };

  const [accessToken, refreshToken] = await Promise.all([
    generateToken(payload, TokenType.ACCESS, "1h"),
    generateToken(payload, TokenType.REFRESH, "7d"),
  ]);

  return { accessToken, refreshToken };
}

/**
 * Set auth cookies
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken?: string
): Promise<void> {
  const cookieStore = await cookies();

  // Set access token cookie
  cookieStore.set(config.auth.sessionCookieName, accessToken, {
    httpOnly: true,
    secure: config.app.env === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  // Set refresh token cookie if provided
  if (refreshToken) {
    cookieStore.set(`${config.auth.sessionCookieName}-refresh`, refreshToken, {
      httpOnly: true,
      secure: config.app.env === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
  }
}

/**
 * Clear auth cookies
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(config.auth.sessionCookieName);
  cookieStore.delete(`${config.auth.sessionCookieName}-refresh`);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
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
