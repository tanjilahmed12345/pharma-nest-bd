/**
 * API Endpoint definitions.
 * All routes are relative to the API base URL (/api).
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
    UPDATE: (productId: string) => `/cart/items/${productId}`,
    REMOVE: (productId: string) => `/cart/items/${productId}`,
    CLEAR: '/cart/clear',
  },

  // Wishlist
  WISHLIST: {
    LIST: '/wishlist',
    TOGGLE: '/wishlist',
    REMOVE: (productId: string) => `/wishlist/${productId}`,
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
    PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
    CATEGORIES: '/admin/categories',
    CATEGORY_DETAIL: (id: string) => `/admin/categories/${id}`,
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
    PRESCRIPTIONS: '/admin/prescriptions',
    PRESCRIPTION_DETAIL: (id: string) => `/admin/prescriptions/${id}`,
    PAYMENTS: '/admin/payments',
    PAYMENT_DETAIL: (id: string) => `/admin/payments/${id}`,
    CUSTOMERS: '/admin/customers',
    CUSTOMER_DETAIL: (id: string) => `/admin/customers/${id}`,
    SETTINGS: '/admin/settings',
  },
} as const;
