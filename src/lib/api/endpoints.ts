/**
 * API Endpoint definitions.
 * Ready for when backend is connected.
 */

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (slug: string) => `/products/${slug}`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (slug: string) => `/categories/${slug}`,
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
    APPLY_COUPON: '/cart/coupon',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    TRACK: '/orders/track',
  },

  // Prescriptions
  PRESCRIPTIONS: {
    LIST: '/prescriptions',
    UPLOAD: '/prescriptions',
    DETAIL: (id: string) => `/prescriptions/${id}`,
  },

  // Addresses
  ADDRESSES: {
    LIST: '/addresses',
    CREATE: '/addresses',
    UPDATE: (id: string) => `/addresses/${id}`,
    DELETE: (id: string) => `/addresses/${id}`,
  },

  // Payments
  PAYMENTS: {
    SUBMIT: '/payments',
    DETAIL: (id: string) => `/payments/${id}`,
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
    PRESCRIPTIONS: '/admin/prescriptions',
    PAYMENTS: '/admin/payments',
    CUSTOMERS: '/admin/customers',
    SETTINGS: '/admin/settings',
  },
} as const;
