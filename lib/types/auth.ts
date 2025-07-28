
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  created_at: string;
  updated_at: string;
}
