import { NextResponse } from 'next/server';
import * as apiResponseHelpers from '@/lib/api-response';

/**
 * API Response utility wrapper for backward compatibility
 * Maps the new API response helpers to the expected apiResponse format
 */
export const apiResponse = {
  /**
   * Success response helper
   */
  success<T>(data: T, message?: string, meta?: any): NextResponse {
    // If data is already a NextResponse, return it
    if (data instanceof NextResponse) {
      return data;
    }
    
    // Create success response with optional message
    const response = {
      success: true,
      data,
      ...(message && { message }),
      ...(meta && { meta }),
    };
    
    return NextResponse.json(response, { status: 200 });
  },

  /**
   * Error response helper
   */
  error(message: string, status: number = 500, details?: any): NextResponse {
    const response = {
      success: false,
      error: {
        message,
        code: this.getErrorCode(status),
        ...(details && { details }),
      },
    };
    
    return NextResponse.json(response, { status });
  },

  /**
   * Created response helper
   */
  created<T>(data: T, message?: string): NextResponse {
    const response = {
      success: true,
      data,
      ...(message && { message }),
    };
    
    return NextResponse.json(response, { status: 201 });
  },

  /**
   * No content response
   */
  noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  },

  /**
   * Map status code to error code
   */
  getErrorCode(status: number): string {
    const errorCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };
    
    return errorCodes[status] || 'ERROR';
  },
};

// Also export the original helpers for direct use
export {
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  tooManyRequests,
  serverError,
  serviceUnavailable,
} from '@/lib/api-response';