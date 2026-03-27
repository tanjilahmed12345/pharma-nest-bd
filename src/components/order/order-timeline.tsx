import { OrderStatusEntry } from '@/types';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface OrderTimelineProps {
  timeline: OrderStatusEntry[];
  className?: string;
}

export function OrderTimeline({ timeline, className }: OrderTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {timeline.map((entry, idx) => {
        const isLast = idx === timeline.length - 1;

        return (
          <div key={idx} className="flex gap-3">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center shrink-0',
                  isLast ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border min-h-6" />}
            </div>

            {/* Content */}
            <div className={cn('pb-4', isLast && 'pb-0')}>
              <p className="text-sm font-medium text-foreground">
                {ORDER_STATUS_LABELS[entry.status] || entry.status}
              </p>
              <p className="text-xs text-muted-foreground">{formatDateTime(entry.timestamp)}</p>
              {entry.note && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">{entry.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
