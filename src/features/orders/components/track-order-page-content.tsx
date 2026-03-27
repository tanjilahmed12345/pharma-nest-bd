'use client';

import { useOrderTracking } from '@/hooks';
import { TrackingSearchForm } from '@/components/order/tracking-search-form';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import { OrderTimeline } from '@/components/order/order-timeline';
import { OrderItemList } from '@/components/order/order-item-list';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { PAYMENT_STATUS_LABELS } from '@/lib/constants';
import { StatusPill } from '@/components/common/status-pill';
import { Search } from 'lucide-react';

export function TrackOrderPageContent() {
  const { order, isLoading, error, trackOrder } = useOrderTracking();

  const methodLabels: Record<string, string> = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', cod: 'Cash on Delivery' };

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Track Order' }]} className="mb-4" />

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Track Your Order</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your order number and phone to see the status</p>
        </div>

        <Card padding="lg" className="mb-6">
          <TrackingSearchForm onSearch={trackOrder} isLoading={isLoading} error={error} />
        </Card>

        {order && (
          <div className="space-y-4">
            <Card>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order</p>
                  <p className="text-lg font-bold font-mono">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <OrderStatusBadge status={order.orderStatus} />
                  <div className="mt-1">
                    <StatusPill status={order.paymentStatus} label={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus} />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold mb-2">Items</h3>
              <OrderItemList items={order.items} />
              <div className="flex justify-between pt-3 border-t border-border mt-3 text-sm font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold mb-3">Timeline</h3>
              <OrderTimeline timeline={order.statusTimeline} />
            </Card>

            <Card>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Payment:</span>
                <Badge variant="primary">{methodLabels[order.paymentMethod] || order.paymentMethod}</Badge>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
