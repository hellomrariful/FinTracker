'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { mockAuth, type MockUser } from '@/lib/auth/mock-auth';
import { getUserProfile } from '@/lib/supabase/auth';

// Flag to enable/disable mock auth - set to true for deployment
const USE_MOCK_AUTH = true;

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | MockUser | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      // Mock auth implementation
      const getInitialSession = async () => {
        try {
          const { data: { session } } = await mockAuth.getSession();
          
          if (session?.user) {
            const profile = await getUserProfile(session.user.id);
            setAuthState({
              user: session.user,
              profile,
              loading: false,
              error: null
            });
          } else {
            setAuthState({
              user: null,
              profile: null,
              loading: false,
              error: null
            });
          }
        } catch (error) {
          setAuthState(prev => ({ 
            ...prev, 
            error: error instanceof Error ? error.message : 'An error occurred',
            loading: false 
          }));
        }
      };

      getInitialSession();

      // Listen for auth changes
      const { data: { subscription } } = mockAuth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const profile = await getUserProfile(session.user.id);
            setAuthState({
              user: session.user,
              profile,
              loading: false,
              error: null
            });
          } else {
            setAuthState({
              user: null,
              profile: null,
              loading: false,
              error: null
            });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Fallback when Supabase is disabled
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: 'Supabase auth disabled'
      });
    }
  }, []);

  return authState;
}