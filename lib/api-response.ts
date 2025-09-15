import { NextResponse } from 'next/server';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Success response helper (200 OK)
 */
export function ok<T>(data: T, meta?: ApiResponse['meta']): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  }, { status: 200 });
}

/**
 * Created response helper (201 Created)
 */
export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  }, { status: 201 });
}

/**
 * No content response (204 No Content)
 */
export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Bad request response (400 Bad Request)
 */
export function badRequest(
  message: string, 
  details?: any,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: code || 'BAD_REQUEST',
      details,
    },
  }, { status: 400 });
}

/**
 * Unauthorized response (401 Unauthorized)
 */
export function unauthorized(
  message = 'Unauthorized'
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'UNAUTHORIZED',
    },
  }, { status: 401 });
}

/**
 * Forbidden response (403 Forbidden)
 */
export function forbidden(
  message = 'Forbidden'
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'FORBIDDEN',
    },
  }, { status: 403 });
}

/**
 * Not found response (404 Not Found)
 */
export function notFound(
  message = 'Resource not found'
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'NOT_FOUND',
    },
  }, { status: 404 });
}

/**
 * Conflict response (409 Conflict)
 */
export function conflict(
  message: string,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'CONFLICT',
      details,
    },
  }, { status: 409 });
}

/**
 * Unprocessable entity response (422 Unprocessable Entity)
 */
export function unprocessableEntity(
  message: string,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'UNPROCESSABLE_ENTITY',
      details,
    },
  }, { status: 422 });
}

/**
 * Too many requests response (429 Too Many Requests)
 */
export function tooManyRequests(
  message = 'Too many requests',
  retryAfter?: number
): NextResponse<ApiResponse> {
  const headers: HeadersInit = {};
  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString();
  }
  
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'TOO_MANY_REQUESTS',
      details: retryAfter ? { retryAfter } : undefined,
    },
  }, { status: 429, headers });
}

/**
 * Internal server error response (500 Internal Server Error)
 */
export function serverError(
  message = 'Internal server error',
  details?: any
): NextResponse<ApiResponse> {
  // Log the error details server-side but don't expose to client
  if (details) {
    console.error('Server error:', details);
  }
  
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_SERVER_ERROR',
      // Only include details in development
      details: process.env.NODE_ENV === 'development' ? details : undefined,
    },
  }, { status: 500 });
}

/**
 * Service unavailable response (503 Service Unavailable)
 */
export function serviceUnavailable(
  message = 'Service temporarily unavailable',
  retryAfter?: number
): NextResponse<ApiResponse> {
  const headers: HeadersInit = {};
  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString();
  }
  
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: 'SERVICE_UNAVAILABLE',
      details: retryAfter ? { retryAfter } : undefined,
    },
  }, { status: 503, headers });
}

/**
 * Helper to create paginated response
 */
export function paginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiResponse<T[]>> {
  const totalPages = Math.ceil(total / limit);
  
  return ok(data, {
    page,
    limit,
    total,
    totalPages,
  });
}