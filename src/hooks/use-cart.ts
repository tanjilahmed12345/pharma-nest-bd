'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart.store';
import { cartService, CartItemWithProduct } from '@/services/cart';
import { Product } from '@/types';

/**
 * Hook for cart operations with resolved product data.
 */
export function useCart() {
  const cart = useCartStore((s) => s.cart);
  const itemCount = useCartStore((s) => s.getItemCount)();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await cartService.getCartItemsWithProducts();
      setCartItems(items);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-resolve product data whenever cart changes
  useEffect(() => {
    refreshItems();
  }, [cart.items, refreshItems]);

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + (ci.product.discountPrice || ci.product.price) * ci.quantity,
    0
  );

  const hasPrescriptionItems = cartItems.some(
    (ci) => ci.product.isPrescriptionRequired
  );

  return {
    cart,
    cartItems,
    itemCount,
    subtotal,
    hasPrescriptionItems,
    isLoading,
    addItem: cartService.addItem,
    removeItem: cartService.removeItem,
    updateQuantity: cartService.updateQuantity,
    clearCart: cartService.clearCart,
    setCoupon: cartService.setCoupon,
  };
}
