import { formatPrice } from '@/lib/utils';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { ShoppingCart } from 'lucide-react';

export interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  hasPrescriptionItems: boolean;
  onCheckout?: () => void;
  isLoading?: boolean;
}

export function CartSummary({ subtotal, itemCount, hasPrescriptionItems, onCheckout, isLoading }: CartSummaryProps) {
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;

  return (
    <div className="space-y-3">
      {hasPrescriptionItems && (
        <Alert variant="warning">
          Your cart contains prescription medicines. You will need to upload a valid prescription during checkout.
        </Alert>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          {deliveryCharge === 0 ? (
            <span className="text-secondary font-medium">Free</span>
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
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {onCheckout && (
        <Button fullWidth onClick={onCheckout} isLoading={isLoading} size="lg">
          <ShoppingCart className="h-4 w-4" />
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
}
