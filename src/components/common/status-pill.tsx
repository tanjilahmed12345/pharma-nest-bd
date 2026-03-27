import { cn } from '@/lib/utils';

export interface StatusPillProps {
  status: string;
  label: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  // Order
  pending: 'bg-amber-50 text-amber-700',
  prescription_review_pending: 'bg-purple-50 text-purple-700',
  approved: 'bg-blue-50 text-blue-700',
  processing: 'bg-blue-50 text-blue-700',
  packed: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-cyan-50 text-cyan-700',
  out_for_delivery: 'bg-teal-50 text-teal-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-50 text-red-700',
  // Payment
  cod_pending: 'bg-amber-50 text-amber-700',
  submitted: 'bg-blue-50 text-blue-700',
  verified: 'bg-green-50 text-green-700',
  // Prescription
  needs_clarification: 'bg-orange-50 text-orange-700',
};

export function StatusPill({ status, label, className }: StatusPillProps) {
  const color = statusColors[status] || 'bg-muted text-muted-foreground';
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full', color, className)}>
      {label}
    </span>
  );
}
