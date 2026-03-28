'use client';

import { formatPrice } from '@/lib/utils';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';

export interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  hasPrescriptionItems: boolean;
  onCheckout?: () => void;
  isLoading?: boolean;
}

export function CartSummary({ subtotal, itemCount, hasPrescriptionItems, onCheckout, isLoading }: CartSummaryProps) {
  const { t } = useTranslation();
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;

  return (
    <div className="space-y-3">
      {hasPrescriptionItems && (
        <Alert variant="warning">
          {t('cart.rxAlert')}
        </Alert>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('cart.subtotal')} ({itemCount} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('checkout.delivery')}</span>
          {deliveryCharge === 0 ? (
            <span className="text-secondary font-medium">{t('checkout.free')}</span>
          ) : (
            <span className="font-medium">{formatPrice(deliveryCharge)}</span>
          )}
        </div>
        {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
          </p>
        )}
        <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
          <span>{t('cart.total')}</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {onCheckout && (
        <Button fullWidth onClick={onCheckout} isLoading={isLoading} size="lg">
          <ShoppingCart className="h-4 w-4" />
          {t('cart.checkout')}
        </Button>
      )}
    </div>
  );
}
