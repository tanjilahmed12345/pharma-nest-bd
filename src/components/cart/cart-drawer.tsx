'use client';

import Link from 'next/link';
import { Drawer } from '@/components/ui/drawer';
import { useUIStore } from '@/store/ui.store';
import { useCart } from '@/hooks';
import { CartItemCard } from './cart-item-card';
import { CartEmpty } from './cart-empty';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartDrawerOpen);
  const setOpen = useUIStore((s) => s.setCartDrawer);
  const { cartItems, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <Drawer isOpen={isOpen} onClose={() => setOpen(false)} title={`Cart (${itemCount})`}>
      {cartItems.length === 0 ? (
        <div className="p-4">
          <CartEmpty />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 divide-y divide-border">
            {cartItems.map((ci) => (
              <CartItemCard
                key={ci.productId}
                product={ci.product}
                quantity={ci.quantity}
                onUpdateQuantity={(qty) => updateQuantity(ci.productId, qty)}
                onRemove={() => removeItem(ci.productId)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span>Subtotal</span>
              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/cart" onClick={() => setOpen(false)}>
              <Button fullWidth variant="outline">View Cart</Button>
            </Link>
            <Link href="/checkout" onClick={() => setOpen(false)}>
              <Button fullWidth className="mt-2">Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
