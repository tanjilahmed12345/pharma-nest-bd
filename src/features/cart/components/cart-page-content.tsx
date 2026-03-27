'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks';
import { useCurrentUser } from '@/hooks';
import { checkoutService } from '@/services/checkout';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { CartSummary } from '@/components/cart/cart-summary';
import { CartEmpty } from '@/components/cart/cart-empty';
import { PrescriptionAlert } from '@/components/prescription/prescription-alert';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Tag } from 'lucide-react';

export function CartPageContent() {
  const { cartItems, itemCount, subtotal, hasPrescriptionItems, isLoading, removeItem, updateQuantity } = useCart();
  const { isAuthenticated } = useCurrentUser();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ valid: boolean; message: string } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = checkoutService.validateCoupon(couponInput.trim(), subtotal);
    setCouponMessage({ valid: result.valid, message: result.message });
  };

  if (isLoading) {
    return (
      <div className="container-custom py-6 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-48" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} className="mb-4" />
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} className="mb-4" />

      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({itemCount} items)</h1>

      {hasPrescriptionItems && (
        <div className="mb-4">
          <PrescriptionAlert />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="md:col-span-2">
          <Card padding="none">
            <div className="divide-y divide-border">
              {cartItems.map((ci) => (
                <div key={ci.productId} className="px-4">
                  <CartItemCard
                    product={ci.product}
                    quantity={ci.quantity}
                    onUpdateQuantity={(qty) => updateQuantity(ci.productId, qty)}
                    onRemove={() => removeItem(ci.productId)}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Link href="/shop" className="inline-block mt-4 text-sm text-primary font-medium hover:underline">
            &larr; Continue Shopping
          </Link>
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="sticky top-24 space-y-4">
            {/* Coupon */}
            <Card>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-primary" />
                Coupon Code
              </h3>
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-1"
                />
                <Button variant="outline" size="md" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>
              {couponMessage && (
                <p className={`text-xs mt-2 ${couponMessage.valid ? 'text-secondary' : 'text-danger'}`}>
                  {couponMessage.message}
                </p>
              )}
            </Card>

            {/* Summary */}
            <Card>
              <CartSummary
                subtotal={subtotal}
                itemCount={itemCount}
                hasPrescriptionItems={hasPrescriptionItems}
              />

              <div className="mt-4">
                {isAuthenticated ? (
                  <Link href="/checkout">
                    <Button fullWidth size="lg">Proceed to Checkout</Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Alert variant="info">
                      Please log in to proceed to checkout.
                    </Alert>
                    <Link href="/login">
                      <Button fullWidth>Log In to Checkout</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
