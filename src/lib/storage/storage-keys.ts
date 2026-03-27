export const STORAGE_KEYS = {
  // Auth
  USERS: 'pharma_users',
  CURRENT_SESSION: 'pharma_session',

  // Catalog
  PRODUCTS: 'pharma_products',
  CATEGORIES: 'pharma_categories',

  // Cart & Wishlist
  CART: 'pharma_cart',
  WISHLIST: 'pharma_wishlist',

  // Orders
  ORDERS: 'pharma_orders',

  // Prescriptions
  PRESCRIPTIONS: 'pharma_prescriptions',

  // Addresses
  ADDRESSES: 'pharma_addresses',

  // Payments
  PAYMENT_SUBMISSIONS: 'pharma_payments',

  // Settings
  SETTINGS: 'pharma_settings',

  // Seed version
  SEED_VERSION: 'pharma_seed_version',

  // UI
  RECENTLY_VIEWED: 'pharma_recently_viewed',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
