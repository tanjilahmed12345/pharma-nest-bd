import { settingsRepository } from '@/repositories';
import { StoreSettings } from '@/types';

export const settingsService = {
  getSettings(): Promise<StoreSettings> {
    return settingsRepository.getSettings();
  },

  updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    return settingsRepository.updateSettings(data);
  },
};
