import { userRepository } from '@/repositories';
import { PublicUser, User, UserRole } from '@/types';

export const userService = {
  getUsers(): Promise<PublicUser[]> {
    return userRepository.getAll();
  },

  getUserById(id: string): Promise<PublicUser | null> {
    return userRepository.getById(id);
  },

  updateUser(id: string, data: Partial<User>): Promise<PublicUser> {
    return userRepository.update(id, data);
  },

  /**
   * Get only customer accounts (exclude admins).
   */
  async getCustomers(): Promise<PublicUser[]> {
    const users = await userRepository.getAll();
    return users.filter((u) => u.role === UserRole.CUSTOMER);
  },
};
