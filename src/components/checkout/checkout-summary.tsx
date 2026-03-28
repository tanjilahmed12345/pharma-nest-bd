'use client';

import { useState } from 'react';
import { OrderPreview } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { CouponInput } from './coupon-input';

export interface CheckoutSummaryProps {
  preview: OrderPreview;
  onCouponApply?: (code: string, discount: number) => void;
  onCouponRemove?: () => void;
  showCouponInput?: boolean;
}

export function CheckoutSummary({ preview, onCouponApply, onCouponRemove, showCouponInput = false }: CheckoutSummaryProps) {
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const couponDiscount = appliedCoupon?.discount || 0;
  const adjustedTotal = preview.total - couponDiscount;

  const handleApply = (code: string, discount: number) => {
    setAppliedCoupon({ code, discount });
    onCouponApply?.(code, discount);
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    onCouponRemove?.();
  };

  return (
    <Card>
      <h3 className="text-base font-semibold mb-3">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({preview.itemCount})</span>
          <span>{formatPrice(preview.subtotal)}</span>
        </div>
        {preview.discount > 0 && (
          <div className="flex justify-between text-secondary">
            <span>Product Savings</span>
            <span>-{formatPrice(preview.discount)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-secondary">
            <span>Coupon ({appliedCoupon?.code})</span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          {preview.deliveryCharge === 0 ? (
            <span className="text-secondary font-medium">Free</span>
          ) : (
            <span>{formatPrice(preview.deliveryCharge)}</span>
          )}
        </div>

        {showCouponInput && (
          <div className="pt-2 border-t border-border">
            <CouponInput
              subtotal={preview.subtotal}
              appliedCoupon={appliedCoupon}
              onApply={handleApply}
              onRemove={handleRemove}
            />
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(adjustedTotal > 0 ? adjustedTotal : 0)}</span>
        </div>
      </div>
    </Card>
  );
}
