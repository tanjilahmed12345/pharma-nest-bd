import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Upload, ShieldCheck } from 'lucide-react';

export function PrescriptionCta() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Prescription Service</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Have a Prescription?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your prescription and our licensed pharmacist will review it. We&apos;ll prepare your medicines and deliver them to your doorstep.
            </p>
            <Link href="/upload-prescription">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Upload className="h-4 w-4" />
                Upload Prescription
              </Button>
            </Link>
          </div>
          <div className="hidden md:flex h-32 w-32 bg-purple-100 rounded-full items-center justify-center">
            <Upload className="h-16 w-16 text-purple-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
