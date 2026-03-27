import { Alert } from '@/components/ui/alert';
import Link from 'next/link';

export function PrescriptionAlert() {
  return (
    <Alert variant="warning" title="Prescription Required">
      <p>
        Your cart contains medicines that require a valid prescription.
        Please{' '}
        <Link href="/upload-prescription" className="font-semibold underline">
          upload your prescription
        </Link>{' '}
        before or during checkout.
      </p>
    </Alert>
  );
}
