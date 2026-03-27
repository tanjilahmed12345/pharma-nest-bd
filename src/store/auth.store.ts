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
    const session = storage.get<AuthSession>(STORAGE_KEYS.CURRENT_SESSION);
    set({
      session,
      isAuthenticated: !!session,
      isAdmin: session?.role === UserRole.ADMIN,
      isLoading: false,
    });
  },

  logout: () => {
    storage.remove(STORAGE_KEYS.CURRENT_SESSION);
    set({
      session: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },
}));
