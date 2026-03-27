import { cn } from '@/lib/utils';

export interface StatusPillProps {
  status: string;
  label: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  // Order
  pending: 'bg-warning/15 text-warning',
  prescription_review_pending: 'bg-secondary/15 text-secondary',
  approved: 'bg-primary/15 text-primary',
  processing: 'bg-primary/15 text-primary',
  packed: 'bg-accent/15 text-accent',
  shipped: 'bg-primary-light/15 text-primary-light',
  out_for_delivery: 'bg-primary-light/15 text-primary-light',
  delivered: 'bg-secondary/15 text-secondary',
  cancelled: 'bg-muted text-muted-foreground',
  rejected: 'bg-danger/15 text-danger',
  // Payment
  cod_pending: 'bg-warning/15 text-warning',
  submitted: 'bg-primary/15 text-primary',
  verified: 'bg-secondary/15 text-secondary',
  // Prescription
  needs_clarification: 'bg-warning/15 text-warning',
};

export function StatusPill({ status, label, className }: StatusPillProps) {
  const color = statusColors[status] || 'bg-muted text-muted-foreground';
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full', color, className)}>
      {label}
    </span>
  );
}
