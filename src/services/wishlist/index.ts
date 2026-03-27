import { wishlistRepository, productRepository } from '@/repositories';
import { Product } from '@/types';

export const wishlistService = {
  getWishlistIds(userId: string): Promise<string[]> {
    return wishlistRepository.getWishlist(userId);
  },

  /**
   * Get wishlist items with full product data.
   */
  async getWishlistProducts(userId: string): Promise<Product[]> {
    const ids = await wishlistRepository.getWishlist(userId);
    const products: Product[] = [];
    for (const id of ids) {
      const product = await productRepository.getById(id);
      if (product) products.push(product);
    }
    return products;
  },

  addToWishlist(userId: string, productId: string): Promise<string[]> {
    return wishlistRepository.addItem(userId, productId);
  },

  removeFromWishlist(userId: string, productId: string): Promise<string[]> {
    return wishlistRepository.removeItem(userId, productId);
  },

  isInWishlist(userId: string, productId: string): Promise<boolean> {
    return wishlistRepository.hasItem(userId, productId);
  },

  async toggleWishlist(userId: string, productId: string): Promise<boolean> {
    const isWished = await wishlistRepository.hasItem(userId, productId);
    if (isWished) {
      await wishlistRepository.removeItem(userId, productId);
      return false;
    } else {
      await wishlistRepository.addItem(userId, productId);
      return true;
    }
  },

  clearWishlist(userId: string): Promise<void> {
    return wishlistRepository.clearWishlist(userId);
  },
};
