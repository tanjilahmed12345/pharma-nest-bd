/**
 * Repository Registry
 *
 * Central point for swapping between local and API implementations.
 * When the backend is ready, import API repositories here instead.
 *
 * Example future change:
 *   import { apiAuthRepository } from './api/auth.repository';
 *   export const authRepository = apiAuthRepository;
 */

import { apiAuthRepository } from './api/auth.repository';
import { localUserRepository } from './local/user.repository';
import { localProductRepository } from './local/product.repository';
import { localCategoryRepository } from './local/category.repository';
import { localAddressRepository } from './local/address.repository';
import { localCartRepository } from './local/cart.repository';
import { localWishlistRepository } from './local/wishlist.repository';
import { localOrderRepository } from './local/order.repository';
import { localPrescriptionRepository } from './local/prescription.repository';
import { localPaymentRepository } from './local/payment.repository';
import { localSettingsRepository } from './local/settings.repository';

export const authRepository = apiAuthRepository;
export const userRepository = localUserRepository;
export const productRepository = localProductRepository;
export const categoryRepository = localCategoryRepository;
export const addressRepository = localAddressRepository;
export const cartRepository = localCartRepository;
export const wishlistRepository = localWishlistRepository;
export const orderRepository = localOrderRepository;
export const prescriptionRepository = localPrescriptionRepository;
export const paymentRepository = localPaymentRepository;
export const settingsRepository = localSettingsRepository;
