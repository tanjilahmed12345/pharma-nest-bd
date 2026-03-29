'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { orderService } from '@/services/orders';
import { useCartStore } from '@/store/cart.store';
import { useToastStore } from '@/store/toast.store';
import { useTranslation } from '@/lib/i18n/use-translation';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import { OrderTimeline } from '@/components/order/order-timeline';
import { OrderItemList } from '@/components/order/order-item-list';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { StatusPill } from '@/components/common/status-pill';
import { ArrowLeft, RotateCcw, MapPin, Wallet, Search, FileDown } from 'lucide-react';
import { downloadInvoice } from '@/lib/utils/generate-invoice';
import { useRouter } from 'next/navigation';

export function AccountOrderDetailsContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    orderService.getOrderById(orderId)
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  const handleReorder = async () => {
    if (!order) return;
    const items = await orderService.getReorderItems(order.id);
    items.forEach((item) => addItem(item.productId, item.quantity));
    addToast(t('toast.addedToCart'));
    router.push('/cart');
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-60 rounded-xl" /></div>;
  }

  if (notFound || !order) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="Order not found"
        action={<Link href="/account/orders"><Button variant="outline">Back to Orders</Button></Link>}
      />
    );
  }

  const methodLabels: Record<string, string> = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', cod: 'Cash on Delivery' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/account/orders" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
          </Link>
          <h1 className="text-xl font-bold font-mono">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <Button variant="outline" size="sm" onClick={() => downloadInvoice(order)}>
            <FileDown className="h-3.5 w-3.5" /> Invoice
          </Button>
          <Button variant="outline" size="sm" onClick={handleReorder}>
            <RotateCcw className="h-3.5 w-3.5" /> Reorder
          </Button>
        </div>
      </div>

      {/* Items */}
      <Card>
        <h3 className="text-sm font-semibold mb-2">Items</h3>
        <OrderItemList items={order.items} />
      </Card>

      {/* Totals */}
      <Card>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-secondary"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{order.deliveryCharge === 0 ? 'Free' : formatPrice(order.deliveryCharge)}</span></div>
          <div className="flex justify-between pt-2 border-t border-border font-bold text-base"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
        </div>
      </Card>

      {/* Address + Payment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-muted-foreground mt-1">{order.shippingAddress.houseFlat}, {order.shippingAddress.addressLine}, {order.shippingAddress.area}, {order.shippingAddress.district}</p>
          <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Wallet className="h-4 w-4 text-primary" /> Payment</h3>
          <Badge variant="primary">{methodLabels[order.paymentMethod] || order.paymentMethod}</Badge>
          <div className="mt-1">
            <StatusPill status={order.paymentStatus} label={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus} />
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <h3 className="text-sm font-semibold mb-3">Order Timeline</h3>
        <OrderTimeline timeline={order.statusTimeline} />
      </Card>
    </div>
  );
}
