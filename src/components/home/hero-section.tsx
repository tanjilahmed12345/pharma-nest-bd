'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Upload } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-primary via-primary-dark to-accent dark:from-[#0d2e2b] dark:via-[#0a2424] dark:to-[#0e2530] text-white">
      <div className="container-custom py-10 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-base md:text-lg text-white/70 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button
                variant="secondary"
                size="lg"
                className="bg-secondary text-white hover:bg-secondary-light hover:text-primary-dark w-full sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4" />
                {t('hero.shopNow')}
              </Button>
            </Link>
            <Link
              href="/upload-prescription"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-base font-medium rounded-lg border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/70 transition-all w-full sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              {t('nav.uploadRx')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
