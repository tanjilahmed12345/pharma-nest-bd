import { Cart, CartItem } from '@/types';

export interface ICartRepository {
  getCart(userId?: string): Promise<Cart>;
  addItem(productId: string, quantity: number, userId?: string): Promise<Cart>;
  updateItemQuantity(productId: string, quantity: number, userId?: string): Promise<Cart>;
  removeItem(productId: string, userId?: string): Promise<Cart>;
  clearCart(userId?: string): Promise<void>;
  setCoupon(code: string | undefined, userId?: string): Promise<Cart>;
}
