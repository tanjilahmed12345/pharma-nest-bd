import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { SEED_VERSION } from '@/lib/constants';
import {
  seedCategories,
  seedProducts,
  seedUsers,
  seedAddresses,
  seedOrders,
  seedPrescriptions,
  seedPayments,
  seedWishlists,
  seedSettings,
  seedReviews,
} from './seeds';
import { Cart } from '@/types';

/**
 * Initialize mock database into localStorage.
 * Only seeds if not already seeded with the current version.
 */
export function initializeMockDatabase(): void {
  const currentVersion = storage.get<string>(STORAGE_KEYS.SEED_VERSION);

  if (currentVersion === SEED_VERSION) {
    return; // already seeded with current version
  }

  seedAllData();
  storage.set(STORAGE_KEYS.SEED_VERSION, SEED_VERSION);
}

/**
 * Full reseed — overwrites ALL data with fresh seed data.
 */
export function reseedDatabase(): void {
  clearAllData();
  seedAllData();
  storage.set(STORAGE_KEYS.SEED_VERSION, SEED_VERSION);
}

/**
 * Clear all application data from localStorage.
 */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    storage.remove(key);
  });
}

function seedAllData(): void {
  storage.set(STORAGE_KEYS.USERS, seedUsers);
  storage.set(STORAGE_KEYS.CATEGORIES, seedCategories);
  storage.set(STORAGE_KEYS.PRODUCTS, seedProducts);
  storage.set(STORAGE_KEYS.ADDRESSES, seedAddresses);
  storage.set(STORAGE_KEYS.ORDERS, seedOrders);
  storage.set(STORAGE_KEYS.PRESCRIPTIONS, seedPrescriptions);
  storage.set(STORAGE_KEYS.PAYMENT_SUBMISSIONS, seedPayments);
  storage.set(STORAGE_KEYS.SETTINGS, seedSettings);

  // Seed wishlists keyed by user
  const wishlistMap: Record<string, string[]> = {};
  seedWishlists.forEach((w) => {
    wishlistMap[w.userId] = w.productIds;
  });
  storage.set(STORAGE_KEYS.WISHLIST, wishlistMap);

  // Reviews
  storage.set(STORAGE_KEYS.REVIEWS, seedReviews);

  // Empty cart by default
  const emptyCart: Cart = { items: [], updatedAt: new Date().toISOString() };
  storage.set(STORAGE_KEYS.CART, emptyCart);
}
