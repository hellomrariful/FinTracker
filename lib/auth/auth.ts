import { User, AuthError, AuthResponse, UserProfile } from "@/lib/types/auth";

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function signUp(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        user: null,
        error: { message: result.error || 'Signup failed' },
      };
    }

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`,
        avatar: result.user.avatar,
        created_at: result.user.createdAt,
      },
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        user: null,
        error: { message: result.error || 'Signin failed' },
      };
    }

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`,
        avatar: result.user.avatar,
        created_at: result.user.createdAt,
      },
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const response = await fetch(`${API_URL}/api/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: { message: result.error || 'Signout failed' } };
    }

    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return {
      id: result.user.id,
      email: result.user.email,
      name: `${result.user.firstName} ${result.user.lastName}`,
      avatar: result.user.avatar,
      created_at: result.user.createdAt,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserProfile(
  userId?: string
): Promise<{ data: UserProfile | null; error: AuthError | null }> {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return { data: null, error: { message: result.error || 'Failed to get profile' } };
    }

    const result = await response.json();
    return {
      data: {
        id: result.user.id,
        user_id: result.user.id,
        name: `${result.user.firstName} ${result.user.lastName}`,
        email: result.user.email,
        avatar: result.user.avatar,
        role: result.user.role,
        created_at: result.user.createdAt,
        updated_at: result.user.updatedAt || result.user.createdAt,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<{ data: UserProfile | null; error: AuthError | null }> {
  try {
    // If there's a profile API, call it; otherwise, fall back to returning current profile merged locally
    const current = await getUserProfile();
    if (current.error) return current;

    const merged: UserProfile = {
      ...(current.data as UserProfile),
      ...updates,
      // Keep id fields intact
      id: current.data!.id,
      user_id: current.data!.user_id,
      updated_at: new Date().toISOString(),
    };

    return { data: merged, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function resetPassword(
  email: string
): Promise<{ error: AuthError | null }> {
  try {
    // Mock implementation - just return success
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function updatePassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  try {
    // Mock implementation - just return success
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
