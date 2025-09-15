import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import * as apiResponse from '@/lib/api-response';
import { 
  AppError, 
  zodErrorToMessage, 
  handleMongoError,
  formatErrorForLogging 
} from '@/lib/errors';

/**
 * API route handler type
 */
export type ApiHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap API route handler with error handling
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      // Add request ID for tracing
      const requestId = crypto.randomUUID();
      
      // Log request (in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${requestId}] ${request.method} ${request.url}`);
      }
      
      // Execute handler
      const response = await handler(request, context);
      
      // Add request ID to response headers
      response.headers.set('X-Request-Id', requestId);
      
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse {
  // Log error
  const errorInfo = formatErrorForLogging(error);
  console.error('API Error:', errorInfo);
  
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const { message, details } = zodErrorToMessage(error);
    return apiResponse.badRequest(message, details, 'VALIDATION_ERROR');
  }
  
  // Handle custom app errors
  if (error instanceof AppError) {
    switch (error.statusCode) {
      case 400:
        return apiResponse.badRequest(error.message, error.details, error.code);
      case 401:
        return apiResponse.unauthorized(error.message);
      case 403:
        return apiResponse.forbidden(error.message);
      case 404:
        return apiResponse.notFound(error.message);
      case 409:
        return apiResponse.conflict(error.message, error.details);
      case 422:
        return apiResponse.unprocessableEntity(error.message, error.details);
      case 429:
        return apiResponse.tooManyRequests(
          error.message,
          (error as any).retryAfter
        );
      case 502:
      case 503:
        return apiResponse.serviceUnavailable(error.message);
      default:
        return apiResponse.serverError(error.message, error.details);
    }
  }
  
  // Handle MongoDB errors
  if (error && typeof error === 'object' && 'name' in error) {
    const mongoError = error as any;
    if (
      mongoError.name === 'MongoError' ||
      mongoError.name === 'ValidationError' ||
      mongoError.name === 'CastError' ||
      mongoError.code === 11000
    ) {
      const appError = handleMongoError(mongoError);
      return handleApiError(appError);
    }
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    return apiResponse.serverError(
      'An unexpected error occurred',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
  
  // Handle unknown errors
  return apiResponse.serverError('An unexpected error occurred');
}

/**
 * Validate request body with Zod schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: any
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError('Invalid JSON in request body', 400, 'INVALID_JSON');
    }
    throw error;
  }
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: any
): T {
  const { searchParams } = new URL(request.url);
  const query: Record<string, any> = {};
  
  searchParams.forEach((value, key) => {
    // Handle array parameters (e.g., ?tags=a&tags=b)
    if (query[key]) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  });
  
  return schema.parse(query);
}

/**
 * Parse pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(
  request: NextRequest,
  defaultLimit = 20,
  maxLimit = 100
): PaginationParams {
  const { searchParams } = new URL(request.url);
  
  let page = parseInt(searchParams.get('page') || '1');
  let limit = parseInt(searchParams.get('limit') || String(defaultLimit));
  
  // Validate page
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  
  // Validate limit
  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }
  
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
}

/**
 * Parse sort parameters
 */
export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function parseSort(
  request: NextRequest,
  defaultSort = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc'
): SortParams {
  const { searchParams } = new URL(request.url);
  
  const sortBy = searchParams.get('sortBy') || defaultSort;
  const order = searchParams.get('order') || searchParams.get('sortOrder') || defaultOrder;
  const sortOrder = order === 'asc' ? 'asc' : 'desc';
  
  return { sortBy, sortOrder };
}

/**
 * Parse date range parameters
 */
export interface DateRangeParams {
  startDate?: Date;
  endDate?: Date;
}

export function parseDateRange(request: NextRequest): DateRangeParams {
  const { searchParams } = new URL(request.url);
  
  const params: DateRangeParams = {};
  
  const startDateStr = searchParams.get('startDate') || searchParams.get('from');
  const endDateStr = searchParams.get('endDate') || searchParams.get('to');
  
  if (startDateStr) {
    const date = new Date(startDateStr);
    if (!isNaN(date.getTime())) {
      params.startDate = date;
    }
  }
  
  if (endDateStr) {
    const date = new Date(endDateStr);
    if (!isNaN(date.getTime())) {
      // Set to end of day
      date.setHours(23, 59, 59, 999);
      params.endDate = date;
    }
  }
  
  return params;
}