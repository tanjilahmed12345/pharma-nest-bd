import { ISettingsRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { StoreSettings } from '@/types';
import { seedSettings } from '@/lib/mock/seeds/settings';

export const localSettingsRepository: ISettingsRepository = {
  async getSettings(): Promise<StoreSettings> {
    return storage.get<StoreSettings>(STORAGE_KEYS.SETTINGS) || seedSettings;
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = storage.get<StoreSettings>(STORAGE_KEYS.SETTINGS) || seedSettings;
    const updated = { ...current, ...data };
    storage.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },
};
