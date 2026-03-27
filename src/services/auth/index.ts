import { authRepository } from '@/repositories';
import { LoginPayload, RegisterPayload, AuthSession, PublicUser } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { AppError } from '@/lib/utils/app-error';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const session = await authRepository.login(payload);
    useAuthStore.getState().setSession(session);
    return session;
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const session = await authRepository.register(payload);
    useAuthStore.getState().setSession(session);
    return session;
  },

  async logout(): Promise<void> {
    await authRepository.logout();
    useAuthStore.getState().logout();
  },

  async getCurrentUser(): Promise<PublicUser | null> {
    return authRepository.getCurrentUser();
  },

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  },

  isAdmin(): boolean {
    return useAuthStore.getState().isAdmin;
  },

  getSession(): AuthSession | null {
    return useAuthStore.getState().session;
  },

  requireAuth(): AuthSession {
    const session = useAuthStore.getState().session;
    if (!session) throw AppError.unauthorized();
    return session;
  },

  requireAdmin(): AuthSession {
    const session = useAuthStore.getState().session;
    if (!session) throw AppError.unauthorized();
    if (!useAuthStore.getState().isAdmin) throw AppError.forbidden();
    return session;
  },
};
