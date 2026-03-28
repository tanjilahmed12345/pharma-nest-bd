'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks';
import { prescriptionService } from '@/services/prescription';
import { Prescription } from '@/types';
import { PrescriptionCard } from '@/components/prescription/prescription-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { FileText, Upload } from 'lucide-react';

export function AccountPrescriptionsContent() {
  const { userId } = useCurrentUser();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refillingId, setRefillingId] = useState<string | null>(null);
  const [refillSuccess, setRefillSuccess] = useState(false);

  const loadPrescriptions = () => {
    if (!userId) return;
    prescriptionService.getPrescriptions(userId).then(setPrescriptions).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPrescriptions();
  }, [userId]);

  const handleRefill = async (prescriptionId: string) => {
    setRefillingId(prescriptionId);
    setRefillSuccess(false);
    try {
      await prescriptionService.requestRefill(prescriptionId);
      setRefillSuccess(true);
      loadPrescriptions();
      setTimeout(() => setRefillSuccess(false), 4000);
    } finally {
      setRefillingId(null);
    }
  };

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
        <Link href="/upload-prescription">
          <Button size="sm"><Upload className="h-4 w-4" /> Upload New</Button>
        </Link>
      </div>

      {refillSuccess && (
        <Alert variant="success">
          Refill request submitted! Our pharmacist will review it shortly.
        </Alert>
      )}

      {prescriptions.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="No prescriptions"
          description="You haven't uploaded any prescriptions yet."
          action={<Link href="/upload-prescription"><Button>Upload Prescription</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {prescriptions.map((p) => (
            <PrescriptionCard
              key={p.id}
              prescription={p}
              onRefill={handleRefill}
              isRefilling={refillingId === p.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
