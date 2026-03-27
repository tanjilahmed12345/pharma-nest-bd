import Link from 'next/link';
import { Order } from '@/types';
import { Card } from '@/components/ui/card';
import { OrderStatusBadge } from './order-status-badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { PAYMENT_STATUS_LABELS } from '@/lib/constants';
import { StatusPill } from '@/components/common/status-pill';
import { Package } from 'lucide-react';

export interface OrderCardProps {
  order: Order;
  href?: string;
}

export function OrderCard({ order, href }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const content = (
    <Card hover padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/5 rounded-lg flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold font-mono">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">{itemCount} item{itemCount !== 1 && 's'}</span>
          <StatusPill status={order.paymentStatus} label={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus} />
        </div>
        <span className="font-bold text-primary">{formatPrice(order.total)}</span>
      </div>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
