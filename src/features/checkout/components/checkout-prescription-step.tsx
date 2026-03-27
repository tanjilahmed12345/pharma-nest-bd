'use client';

import { useState } from 'react';
import { PrescriptionStatus } from '@/types';
import { prescriptionService } from '@/services/prescription';
import { PrescriptionUploader } from '@/components/prescription/prescription-uploader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { nowISO } from '@/lib/utils';

interface CheckoutPrescriptionStepProps {
  userId: string;
  prescriptionId: string | null;
  onSetPrescription: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function CheckoutPrescriptionStep({
  userId,
  prescriptionId,
  onSetPrescription,
  onContinue,
  onBack,
  canProceed,
}: CheckoutPrescriptionStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const handleUpload = async (data: {
    patientName: string;
    doctorName: string;
    issueDate: string;
    notes: string;
    fileName: string;
  }) => {
    // Validate
    const errs: Record<string, string> = {};
    if (!data.patientName) errs.patientName = 'Patient name is required';
    if (!data.doctorName) errs.doctorName = 'Doctor name is required';
    if (!data.issueDate) errs.issueDate = 'Issue date is required';
    if (!data.fileName) errs.fileName = 'Please upload a prescription file';
    if (Object.keys(errs).length > 0) {
      setUploadErrors(errs);
      return;
    }

    setIsUploading(true);
    setUploadErrors({});
    try {
      const prescription = await prescriptionService.uploadPrescription({
        userId,
        imageUrl: `/prescriptions/mock-${Date.now()}.jpg`,
        fileName: data.fileName,
        patientName: data.patientName,
        doctorName: data.doctorName,
        issueDate: data.issueDate,
        notes: data.notes || undefined,
        status: PrescriptionStatus.PENDING,
      });
      onSetPrescription(prescription.id);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Prescription Upload</h2>
        <p className="text-sm text-muted-foreground">
          Your order contains prescription medicines. Please upload a valid prescription.
        </p>
      </div>

      <Alert variant="warning">
        A licensed pharmacist will review your prescription before processing the order. Please ensure the prescription is clear and legible.
      </Alert>

      {prescriptionId ? (
        <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
          <CheckCircle2 className="h-6 w-6 text-secondary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Prescription Uploaded</p>
            <p className="text-xs text-muted-foreground">Your prescription has been submitted for review.</p>
          </div>
        </div>
      ) : (
        <PrescriptionUploader
          onSubmit={handleUpload}
          isLoading={isUploading}
          errors={uploadErrors}
        />
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onContinue} disabled={!canProceed}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
