import { OrderPreview } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export interface CheckoutSummaryProps {
  preview: OrderPreview;
}

export function CheckoutSummary({ preview }: CheckoutSummaryProps) {
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
            <span>Savings</span>
            <span>-{formatPrice(preview.discount)}</span>
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
        <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(preview.total)}</span>
        </div>
      </div>
    </Card>
  );
}
