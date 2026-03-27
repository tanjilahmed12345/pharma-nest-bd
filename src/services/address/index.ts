import { addressRepository } from '@/repositories';
import { Address } from '@/types';
import { AppError } from '@/lib/utils/app-error';

export const addressService = {
  getAddresses(userId: string): Promise<Address[]> {
    return addressRepository.getAll(userId);
  },

  async getAddressById(id: string): Promise<Address> {
    const address = await addressRepository.getById(id);
    if (!address) throw AppError.notFound('Address');
    return address;
  },

  getDefaultAddress(userId: string): Promise<Address | null> {
    return addressRepository.getDefault(userId);
  },

  createAddress(data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    return addressRepository.create(data);
  },

  updateAddress(id: string, data: Partial<Address>): Promise<Address> {
    return addressRepository.update(id, data);
  },

  deleteAddress(id: string): Promise<void> {
    return addressRepository.delete(id);
  },

  setDefaultAddress(userId: string, addressId: string): Promise<void> {
    return addressRepository.setDefault(userId, addressId);
  },
};
