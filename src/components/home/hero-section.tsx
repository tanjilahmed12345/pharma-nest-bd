import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Upload } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="container-custom py-12 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Your Trusted Online Pharmacy in Bangladesh
          </h1>
          <p className="text-base md:text-lg text-teal-100 mb-8">
            Order genuine medicines online with fast delivery across Bangladesh. Verified by licensed pharmacists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-teal-50 w-full sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop Now
              </Button>
            </Link>
            <Link href="/upload-prescription">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                <Upload className="h-4 w-4" />
                Upload Prescription
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
