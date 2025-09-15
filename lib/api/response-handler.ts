/**
 * Standardized API Response Handler
 * Ensures consistent data extraction from API responses
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

/**
 * Extract data from API response with consistent handling
 */
export function extractData<T>(response: any): T | null {
  // Handle null/undefined responses
  if (!response) {
    return null;
  }

  // Direct data property (most common pattern)
  if (response.data !== undefined) {
    return response.data as T;
  }

  // Success wrapper pattern
  if (response.success && response.data !== undefined) {
    return response.data as T;
  }

  // Direct response (for simple endpoints)
  if (!response.success && !response.error && !response.message) {
    return response as T;
  }

  // No data found
  return null;
}

/**
 * Extract pagination info from API response
 */
export function extractPagination(response: any) {
  return response?.pagination || response?.data?.pagination || null;
}

/**
 * Check if response is an error
 */
export function isApiError(response: any): boolean {
  return !!(response?.error || response?.success === false);
}

/**
 * Create a standardized error from API response
 */
export function createApiError(response: any): ApiError {
  const error = new Error(
    response?.error || response?.message || 'An unexpected error occurred'
  ) as ApiError;
  
  error.status = response?.status || response?.statusCode;
  error.code = response?.code;
  error.details = response?.details || response?.errors;
  
  return error;
}

/**
 * Safe API call wrapper with error handling
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<any>,
  options?: {
    defaultValue?: T;
    onError?: (error: ApiError) => void;
    retries?: number;
    retryDelay?: number;
  }
): Promise<T | null> {
  const { defaultValue = null, onError, retries = 0, retryDelay = 1000 } = options || {};
  
  let lastError: ApiError | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await apiCall();
      
      if (isApiError(response)) {
        throw createApiError(response);
      }
      
      return extractData<T>(response) || defaultValue;
    } catch (error) {
      lastError = error as ApiError;
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
      
      if (onError) {
        onError(lastError);
      }
      
      console.error('API call failed:', lastError);
    }
  }
  
  return defaultValue;
}

/**
 * Batch API calls with error handling
 */
export async function batchApiCalls<T extends Record<string, any>>(
  calls: Record<string, () => Promise<any>>,
  options?: {
    throwOnError?: boolean;
    parallel?: boolean;
  }
): Promise<T> {
  const { throwOnError = false, parallel = true } = options || {};
  const results: any = {};
  const errors: Record<string, ApiError> = {};
  
  if (parallel) {
    const entries = Object.entries(calls);
    const promises = entries.map(async ([key, call]) => {
      try {
        const response = await call();
        results[key] = extractData(response);
      } catch (error) {
        errors[key] = error as ApiError;
        results[key] = null;
      }
    });
    
    await Promise.all(promises);
  } else {
    for (const [key, call] of Object.entries(calls)) {
      try {
        const response = await call();
        results[key] = extractData(response);
      } catch (error) {
        errors[key] = error as ApiError;
        results[key] = null;
      }
    }
  }
  
  if (throwOnError && Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0];
    throw firstError;
  }
  
  return results as T;
}

/**
 * Transform API data with validation
 */
export function transformApiData<T, R>(
  data: T,
  transformer: (data: T) => R,
  validator?: (data: T) => boolean
): R | null {
  if (!data) {
    return null;
  }
  
  if (validator && !validator(data)) {
    console.warn('Data validation failed:', data);
    return null;
  }
  
  try {
    return transformer(data);
  } catch (error) {
    console.error('Data transformation failed:', error);
    return null;
  }
}

/**
 * Handle API response with loading states
 */
export class ApiStateHandler<T> {
  loading = false;
  data: T | null = null;
  error: ApiError | null = null;
  
  constructor(private defaultValue?: T) {
    this.data = defaultValue || null;
  }
  
  async execute(apiCall: () => Promise<any>): Promise<T | null> {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await apiCall();
      
      if (isApiError(response)) {
        throw createApiError(response);
      }
      
      this.data = extractData<T>(response) || this.defaultValue || null;
      return this.data;
    } catch (error) {
      this.error = error as ApiError;
      this.data = this.defaultValue || null;
      throw error;
    } finally {
      this.loading = false;
    }
  }
  
  reset() {
    this.loading = false;
    this.data = this.defaultValue || null;
    this.error = null;
  }
}