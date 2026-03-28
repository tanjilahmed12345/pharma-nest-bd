'use client';

import { ShieldCheck, Stethoscope, Lock, Truck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';
import { type TranslationKey } from '@/lib/i18n/translations';

const badges: { icon: typeof ShieldCheck; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: ShieldCheck, titleKey: 'trust.genuine', descKey: 'trust.genuineDesc' },
  { icon: Stethoscope, titleKey: 'trust.pharmacist', descKey: 'trust.pharmacistDesc' },
  { icon: Lock, titleKey: 'trust.secure', descKey: 'trust.secureDesc' },
  { icon: Truck, titleKey: 'trust.delivery', descKey: 'trust.deliveryDesc' },
];

export function TrustBadges() {
  const { t } = useTranslation();

  return (
    <section className="py-5 bg-muted/50 border-y border-border">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.titleKey} className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{t(badge.titleKey)}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t(badge.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
