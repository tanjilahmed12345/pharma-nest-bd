import { PrescriptionStatus } from '@/types';
import { PRESCRIPTION_STATUS_LABELS } from '@/lib/constants';
import { StatusPill } from '@/components/common/status-pill';

export interface PrescriptionStatusBadgeProps {
  status: PrescriptionStatus;
  className?: string;
}

export function PrescriptionStatusBadge({ status, className }: PrescriptionStatusBadgeProps) {
  return <StatusPill status={status} label={PRESCRIPTION_STATUS_LABELS[status] || status} className={className} />;
}
