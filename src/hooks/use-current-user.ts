'use client';

import { useAuthStore } from '@/store/auth.store';
import { AuthSession, UserRole } from '@/types';

interface CurrentUser {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userId: string | null;
  userName: string | null;
  userRole: UserRole | null;
}

export function useCurrentUser(): CurrentUser {
  const session = useAuthStore((s) => s.session);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isLoading = useAuthStore((s) => s.isLoading);

  return {
    session,
    isAuthenticated,
    isAdmin,
    isLoading,
    userId: session?.userId ?? null,
    userName: session?.name ?? null,
    userRole: session?.role ?? null,
  };
}
