import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Upload } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary via-primary-dark to-accent text-white">
      <div className="container-custom py-10 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Your Trusted Online Pharmacy in Bangladesh
          </h1>
          <p className="text-base md:text-lg text-white/70 mb-8">
            Order genuine medicines online with fast delivery across Bangladesh. Verified by licensed pharmacists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button
                variant="secondary"
                size="lg"
                className="bg-secondary text-white hover:bg-secondary-light hover:text-primary-dark w-full sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop Now
              </Button>
            </Link>
            <Link
              href="/upload-prescription"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-base font-medium rounded-lg border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/70 transition-all w-full sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
