"use client";

import { useEffect, useState } from "react";
import { User, UserProfile } from "@/lib/types/auth";
import { mockAuth, type MockUser } from "@/lib/auth/mock-auth";
import { getUserProfile } from "@/lib/auth/auth";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Convert MockUser to User type
function convertMockUserToUser(mockUser: MockUser): User {
  return {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.user_metadata.full_name,
    avatar: undefined,
    created_at: new Date().toISOString(),
  };
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await mockAuth.getSession();

        if (session?.user) {
          const user = convertMockUserToUser(session.user);
          const profileResponse = await getUserProfile(session.user.id);

          setAuthState({
            user,
            profile: profileResponse.data,
            loading: false,
            error: profileResponse.error?.message || null,
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = mockAuth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = convertMockUserToUser(session.user);
        const profileResponse = await getUserProfile(session.user.id);

        setAuthState({
          user,
          profile: profileResponse.data,
          loading: false,
          error: profileResponse.error?.message || null,
        });
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
}
