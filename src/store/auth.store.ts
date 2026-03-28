import { create } from 'zustand';
import { AuthSession, UserRole } from '@/types';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';

interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setSession: (session: AuthSession | null) => void;
  loadSession: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,

  setSession: (session) => {
    if (session) {
      storage.set(STORAGE_KEYS.CURRENT_SESSION, session);
    } else {
      storage.remove(STORAGE_KEYS.CURRENT_SESSION);
    }
    set({
      session,
      isAuthenticated: !!session,
      isAdmin: session?.role === UserRole.ADMIN,
      isLoading: false,
    });
  },

  loadSession: () => {
    // First, hydrate from localStorage for instant UI
    const cached = storage.get<AuthSession>(STORAGE_KEYS.CURRENT_SESSION);
    if (cached) {
      set({
        session: cached,
        isAuthenticated: true,
        isAdmin: cached.role === UserRole.ADMIN,
        isLoading: false,
      });
    }

    // Then verify with the server via /api/auth/me
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data) {
          const user = json.data;
          const session: AuthSession = {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            token: '',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
          storage.set(STORAGE_KEYS.CURRENT_SESSION, session);
          set({
            session,
            isAuthenticated: true,
            isAdmin: user.role === UserRole.ADMIN,
            isLoading: false,
          });
        } else {
          // Server says not authenticated - clear local state
          storage.remove(STORAGE_KEYS.CURRENT_SESSION);
          set({
            session: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      })
      .catch(() => {
        // Network error - keep cached session if available
        if (!cached) {
          set({ isLoading: false });
        }
      });
  },

  logout: () => {
    storage.remove(STORAGE_KEYS.CURRENT_SESSION);
    // Also call the server to clear the cookie
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    set({
      session: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },
}));
