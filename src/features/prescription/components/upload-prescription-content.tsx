'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks';
import { prescriptionService } from '@/services/prescription';
import { PrescriptionStatus } from '@/types';
import { PrescriptionUploader } from '@/components/prescription/prescription-uploader';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';

export function UploadPrescriptionContent() {
  const { userId, isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: { patientName: string; doctorName: string; issueDate: string; notes: string; fileName: string }) => {
    const errs: Record<string, string> = {};
    if (!data.patientName) errs.patientName = 'Required';
    if (!data.doctorName) errs.doctorName = 'Required';
    if (!data.issueDate) errs.issueDate = 'Required';
    if (!data.fileName) errs.fileName = 'Please select a file';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsUploading(true);
    setErrors({});
    try {
      await prescriptionService.uploadPrescription({
        userId: userId || 'guest',
        imageUrl: `/prescriptions/mock-${Date.now()}.jpg`,
        fileName: data.fileName,
        patientName: data.patientName,
        doctorName: data.doctorName,
        issueDate: data.issueDate,
        notes: data.notes || undefined,
        status: PrescriptionStatus.PENDING,
      });
      setUploaded(true);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Upload Prescription' }]} className="mb-4" />

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Upload Prescription</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your doctor&apos;s prescription for prescription medicines
          </p>
        </div>

        <Alert variant="info" className="mb-6">
          Our licensed pharmacist will review your prescription within a few hours. You will be notified once it is approved.
        </Alert>

        {!isAuthenticated ? (
          <Card className="text-center" padding="lg">
            <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-2">Login Required</h2>
            <p className="text-sm text-muted-foreground mb-4">Please sign in to upload a prescription.</p>
            <Link href="/login"><Button>Sign In</Button></Link>
          </Card>
        ) : uploaded ? (
          <Card className="text-center" padding="lg">
            <CheckCircle2 className="h-12 w-12 text-secondary mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-2">Prescription Uploaded!</h2>
            <p className="text-sm text-muted-foreground mb-4">Our pharmacist will review it shortly.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/account/prescriptions"><Button variant="outline">My Prescriptions</Button></Link>
              <Link href="/shop"><Button>Shop Medicines</Button></Link>
            </div>
          </Card>
        ) : (
          <Card padding="lg">
            <PrescriptionUploader onSubmit={handleSubmit} isLoading={isUploading} errors={errors} />
          </Card>
        )}
      </div>
    </div>
  );
}
