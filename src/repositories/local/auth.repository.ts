import { IAuthRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { User, PublicUser, LoginPayload, RegisterPayload, AuthSession, UserRole } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';

function toPublicUser(user: User): PublicUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

export const localAuthRepository: IAuthRepository = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const user = users.find(
      (u) => u.email === payload.email && u.password === payload.password
    );

    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Account is deactivated');
    }

    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: `mock-token-${generateId()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return session;
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];

    if (users.some((u) => u.email === payload.email)) {
      throw AppError.conflict('Email already registered');
    }

    const newUser: User = {
      id: `user-${generateId()}`,
      email: payload.email,
      password: payload.password,
      name: payload.name,
      phone: payload.phone,
      role: UserRole.CUSTOMER,
      isActive: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };

    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);

    const session: AuthSession = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      token: `mock-token-${generateId()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return session;
  },

  async logout(): Promise<void> {
    storage.remove(STORAGE_KEYS.CURRENT_SESSION);
  },

  async getCurrentUser(): Promise<PublicUser | null> {
    const session = storage.get<AuthSession>(STORAGE_KEYS.CURRENT_SESSION);
    if (!session) return null;

    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const user = users.find((u) => u.id === session.userId);
    return user ? toPublicUser(user) : null;
  },
};
