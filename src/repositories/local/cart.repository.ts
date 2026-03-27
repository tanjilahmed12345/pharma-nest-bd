import { ICartRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Cart, CartItem } from '@/types';
import { nowISO } from '@/lib/utils';

const emptyCart = (): Cart => ({ items: [], updatedAt: nowISO() });

export const localCartRepository: ICartRepository = {
  async getCart(): Promise<Cart> {
    return storage.get<Cart>(STORAGE_KEYS.CART) || emptyCart();
  },

  async addItem(productId, quantity): Promise<Cart> {
    const cart = storage.get<Cart>(STORAGE_KEYS.CART) || emptyCart();
    const existing = cart.items.find((i) => i.productId === productId);
    let newItems: CartItem[];

    if (existing) {
      newItems = cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      newItems = [...cart.items, { productId, quantity, addedAt: nowISO() }];
    }

    const updated: Cart = { ...cart, items: newItems, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.CART, updated);
    return updated;
  },

  async updateItemQuantity(productId, quantity): Promise<Cart> {
    const cart = storage.get<Cart>(STORAGE_KEYS.CART) || emptyCart();
    let newItems: CartItem[];

    if (quantity <= 0) {
      newItems = cart.items.filter((i) => i.productId !== productId);
    } else {
      newItems = cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    }

    const updated: Cart = { ...cart, items: newItems, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.CART, updated);
    return updated;
  },

  async removeItem(productId): Promise<Cart> {
    const cart = storage.get<Cart>(STORAGE_KEYS.CART) || emptyCart();
    const updated: Cart = {
      ...cart,
      items: cart.items.filter((i) => i.productId !== productId),
      updatedAt: nowISO(),
    };
    storage.set(STORAGE_KEYS.CART, updated);
    return updated;
  },

  async clearCart(): Promise<void> {
    storage.set(STORAGE_KEYS.CART, emptyCart());
  },

  async setCoupon(code): Promise<Cart> {
    const cart = storage.get<Cart>(STORAGE_KEYS.CART) || emptyCart();
    const updated: Cart = { ...cart, couponCode: code, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.CART, updated);
    return updated;
  },
};
