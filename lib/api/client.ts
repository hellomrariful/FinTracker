/**
 * API Client with automatic authentication handling
 *
 * This client ensures that:
 * - Authentication cookies are always included in requests
 * - Proper headers are set for JSON requests
 * - Errors are properly handled and formatted
 */

export type FetchOptions = RequestInit & {
  retryOn401?: boolean;
};

// Since API is on the same origin in development, we can use relative URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

/**
 * Construct the full URL for a given path
 */
function withBase(input: string | URL): string {
  const path = typeof input === "string" ? input : input.toString();

  // If it's already a full URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // For relative paths, ensure they start with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // In development, we can use relative URLs since Next.js API is on same origin
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

/**
 * Enhanced fetch that includes credentials and handles authentication
 */
export async function apiFetch(
  input: string | URL,
  init: FetchOptions = {}
): Promise<Response> {
  const url = withBase(input);
  const headers = new Headers(init.headers || {});

  // Set default headers
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Only set Content-Type for JSON bodies
  const hasBody = !!init.body;
  if (
    hasBody &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Include credentials (cookies) with the request
  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "include", // This is the key - ensures cookies are sent
    mode: "cors",
  });

  return response;
}

/**
 * Parse JSON response and handle errors
 */
export async function parseJSON<T>(response: Response): Promise<T> {
  const text = await response.text();

  // Handle empty responses
  if (!text) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return {} as T;
  }

  // Parse JSON
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }

  // Handle error responses
  if (!response.ok) {
    const message = data?.message || data?.error || `HTTP ${response.status}`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }

  return data as T;
}

/**
 * Convenience API methods
 */
export const api = {
  /**
   * Raw fetch with authentication
   */
  fetch: apiFetch,

  /**
   * GET request
   */
  get: async <T = unknown>(path: string, init?: FetchOptions): Promise<T> => {
    const response = await apiFetch(path, { ...init, method: "GET" });
    return parseJSON<T>(response);
  },

  /**
   * POST request
   */
  post: async <T = unknown>(
    path: string,
    body?: any,
    init?: FetchOptions
  ): Promise<T> => {
    const response = await apiFetch(path, {
      ...init,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return parseJSON<T>(response);
  },

  /**
   * PUT request
   */
  put: async <T = unknown>(
    path: string,
    body?: any,
    init?: FetchOptions
  ): Promise<T> => {
    const response = await apiFetch(path, {
      ...init,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return parseJSON<T>(response);
  },

  /**
   * PATCH request
   */
  patch: async <T = unknown>(
    path: string,
    body?: any,
    init?: FetchOptions
  ): Promise<T> => {
    const response = await apiFetch(path, {
      ...init,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return parseJSON<T>(response);
  },

  /**
   * DELETE request
   */
  delete: async <T = unknown>(
    path: string,
    init?: FetchOptions
  ): Promise<T> => {
    const response = await apiFetch(path, { ...init, method: "DELETE" });
    return parseJSON<T>(response);
  },
};

export default api;
