import { OrderItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { PrescriptionBadge } from '@/components/product/prescription-badge';
import { Pill } from 'lucide-react';

export interface OrderItemListProps {
  items: OrderItem[];
}

export function OrderItemList({ items }: OrderItemListProps) {
  return (
    <div className="divide-y divide-border">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-3 py-3">
          <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <Pill className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
            <p className="text-xs text-muted-foreground">
              {item.strength} &middot; {item.packSize} &middot; Qty: {item.quantity}
            </p>
            {item.isPrescriptionRequired && <PrescriptionBadge className="mt-1" />}
          </div>
          <span className="text-sm font-semibold shrink-0">
            {formatPrice((item.discountPrice || item.price) * item.quantity)}
          </span>
        </div>
      ))}
    </div>
  );
}
