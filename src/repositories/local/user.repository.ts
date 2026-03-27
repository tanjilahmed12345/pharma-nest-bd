import { IUserRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { User, PublicUser } from '@/types';
import { nowISO } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';

function toPublic(user: User): PublicUser {
  const { password, ...rest } = user;
  return rest;
}

export const localUserRepository: IUserRepository = {
  async getAll(): Promise<PublicUser[]> {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    return users.map(toPublic);
  },

  async getById(id: string): Promise<PublicUser | null> {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const user = users.find((u) => u.id === id);
    return user ? toPublic(user) : null;
  },

  async update(id, data): Promise<PublicUser> {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw AppError.notFound('User');
    users[idx] = { ...users[idx], ...data, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.USERS, users);
    return toPublic(users[idx]);
  },
};
