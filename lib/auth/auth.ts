import { mockAuth, type MockUser } from "./mock-auth";
import { User, AuthError, AuthResponse, UserProfile } from "@/lib/types/auth";

// Convert MockUser to our User type
function convertMockUserToUser(mockUser: MockUser): User {
  return {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.user_metadata.full_name,
    avatar: undefined, // Can be added later
    created_at: new Date().toISOString(),
  };
}

// Convert MockUser to UserProfile
function convertMockUserToProfile(mockUser: MockUser): UserProfile {
  return {
    id: mockUser.id,
    user_id: mockUser.id,
    name: mockUser.user_metadata.full_name,
    email: mockUser.email,
    avatar: undefined,
    role: mockUser.user_metadata.role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function signUp(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
}): Promise<AuthResponse> {
  try {
    const response = await mockAuth.signUp(data);

    if (response.error) {
      return { user: null, error: response.error };
    }

    if (response.user) {
      return {
        user: convertMockUserToUser(response.user),
        error: null,
      };
    }

    return { user: null, error: { message: "Unknown error occurred" } };
  } catch (error) {
    return {
      user: null,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await mockAuth.signIn(email, password);

    if (response.error) {
      return { user: null, error: response.error };
    }

    if (response.user) {
      return {
        user: convertMockUserToUser(response.user),
        error: null,
      };
    }

    return { user: null, error: { message: "Unknown error occurred" } };
  } catch (error) {
    return {
      user: null,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    await mockAuth.signOut();
    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const mockUser = mockAuth.getCurrentUser();
    return mockUser ? convertMockUserToUser(mockUser) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserProfile(
  userId?: string
): Promise<{ data: UserProfile | null; error: AuthError | null }> {
  try {
    const mockUser = mockAuth.getCurrentUser();

    if (!mockUser) {
      return { data: null, error: { message: "No user found" } };
    }

    return {
      data: convertMockUserToProfile(mockUser),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<{ data: UserProfile | null; error: AuthError | null }> {
  try {
    // For now, just return the current profile since we're using mock data
    const mockUser = mockAuth.getCurrentUser();

    if (!mockUser) {
      return { data: null, error: { message: "No user found" } };
    }

    // In a real implementation, you'd update the user data here
    return {
      data: convertMockUserToProfile(mockUser),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
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
