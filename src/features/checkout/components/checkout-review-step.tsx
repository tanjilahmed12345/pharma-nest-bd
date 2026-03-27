'use client';

import { useRouter } from 'next/navigation';
import { Address, PaymentMethod, OrderPreview, Order } from '@/types';
import { AddressCard } from '@/components/checkout/address-card';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { OrderItemList } from '@/components/order/order-item-list';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShoppingCart, ShieldCheck } from 'lucide-react';

interface CheckoutReviewStepProps {
  preview: OrderPreview;
  selectedAddress: Address;
  paymentMethod: PaymentMethod;
  prescriptionId: string | null;
  note: string;
  onNoteChange: (value: string) => void;
  onBack: () => void;
  onPlaceOrder: () => Promise<Order | null>;
  isPlacingOrder: boolean;
  orderError: string | null;
}

const methodLabels: Record<string, string> = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  cod: 'Cash on Delivery',
};

export function CheckoutReviewStep({
  preview,
  selectedAddress,
  paymentMethod,
  prescriptionId,
  note,
  onNoteChange,
  onBack,
  onPlaceOrder,
  isPlacingOrder,
  orderError,
}: CheckoutReviewStepProps) {
  const router = useRouter();

  const handlePlace = async () => {
    const order = await onPlaceOrder();
    if (order) {
      router.push(`/order-success/${order.orderNumber}`);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold mb-1">Review Your Order</h2>
        <p className="text-sm text-muted-foreground">Please review the details before placing your order</p>
      </div>

      {/* Items */}
      <Card>
        <h3 className="text-sm font-semibold mb-2">Order Items ({preview.itemCount})</h3>
        <OrderItemList items={preview.items} />
      </Card>

      {/* Address */}
      <Card>
        <h3 className="text-sm font-semibold mb-2">Delivery Address</h3>
        <AddressCard address={selectedAddress} />
      </Card>

      {/* Payment */}
      <Card>
        <h3 className="text-sm font-semibold mb-2">Payment Method</h3>
        <Badge variant="primary" size="md">{methodLabels[paymentMethod] || paymentMethod}</Badge>
      </Card>

      {/* Prescription */}
      {prescriptionId && (
        <Card>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Prescription uploaded — pending pharmacist review</span>
          </div>
        </Card>
      )}

      {/* Note */}
      <Textarea
        label="Order Note (optional)"
        placeholder="Any special instructions..."
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        rows={2}
      />

      {/* Summary */}
      <CheckoutSummary preview={preview} />

      {/* Disclaimers */}
      <Alert variant="info">
        <p className="text-xs">
          By placing this order, you agree to our terms and conditions. Medicine images may vary from actual products. Delivery timelines are estimates.
          {preview.hasPrescriptionItems && ' Prescription medicines are subject to pharmacist approval.'}
        </p>
      </Alert>

      {orderError && (
        <Alert variant="danger" title="Order Failed">
          {orderError}
        </Alert>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handlePlace} isLoading={isPlacingOrder} size="lg">
          <ShoppingCart className="h-4 w-4" />
          Place Order
        </Button>
      </div>
    </div>
  );
}
