import { mockAuth, type MockUser } from '@/lib/auth/mock-auth';
import { AuthError, User } from '@supabase/supabase-js';

// Flag to enable/disable mock auth (set to true to bypass Supabase)
const USE_MOCK_AUTH = true;

export interface AuthResponse {
  user: User | MockUser | null;
  error: AuthError | { message: string } | null;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Sign up with email and password
export async function signUp({ email, password, firstName, lastName, company }: SignUpData): Promise<AuthResponse> {
  if (USE_MOCK_AUTH) {
    return await mockAuth.signUp({ email, password, firstName, lastName, company });
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          company,
          role: 'owner'
        }
      }
    });

    if (error) {
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
  */
  
  return { user: null, error: { message: 'Supabase auth disabled' } };
}

// Sign in with email and password
export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  if (USE_MOCK_AUTH) {
    return await mockAuth.signIn(email, password);
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { user: data.user, error };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
  */
  
  return { user: null, error: { message: 'Supabase auth disabled' } };
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  if (USE_MOCK_AUTH) {
    await mockAuth.signOut();
    return { error: null };
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error: error as AuthError };
  }
  */
  
  return { error: null };
}

// Get current user
export async function getCurrentUser(): Promise<User | MockUser | null> {
  if (USE_MOCK_AUTH) {
    return mockAuth.getCurrentUser();
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  */
  
  return null;
}

// Get user profile (mock version)
export async function getUserProfile(userId: string) {
  if (USE_MOCK_AUTH) {
    const user = mockAuth.getCurrentUser();
    if (user && user.id === userId) {
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        company: user.user_metadata.company,
        role: user.user_metadata.role,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  */
  
  return null;
}

// Update user profile (mock version)
export async function updateUserProfile(userId: string, updates: any) {
  if (USE_MOCK_AUTH) {
    // In mock mode, just return success
    return { data: { ...updates, id: userId }, error: null };
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
  */
  
  return { data: null, error: { message: 'Supabase auth disabled' } };
}

// Reset password (mock version)
export async function resetPassword(email: string) {
  if (USE_MOCK_AUTH) {
    // In mock mode, just return success
    return { error: null };
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    return { error };
  } catch (error) {
    return { error: error as AuthError };
  }
  */
  
  return { error: null };
}

// Update password (mock version)
export async function updatePassword(newPassword: string) {
  if (USE_MOCK_AUTH) {
    // In mock mode, just return success
    return { error: null };
  }

  // Original Supabase implementation (commented out for now)
  /*
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { error };
  } catch (error) {
    return { error: error as AuthError };
  }
  */
  
  return { error: null };
}