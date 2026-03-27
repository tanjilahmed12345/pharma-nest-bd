'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from '@/types';
import { orderService } from '@/services/orders';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import { OrderTimeline } from '@/components/order/order-timeline';
import { OrderItemList } from '@/components/order/order-item-list';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShoppingBag, Search, MapPin, Wallet, FileText } from 'lucide-react';

interface OrderSuccessContentProps {
  orderNumber: string;
}

export function OrderSuccessContent({ orderNumber }: OrderSuccessContentProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const o = await orderService.getOrderByNumber(orderNumber);
        setOrder(o);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [orderNumber]);

  if (isLoading) {
    return (
      <div className="container-custom py-10 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-custom py-12">
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="Order not found"
          description={`We couldn't find order "${orderNumber}". Please check the order number and try again.`}
          action={<Link href="/shop"><Button>Continue Shopping</Button></Link>}
        />
      </div>
    );
  }

  const methodLabels: Record<string, string> = {
    bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', cod: 'Cash on Delivery',
  };

  return (
    <div className="container-custom py-8 max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">Thank you for your order</p>
      </div>

      {/* Order number */}
      <Card className="text-center mb-4">
        <p className="text-sm text-muted-foreground">Order Number</p>
        <p className="text-xl font-bold font-mono text-primary mt-1">{order.orderNumber}</p>
        <div className="mt-2">
          <OrderStatusBadge status={order.orderStatus} />
        </div>
      </Card>

      {/* Alerts based on status */}
      {order.orderStatus === OrderStatus.PRESCRIPTION_REVIEW_PENDING && (
        <Alert variant="warning" title="Prescription Under Review" className="mb-4">
          Your order contains prescription medicines. Our pharmacist will review your prescription before processing the order.
        </Alert>
      )}

      {order.paymentMethod !== PaymentMethod.COD && order.paymentStatus === PaymentStatus.SUBMITTED && (
        <Alert variant="info" title="Payment Verification Pending" className="mb-4">
          Your payment is being verified. We will process your order once the payment is confirmed.
        </Alert>
      )}

      {order.paymentMethod === PaymentMethod.COD && (
        <Alert variant="info" title="Cash on Delivery" className="mb-4">
          Please keep {formatPrice(order.total)} ready for payment upon delivery.
        </Alert>
      )}

      {/* Order details */}
      <div className="space-y-4">
        {/* Items */}
        <Card>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h3>
          <OrderItemList items={order.items} />
        </Card>

        {/* Summary */}
        <Card>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{order.deliveryCharge === 0 ? 'Free' : formatPrice(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Delivery Address
          </h3>
          <p className="text-sm text-foreground">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {order.shippingAddress.houseFlat}, {order.shippingAddress.addressLine}, {order.shippingAddress.area}, {order.shippingAddress.upazila}, {order.shippingAddress.district}
          </p>
          <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
        </Card>

        {/* Payment */}
        <Card>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Payment
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="primary">{methodLabels[order.paymentMethod] || order.paymentMethod}</Badge>
            <Badge variant={order.paymentStatus === PaymentStatus.VERIFIED ? 'success' : 'warning'}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
            </Badge>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <h3 className="text-sm font-semibold mb-3">Order Timeline</h3>
          <OrderTimeline timeline={order.statusTimeline} />
        </Card>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link href="/track-order" className="flex-1">
          <Button fullWidth variant="outline">
            <Search className="h-4 w-4" />
            Track Order
          </Button>
        </Link>
        <Link href="/shop" className="flex-1">
          <Button fullWidth>
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
