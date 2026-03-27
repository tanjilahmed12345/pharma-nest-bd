import { Prescription } from '@/types';
import { Card } from '@/components/ui/card';
import { PrescriptionStatusBadge } from './prescription-status-badge';
import { formatDate } from '@/lib/utils';
import { FileText, User, Stethoscope, Calendar } from 'lucide-react';

export interface PrescriptionCardProps {
  prescription: Prescription;
  onReview?: () => void;
}

export function PrescriptionCard({ prescription, onReview }: PrescriptionCardProps) {
  return (
    <Card hover className="cursor-pointer" padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-semibold">{prescription.fileName}</p>
            <p className="text-xs text-muted-foreground">Uploaded {formatDate(prescription.createdAt)}</p>
          </div>
        </div>
        <PrescriptionStatusBadge status={prescription.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {prescription.patientName}</span>
        <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" /> {prescription.doctorName}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Issued: {prescription.issueDate}</span>
      </div>

      {prescription.pharmacistNote && (
        <div className="mt-3 p-2 bg-muted rounded-lg text-xs">
          <span className="font-medium">Pharmacist Note: </span>
          {prescription.pharmacistNote}
        </div>
      )}

      {onReview && (
        <button onClick={onReview} className="mt-3 text-xs text-primary font-medium hover:underline">
          Review Details
        </button>
      )}
    </Card>
  );
}
