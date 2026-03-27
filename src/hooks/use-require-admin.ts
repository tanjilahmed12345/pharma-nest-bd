'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

/**
 * Redirects to / if the user is not an admin.
 * Returns the current session if admin.
 */
export function useRequireAdmin() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  return { session, isAdmin, isLoading };
}
