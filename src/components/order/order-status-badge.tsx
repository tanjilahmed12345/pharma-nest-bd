import { OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { StatusPill } from '@/components/common/status-pill';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return <StatusPill status={status} label={ORDER_STATUS_LABELS[status] || status} className={className} />;
}
