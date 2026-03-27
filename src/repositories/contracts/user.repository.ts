import { PublicUser, User } from '@/types';

export interface IUserRepository {
  getAll(): Promise<PublicUser[]>;
  getById(id: string): Promise<PublicUser | null>;
  update(id: string, data: Partial<User>): Promise<PublicUser>;
}
