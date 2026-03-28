import { IAuthRepository } from '@/repositories/contracts';
import { LoginPayload, RegisterPayload, AuthSession, PublicUser, UserRole } from '@/types';
import { AppError } from '@/lib/utils/app-error';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    const status = res.status;
    const message = json.error || 'Request failed';
    if (status === 401) throw AppError.unauthorized(message);
    if (status === 403) throw AppError.forbidden(message);
    if (status === 404) throw AppError.notFound(message);
    if (status === 409) throw AppError.conflict(message);
    throw AppError.badRequest(message);
  }
  return json.data as T;
}

export const apiAuthRepository: IAuthRepository = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<{ user: PublicUser; token: string }>(res);

    return {
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role as UserRole,
      token: data.token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<{ user: PublicUser; token: string }>(res);

    return {
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role as UserRole,
      token: data.token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  },

  async getCurrentUser(): Promise<PublicUser | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`);
      if (!res.ok) return null;
      const json = await res.json();
      if (!json.success) return null;
      return json.data as PublicUser;
    } catch {
      return null;
    }
  },
};
