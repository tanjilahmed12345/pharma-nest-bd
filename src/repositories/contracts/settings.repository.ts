import { StoreSettings } from '@/types';

export interface ISettingsRepository {
  getSettings(): Promise<StoreSettings>;
  updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings>;
}
