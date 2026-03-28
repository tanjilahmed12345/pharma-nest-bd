import { User, UserRole } from '@/types';

export const seedUsers: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@pharmanestbd.com',
    password: 'Admin@2026',
    name: 'Pharmacy Admin',
    phone: '01963812345',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'user-cust-1',
    email: 'rahim@gmail.com',
    password: 'Rahim@2026',
    name: 'Abdur Rahim',
    phone: '01712345678',
    role: UserRole.CUSTOMER,
    isActive: true,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'user-cust-2',
    email: 'fatema@gmail.com',
    password: 'Fatema@2026',
    name: 'Fatema Begum',
    phone: '01898765432',
    role: UserRole.CUSTOMER,
    isActive: true,
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
  },
];
