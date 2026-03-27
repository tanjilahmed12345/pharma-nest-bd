import { IWishlistRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { WishlistMap } from '@/types';

function getMap(): WishlistMap {
  return storage.get<WishlistMap>(STORAGE_KEYS.WISHLIST) || {};
}

function save(map: WishlistMap): void {
  storage.set(STORAGE_KEYS.WISHLIST, map);
}

export const localWishlistRepository: IWishlistRepository = {
  async getWishlist(userId: string): Promise<string[]> {
    const map = getMap();
    return map[userId] || [];
  },

  async addItem(userId: string, productId: string): Promise<string[]> {
    const map = getMap();
    const list = map[userId] || [];
    if (!list.includes(productId)) {
      list.push(productId);
    }
    map[userId] = list;
    save(map);
    return list;
  },

  async removeItem(userId: string, productId: string): Promise<string[]> {
    const map = getMap();
    const list = (map[userId] || []).filter((id) => id !== productId);
    map[userId] = list;
    save(map);
    return list;
  },

  async hasItem(userId: string, productId: string): Promise<boolean> {
    const map = getMap();
    return (map[userId] || []).includes(productId);
  },

  async clearWishlist(userId: string): Promise<void> {
    const map = getMap();
    delete map[userId];
    save(map);
  },
};
