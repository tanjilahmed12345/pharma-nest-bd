import { create } from 'zustand';
import { Cart, CartItem } from '@/types';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { nowISO } from '@/lib/utils';

interface CartState {
  cart: Cart;
  loadCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string | undefined) => void;
  getItemCount: () => number;
}

const emptyCart: Cart = { items: [], updatedAt: nowISO() };

function persistCart(cart: Cart) {
  storage.set(STORAGE_KEYS.CART, cart);
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart,

  loadCart: () => {
    const cart = storage.get<Cart>(STORAGE_KEYS.CART) || emptyCart;
    set({ cart });
  },

  addItem: (productId, quantity = 1) => {
    const { cart } = get();
    const existing = cart.items.find((i) => i.productId === productId);
    let newItems: CartItem[];

    if (existing) {
      newItems = cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      newItems = [...cart.items, { productId, quantity, addedAt: nowISO() }];
    }

    const newCart: Cart = { ...cart, items: newItems, updatedAt: nowISO() };
    persistCart(newCart);
    set({ cart: newCart });
  },

  removeItem: (productId) => {
    const { cart } = get();
    const newCart: Cart = {
      ...cart,
      items: cart.items.filter((i) => i.productId !== productId),
      updatedAt: nowISO(),
    };
    persistCart(newCart);
    set({ cart: newCart });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const { cart } = get();
    const newCart: Cart = {
      ...cart,
      items: cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
      updatedAt: nowISO(),
    };
    persistCart(newCart);
    set({ cart: newCart });
  },

  clearCart: () => {
    const newCart = { ...emptyCart, updatedAt: nowISO() };
    persistCart(newCart);
    set({ cart: newCart });
  },

  setCoupon: (code) => {
    const { cart } = get();
    const newCart: Cart = { ...cart, couponCode: code, updatedAt: nowISO() };
    persistCart(newCart);
    set({ cart: newCart });
  },

  getItemCount: () => {
    return get().cart.items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
