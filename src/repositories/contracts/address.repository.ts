import { Address } from '@/types';

export interface IAddressRepository {
  getAll(userId: string): Promise<Address[]>;
  getById(id: string): Promise<Address | null>;
  getDefault(userId: string): Promise<Address | null>;
  create(address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address>;
  update(id: string, data: Partial<Address>): Promise<Address>;
  delete(id: string): Promise<void>;
  setDefault(userId: string, addressId: string): Promise<void>;
}
