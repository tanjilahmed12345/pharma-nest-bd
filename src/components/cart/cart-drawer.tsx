'use client';

import { useRouter } from 'next/navigation';
import { Drawer } from '@/components/ui/drawer';
import { useUIStore } from '@/store/ui.store';
import { useCart } from '@/hooks';
import { CartItemCard } from './cart-item-card';
import { CartEmpty } from './cart-empty';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/use-translation';

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartDrawerOpen);
  const setOpen = useUIStore((s) => s.setCartDrawer);
  const { cartItems, itemCount, subtotal, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const { t } = useTranslation();

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <Drawer isOpen={isOpen} onClose={() => setOpen(false)} title={`${t('cart.title')} (${itemCount})`}>
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
          <div className="border-t border-border p-4 space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span>{t('cart.subtotal')}</span>
              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>
            <Button fullWidth variant="outline" onClick={() => navigateTo('/cart')}>{t('cart.viewCart')}</Button>
            <Button fullWidth onClick={() => navigateTo('/checkout')}>{t('checkout.title')}</Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
