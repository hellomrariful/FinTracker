"use client";

import { useEffect, useState } from "react";
import { User, UserProfile } from "@/lib/types/auth";
import { getCurrentUser, getUserProfile } from "@/lib/auth/auth";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
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
        // Use the actual API to get current user
        const user = await getCurrentUser();

        if (user) {
          const profileResponse = await getUserProfile(user.id);

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

    // Re-check auth state when window focuses (handles cross-tab sessions)
    const handleFocus = () => {
      getInitialSession();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return authState;
}
