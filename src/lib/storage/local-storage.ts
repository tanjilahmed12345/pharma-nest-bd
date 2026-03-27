/**
 * Centralized localStorage wrapper.
 * All localStorage access should go through this module.
 * When backend is ready, only the repository layer needs to change.
 */

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export const storage = {
  get<T>(key: string): T | null {
    if (!isClient()) return null;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      console.warn(`Failed to parse localStorage key: ${key}`);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to set localStorage key: ${key}`, e);
    }
  },

  remove(key: string): void {
    if (!isClient()) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isClient()) return;
    localStorage.clear();
  },

  has(key: string): boolean {
    if (!isClient()) return false;
    return localStorage.getItem(key) !== null;
  },
};
