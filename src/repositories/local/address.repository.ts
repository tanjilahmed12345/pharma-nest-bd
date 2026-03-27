import { IAddressRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Address } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';

export const localAddressRepository: IAddressRepository = {
  async getAll(userId: string): Promise<Address[]> {
    const addresses = storage.get<Address[]>(STORAGE_KEYS.ADDRESSES) || [];
    return addresses.filter((a) => a.userId === userId);
  },

  async getById(id: string): Promise<Address | null> {
    const addresses = storage.get<Address[]>(STORAGE_KEYS.ADDRESSES) || [];
    return addresses.find((a) => a.id === id) || null;
  },

  async getDefault(userId: string): Promise<Address | null> {
    const addresses = storage.get<Address[]>(STORAGE_KEYS.ADDRESSES) || [];
    return addresses.find((a) => a.userId === userId && a.isDefault) || null;
  },

  async create(data): Promise<Address> {
    const addresses = storage.get<Address[]>(STORAGE_KEYS.ADDRESSES) || [];
    const address: Address = {
      ...data,
      id: `addr-${generateId()}`,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };

    if (address.isDefault) {
      addresses.forEach((a) => {
        if (a.userId === data.userId) a.isDefault = false;
      });
    }

    addresses.push(address);
    storage.set(STORAGE_KEYS.ADDRESSES, addresses);
    return address;
  },

  async update(id, data): Promise<Address> {
    const addresses = storage.get<Address[]>(STORAGE_KEYS.ADDRESSES) || [];
    const idx = addresses.findIndex((a) => a.id === id);
    if (idx === -1) throw AppError.notFound('Address');
    addresses[idx] = { ...addresses[idx], ...data, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.ADDRESSES, addresses);
    return addresses[idx];
  },

  async delete(id): Promise<void> {
    const addresses = storage.get<Address[]>(STORAGE_KEYS.ADDRESSES) || [];
    storage.set(
      STORAGE_KEYS.ADDRESSES,
      addresses.filter((a) => a.id !== id)
    );
  },

  async setDefault(userId, addressId): Promise<void> {
    const addresses = storage.get<Address[]>(STORAGE_KEYS.ADDRESSES) || [];
    addresses.forEach((a) => {
      if (a.userId === userId) {
        a.isDefault = a.id === addressId;
      }
    });
    storage.set(STORAGE_KEYS.ADDRESSES, addresses);
  },
};
