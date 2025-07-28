
// This allows any credentials to work, especially demo credentials

export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    company: string;
    role: string;
  };
}

export interface MockAuthResponse {
  user: MockUser | null;
  error: { message: string } | null;
}

// Mock user data
const DEMO_USER: MockUser = {
  id: 'demo-user-id-12345',
  email: 'demo@fintracker.com',
  user_metadata: {
    full_name: 'Demo User',
    company: 'Fintracker Demo',
    role: 'owner'
  }
};

// Store current user in localStorage for persistence
const AUTH_STORAGE_KEY = 'fintracker_mock_auth_user';

export class MockAuth {
  private static instance: MockAuth;
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  constructor() {
    // Load user from localStorage on initialization (only in browser)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          this.currentUser = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to parse stored auth user');
      }
    }
  }

  static getInstance(): MockAuth {
    if (!MockAuth.instance) {
      MockAuth.instance = new MockAuth();
    }
    return MockAuth.instance;
  }

  // Mock sign in - accepts any credentials
  async signIn(email: string, password: string): Promise<MockAuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo credentials, return demo user
    if (email === 'demo@fintracker.com' && password === 'fintracker123') {
      this.setCurrentUser(DEMO_USER);
      return { user: DEMO_USER, error: null };
    }

    // For any other credentials, create a generic user
    const genericUser: MockUser = {
      id: `user-${Date.now()}`,
      email: email,
      user_metadata: {
        full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        company: 'Your Company',
        role: 'owner'
      }
    };

    this.setCurrentUser(genericUser);
    return { user: genericUser, error: null };
  }

  // Mock sign up - accepts any data
  async signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company: string;
  }): Promise<MockAuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      user_metadata: {
        full_name: `${data.firstName} ${data.lastName}`,
        company: data.company,
        role: 'owner'
      }
    };

    this.setCurrentUser(newUser);
    return { user: newUser, error: null };
  }

  // Mock sign out
  async signOut(): Promise<{ error: null }> {
    this.setCurrentUser(null);
    return { error: null };
  }

  // Get current user
  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  // Get current session
  async getSession(): Promise<{ data: { session: { user: MockUser } | null } }> {
    return {
      data: {
        session: this.currentUser ? { user: this.currentUser } : null
      }
    };
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (event: string, session: { user: MockUser } | null) => void) {
    const listener = (user: MockUser | null) => {
      callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
    };
    
    this.listeners.push(listener);

    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          }
        }
      }
    };
  }

  private setCurrentUser(user: MockUser | null) {
    this.currentUser = user;
    
    // Store in localStorage (only in browser)
    if (typeof window !== 'undefined') {
      try {
        if (user) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (e) {
        console.warn('Failed to store auth user');
      }
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(user));
  }
}

// Export singleton instance
export const mockAuth = MockAuth.getInstance();