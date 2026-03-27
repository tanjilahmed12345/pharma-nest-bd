'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { adminOrderService } from '@/services/admin';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants';
import { AdminPageHeader } from './admin-page-header';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import { OrderTimeline } from '@/components/order/order-timeline';
import { OrderItemList } from '@/components/order/order-item-list';
import { StatusPill } from '@/components/common/status-pill';
import { StatusSelect } from '@/components/admin/status-select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { ArrowLeft, MapPin, Wallet, Search } from 'lucide-react';

const statusOptions = Object.values(OrderStatus).map((s) => ({
  label: ORDER_STATUS_LABELS[s] || s,
  value: s,
}));

const methodLabels: Record<string, string> = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', cod: 'Cash on Delivery' };

export function AdminOrderDetailsContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = async () => {
    try {
      const o = await adminOrderService.getOrderById(orderId);
      setOrder(o);
    } catch {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [orderId]);

  const handleStatusChange = async (status: string) => {
    await adminOrderService.updateOrderStatus(orderId, status as OrderStatus, `Status updated to ${ORDER_STATUS_LABELS[status] || status}`);
    load();
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-60 rounded-xl" /></div>;

  if (notFound || !order) {
    return <EmptyState icon={<Search className="h-12 w-12" />} title="Order not found" action={<Link href="/admin/orders"><Button variant="outline">Back to Orders</Button></Link>} />;
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title={order.orderNumber}
        description={`Placed on ${formatDate(order.createdAt)}`}
        actions={<Link href="/admin/orders"><Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button></Link>}
      />

      {/* Status control */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Update to:</span>
            <StatusSelect value={order.orderStatus} onChange={handleStatusChange} options={statusOptions} />
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card>
        <h3 className="text-sm font-semibold mb-2">Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</h3>
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
          <div className="mt-1"><StatusPill status={order.paymentStatus} label={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus} /></div>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <h3 className="text-sm font-semibold mb-3">Timeline</h3>
        <OrderTimeline timeline={order.statusTimeline} />
      </Card>
    </div>
  );
}
